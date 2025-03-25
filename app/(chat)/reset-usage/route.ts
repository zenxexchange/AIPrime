import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function GET() {
  try {
    // Reset daily pro usage
    await db.update(users).set({ proModelUsageToday: 0 });

    // Reset monthly limits on the 1st of each month
    const now = new Date();
    if (now.getDate() === 1) {
      await db.update(users).set({
        proModelUsageThisMonth: 150,
        eliteModelUsageThisMonth: 50
      });
    }

    console.log("✅ Usage limits reset successfully.");
    return new Response("Usage limits reset.", { status: 200 });
  } catch (error) {
    console.error("🚨 Error resetting limits:", error);
    return new Response("Error resetting limits.", { status: 500 });
  }
}