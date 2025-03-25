// app/api/stripe/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env"; // Ensure your env variables are loaded here
import stripe from "@/lib/stripe"; // Your preconfigured Stripe instance
import { currentUser } from "@clerk/nextjs/server";

/**
 * POST /api/stripe/checkout
 *
 * This endpoint creates a Stripe Checkout Session for a subscription.
 * It uses Clerk to fetch the current authenticated user and includes
 * metadata (userId) in both the session and the subscription data.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body to retrieve the priceId (the Stripe Price ID)
    const { priceId } = await request.json();
    if (!priceId) {
      console.error("🚨 Missing priceId in request body");
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // Retrieve the current authenticated user via Clerk
    const user = await currentUser();
    if (!user) {
      console.error("🚨 Unauthorized: No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's Stripe Customer ID from private metadata (if available)
    const stripeCustomerId = user.privateMetadata?.stripeCustomerId as
      | string
      | undefined;

    console.log("✅ Creating Stripe Checkout session for user:", user.id);

    // Create a new Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Define allowed payment methods
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/`,
      // If a Stripe customer already exists, use it; otherwise, set customer_email
      customer: stripeCustomerId,
      customer_email: !stripeCustomerId
        ? user.emailAddresses[0].emailAddress
        : undefined,
      // Attach metadata to the session
      metadata: {
        userId: user.id, // 🔥 Must store the user ID here
      },
      // Attach metadata to the subscription as well
      subscription_data: {
        metadata: {
          userId: user.id, // 🔥 Must store the user ID inside subscription data too
        },
      },
    });

    console.log(
      "✅ Stripe Checkout Session Created:",
      session.id,
      session.metadata
    );

    // Return the session URL for redirection on the client side
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("🚨 Error creating checkout session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}