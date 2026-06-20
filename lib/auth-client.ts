import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Vercel ကပေးတဲ့ URL ကို Environment Variable ထဲမှာ ထည့်ထားရပါမယ်
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
});

export const { signIn, signUp, signOut, useSession } = authClient;