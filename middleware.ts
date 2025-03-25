import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl;

    // ✅ Allow public pages & authentication routes
    if (
        pathname.startsWith("/api/") || 
        pathname.startsWith("/_next") ||
        pathname.startsWith("/landing") ||  // ✅ Allow public access to landing
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/sign-in") ||  
        pathname.startsWith("/sign-up") ||  
        pathname.startsWith("/oauth") ||    
        pathname.startsWith("/sso-callback") 
    ) {
        return; // ✅ Allow access without authentication
    }

    // ✅ Authenticate user
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
        return NextResponse.redirect(new URL("/landing", req.nextUrl)); // 🔹 Redirect non-auth users to landing
    }

    // ✅ Ensure user exists in DB
    try {
        const userExists = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!userExists.length) {
            const clerk = await clerkClient();
            const user = await clerk.users.getUser(userId);
            const email = user?.emailAddresses[0]?.emailAddress || null;

            await db.insert(users).values({
                id: userId,
                email: email ?? '',
                isPro: false,
                proModelUsageThisMonth: 150,
                eliteModelUsageThisMonth: 50,
                proModelUsageToday: 0,
            });

            console.log(`✅ New user created in DB: ${userId}`);
        }
    } catch (error) {
        console.error("❌ Error inserting user into DB:", error);
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)"], // ✅ Apply middleware to all protected routes
};