
"use server";


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "../prisma";



// Review Validation Schema (Rating သည် ၁ မှ ၅ အတွင်း ဖြစ်ရမည်)
const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1, "Please give at least 1 star").max(5, "Maximum 5 stars allowed"),
  comment: z.string().min(5, "Comment must be at least 5 characters long"),
});

export async function createReviewAction(values: z.infer<typeof reviewSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return { error: "You must be logged in to leave a review." };
  }

  const validation = reviewSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Invalid review data." };
  }

  const { productId, rating, comment } = validation.data;

  try {
    // Review အသစ်ကို Database ထဲ သိမ်းခြင်း
    await prisma.review.create({
      data: {
        productId,
        rating,
        comment,
        userId: session.user.id,
      },
    });

    // Detail page cache ကို clear လုပ်ပြီး review အသစ် ချက်ချင်းပေါ်လာစေရန်
    revalidatePath(`/products/${productId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to submit review." };
  }
}

export async function deleteReviewAction(reviewId: string) {
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath("/products/[id]"); // Update the page
}

export async function editReviewAction(reviewId: string, data: { comment: string, rating: number }) {
  await prisma.review.update({
    where: { id: reviewId },
    data: { comment: data.comment, rating: data.rating },
  });
  revalidatePath("/products/[id]");
}