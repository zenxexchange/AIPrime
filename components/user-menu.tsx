"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs";

export function UserMenu() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isSignedIn, router]);

  return (
    <div className="p-3">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-8 py-2 text-white bg-blue-600 rounded-md">Sign In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-2">
          <UserButton />
          <span>{user?.fullName}</span>
        </div>
      </SignedIn>
    </div>
  );
}