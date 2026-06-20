
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";



export async function updateProfileImageAction(imageUrl: string) {
  // ၁။ Session ရှိမရှိ အရင်စစ်ဆေးခြင်း
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized. Please log in first." };
  }

  try {
    // ၂။ Better Auth ရဲ့ User Table ထဲက image field ကို update လုပ်ခြင်း
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    // ၃။ Profile ရော Navbar မှာပါ ပုံအသစ် ချက်ချင်းပြောင်းသွားစေရန် Cache ရှင်းခြင်း
    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { error: "Failed to update profile image." };
  }
}

export async function updateProfileDetailsAction(data: { name: string; phone?: string; address?: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,     // Prisma Schema တွင် phone, address field များ ထည့်ထားရန် လိုပါမည်
        address: data.address,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update profile details." };
  }
}

export async function deleteUserAction(userId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Admin ဟုတ်မဟုတ် ထပ်စစ်ပါ
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete user" };
  }
}

export async function updateUserRoleAction(userId: string, newRole: "USER" | "ADMIN") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update role" };
  }
}