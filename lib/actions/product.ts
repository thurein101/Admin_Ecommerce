// app/actions/product.ts
"use server";

import { productSchema } from "@/lib/validations/product";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";



// 1. CREATE PRODUCT ACTION
export async function createProductAction(values: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized! Admin only." };
  }

  const validation = productSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Validation failed." };
  }

  try {
    const product = await prisma.product.create({
      data: validation.data,
    });
    
    // Admin product list page ရဲ့ cache ကို clear လုပ်ပြီး data အသစ်ပြရန်
    revalidatePath("/admin/products");
    return { success: true, data: product };
  } catch (error) {
    return { error: "Failed to create product in database." };
  }
}

// 2. UPDATE PRODUCT ACTION
export async function updateProductAction(id: string, values: unknown) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized!" };
  }

  const validation = productSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Validation failed." };
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validation.data,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`); // User ဘက်က product detail page ကိုပါ update ဖြစ်စေရန်
    return { success: true, data: updatedProduct };
  } catch (error) {
    return { error: "Failed to update product." };
  }
}

// 3. DELETE PRODUCT ACTION
export async function deleteProductAction(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized!" };
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product." };
  }
}