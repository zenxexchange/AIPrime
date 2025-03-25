import { clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const client = await clerkClient();
  const users = await client.users.getUserList();

  for (const user of users.data) {
    const { isPro } = user.privateMetadata || {};

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: { proModelUsageToday: 0 }
    });

    if (isPro && new Date().getDate() === 1) {
      await client.users.updateUserMetadata(user.id, {
        privateMetadata: { eliteModelUsageThisMonth: 50 }
      });
    }
  }

  console.log("✅ Usage limits reset.");
  return new Response("Limits reset successfully.", { status: 200 });
}