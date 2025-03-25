import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe"; // Import your pre-configured Stripe instance
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // ✅ Retrieve `stripeCustomerId` from Clerk private metadata
  const stripeCustomerId = user.privateMetadata?.stripeCustomerId as string;

  if (!stripeCustomerId) {
    console.error("🚨 No stripeCustomerId found for this user");
    return NextResponse.json(
      { error: "No stripeCustomerId found for this user" },
      { status: 400 }
    );
  }

  try {
    // ✅ Create Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("🚨 Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe portal session" },
      { status: 500 }
    );
  }
}