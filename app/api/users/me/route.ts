import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  // Authenticate user via Clerk
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user from your database
    const dbUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!dbUser.length) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Fetch user from Clerk API (optional, if needed)
    const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const clerkUser = await clerkRes.json();

    return NextResponse.json({
      id: dbUser[0].id,
      name: dbUser[0].name || clerkUser.first_name,
      email: dbUser[0].email || clerkUser.email_addresses[0]?.email_address,
      image: dbUser[0].image || clerkUser.image_url,
      isPro: dbUser[0].isPro, // From your DB
      usageLimits: {
        proModelUsageThisMonth: dbUser[0].proModelUsageThisMonth,
        eliteModelUsageThisMonth: dbUser[0].eliteModelUsageThisMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}