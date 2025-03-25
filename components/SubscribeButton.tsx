"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  /**
   * Fetch the current user's subscription status
   */
  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch("/api/subscription-status");
      if (res.ok) {
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  /**
   * 1. Check if user is subscribed on mount
   */
  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  /**
   * 2. Re-check subscription status on window focus.
   *
   *    This ensures that when the user returns from
   *    Stripe's Checkout or Billing Portal, the button
   *    state is updated correctly.
   */
  useEffect(() => {
    const handleFocus = () => {
      fetchSubscriptionStatus();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  /**
   * 3. Handle button click
   */
  const handleClick = async () => {
    setLoading(true);
    try {
      if (!isSubscribed) {
        // Create a new Checkout Session
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          }),
        });

        const data = await res.json();
        if (!data.url) throw new Error("Failed to create Stripe session");

        // Redirect to the Checkout Session
        window.location.href = data.url;
      } else {
        // Already subscribed → Go to the Billing Portal
        const res = await fetch("/api/stripe/portal", { method: "POST" });
        const { url } = await res.json();
        if (!url) throw new Error("Failed to create Stripe portal session");

        // Redirect to the Billing Portal
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 4. Render the button
   */
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-1 bg-orange-600 text-white rounded-md"
    >
      {loading ? "Loading..." : isSubscribed ? "Manage Subscription" : "Upgrade to PRO"}
    </button>
  );
}