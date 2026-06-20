// lib/admin-guard.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return session.user;
}