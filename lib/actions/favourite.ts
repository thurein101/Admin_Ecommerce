
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";



export async function toggleFavoriteAction(productId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return { error: "Please log in to add favorites." };
  }

  const userId = session.user.id;

  try {
    // အရင်ဆုံး ရှိပြီးသား ဟုတ်မဟုတ် စစ်မယ်
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingFavorite) {
      // ရှိပြီးသားဆိုရင် ဖျက်မယ် (Unfavorite)
      await prisma.favorite.delete({
        where: { userId_productId: { userId, productId } },
      });
      revalidatePath("/");
      return { success: true, isFavorite: false };
    } else {
      // မရှိသေးရင် ဒေတာအသစ်သွင်းမယ် (Favorite)
      await prisma.favorite.create({
        data: { userId, productId },
      });
      revalidatePath("/");
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    return { error: "Something went wrong with wishlist." };
  }
}