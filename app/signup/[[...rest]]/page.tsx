'use client';

import { useEffect } from 'react';
import { SignUp, useSignUp, useUser } from '@clerk/nextjs';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';

export default function SignUpPage() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      addUserToDatabase(user);
    }
  }, [isSignedIn, user]);

  async function addUserToDatabase(user: any) {
    try {
      await db.insert(users).values({
        id: user.id,
        name: user.fullName || null,
        email: user.primaryEmailAddress?.emailAddress || null,
        image: user.imageUrl || null,
        isPro: false // Default new users to not Pro
      });
      console.log('✅ User added to database:', user.id);
    } catch (error) {
      console.error('🚨 Error adding user to database:', error);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp routing="path" path="/signup" />
    </div>
  );
}