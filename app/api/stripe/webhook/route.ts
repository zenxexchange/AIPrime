import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { Stripe } from "stripe";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    console.error("🚨 Missing Stripe signature");
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("🚨 Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  console.log("🔵 Received Stripe Webhook:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer as string;

    if (!userId || !stripeCustomerId) {
      console.error("🛑 Missing userId or stripeCustomerId in metadata");
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    console.log("✅ Updating subscription for:", userId);

    try {
      // ✅ Use isPro (TypeScript) instead of is_pro (DB)
      await db
        .update(users)
        .set({ isPro: true }) // ✅ Correct field name
        .where(eq(users.id, userId));

      // Update Clerk metadata (keep isPro for JSON consistency)
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          isPro: true,
          stripeCustomerId,
        },
      });

      console.log(`✅ Successfully updated user ${userId} to Pro`);
    } catch (error) {
      console.error("🚨 Error updating subscription:", error);
      return NextResponse.json({ error: "Subscription update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}