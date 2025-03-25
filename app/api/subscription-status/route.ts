import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db"; // Adjust path if needed
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // 1️⃣ Get user from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ isSubscribed: false }, { status: 401 });
    }

    // 2️⃣ Query Drizzle database to get the user's subscription status
    const dbUser = await db
      .select({ isPro: users.isPro }) // Fetch only isPro field
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    // 3️⃣ Check if user exists in DB
    if (!dbUser.length) {
      return NextResponse.json({ isSubscribed: false }, { status: 404 });
    }

    // 4️⃣ Return correct subscription status
    const isSubscribed = dbUser[0].isPro ?? false;
    return NextResponse.json({ isSubscribed });
  } catch (error) {
    console.error("🚨 Error fetching subscription status:", error);
    return NextResponse.json({ isSubscribed: false }, { status: 500 });
  }
}