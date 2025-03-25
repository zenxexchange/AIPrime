import { NextResponse, type NextRequest } from "next/server";
import { generateId } from "ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { chats, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { SupportedModels } from "@/lib/constant";
import { api } from "@/trpc/server";

/**
 * ✅ Fetch all chats for the authenticated user
 */
export async function GET() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userChats = await db.select().from(chats).where(eq(chats.user_id, userId));
    return NextResponse.json(userChats);
  } catch (error) {
    console.error("❌ Error fetching chats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * ✅ Create a new chat with usage limits
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json;
  try {
    json = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { usage, messages, title, chatId } = json || {};
  if (!usage || !usage.model || !messages || messages.length === 0) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }

  // 🛑 Validate model selection
  const model = usage.model;
  const modelData = SupportedModels.find((m) => m.value === model);
  if (!modelData) {
    return NextResponse.json({ error: `Invalid model: ${model}` }, { status: 400 });
  }

  const modelTier = modelData.tier; // "basic", "pro", or "elite"

  // 🟢 Fetch user data from Drizzle DB
  let dbUser;
  try {
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    dbUser = result[0];

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Extract user limits
  const {
    isPro = false,
    proModelUsageToday = 0,
    lastResetDate = "",
    proModelUsageThisMonth = 150,
    eliteModelUsageThisMonth = 50,
  } = dbUser;

  const today = new Date().toISOString().split("T")[0];

  // ✅ Reset daily limits if it's a new day
  if (lastResetDate !== today) {
    await db
      .update(users)
      .set({ proModelUsageToday: 0, lastResetDate: today })
      .where(eq(users.id, userId));
  }

  // 🟠 Enforce usage limits
  if (!isPro && modelTier === "pro" && (proModelUsageToday as number) >= 2) {
    return NextResponse.json({ error: "You've reached your daily Pro limit (2/day)." }, { status: 403 });
  }

  if (!isPro && modelTier === "elite") {
    return NextResponse.json({ error: "Elite models are for Pro users only." }, { status: 403 });
  }

  if (isPro && modelTier === "pro" && (proModelUsageThisMonth as number) <= 0) {
    return NextResponse.json({ error: "You've used all 150 Pro messages this month." }, { status: 403 });
  }

  if (isPro && modelTier === "elite" && (eliteModelUsageThisMonth as number) <= 0) {
    return NextResponse.json({ error: "You've used all 50 Elite messages this month." }, { status: 403 });
  }

  // ✅ Check if chat exists (if chatId is provided)
  if (chatId) {
    try {
      const existingChat = await api.chat.detail.query({ chatId });

      if (!existingChat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      const chatModelData = SupportedModels.find(m => m.value === existingChat.usage.model);
      if (!chatModelData) {
        return NextResponse.json({ error: `Invalid model selection in chat.` }, { status: 400 });
      }

      if (!isPro && chatModelData.tier === "pro") {
        return NextResponse.json({ error: "You cannot continue using Pro models as a free user." }, { status: 403 });
      }

      if (isPro && chatModelData.tier === "elite" && (eliteModelUsageThisMonth as number) <= 0) {
        return NextResponse.json({ error: "Elite model limit reached. Upgrade for more." }, { status: 403 });
      }
    } catch (error) {
      console.error("❌ Error checking existing chat:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  // ✅ Generate Chat ID only if it's a new chat
  const id = chatId || generateId();
  const chatTitle = title || "Untitled";

  try {
    const data = await api.chat.create.mutate({
      id,
      title: chatTitle,
      usage,
      messages,
    });

    console.log(`✅ Chat saved successfully. Chat ID: ${id}`);

    // ✅ Update usage limits in DrizzleDB
    if (modelTier === "pro") {
      await db
        .update(users)
        .set({
          proModelUsageToday: (proModelUsageToday as number) + 1,
          proModelUsageThisMonth: (proModelUsageThisMonth as number) - 1,
        })
        .where(eq(users.id, userId));
    } else if (modelTier === "elite") {
      await db
        .update(users)
        .set({
          eliteModelUsageThisMonth: (eliteModelUsageThisMonth as number) - 1,
        })
        .where(eq(users.id, userId));
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error saving chat:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * ✅ Delete all chats for the authenticated user
 */
export async function DELETE() {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await api.chat.deleteAll.mutate();
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("❌ Error deleting chats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}