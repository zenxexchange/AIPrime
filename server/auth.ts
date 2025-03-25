import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export const createTRPCContext = async ({ req }: { req: NextApiRequest }) => {
  const { userId } = getAuth(req);  // ✅ Get user ID from Clerk
  if (!userId) return { user: null };

  return {
    user: { id: userId },
  };
};