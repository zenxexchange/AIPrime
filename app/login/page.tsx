'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SignIn, SignUp, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function AuthPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, user } = useUser(); // ✅ Get the authentication status

  useEffect(() => {
    if (isSignedIn) {
      // ✅ Redirect authenticated users away from login/signup
      router.push('/dashboard'); // Change this to your main page
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      {pathname === "/signup" ? <SignUp /> : <SignIn />}
    </div>
  );
}