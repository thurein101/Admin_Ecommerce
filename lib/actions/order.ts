
"use server";


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";



interface OrderItemInput {
  id: string;
  quantity: number;
  price: number;
}

export async function placeOrderAction(shippingAddress: any, cartItems: OrderItemInput[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    return { error: "Please login to place an order." };
  }

  if (cartItems.length === 0) {
    return { error: "Your cart is empty." };
  }

  try {
    // 🌟 PRISMA TRANSACTION စတင်ခြင်း (အကုန်အောင်မြင်မှ ဒေတာသွင်းမည်)
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      // ၁။ ပစ္စည်းတစ်ခုချင်းစီရဲ့ စတော့ကို အရင်စစ်ဆေးပြီး လျှော့ချခြင်း
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Product not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Sorry, "${product.name}" is out of stock or insufficient!`);
        }

        // စတော့ကို လျှော့ချခြင်း
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        totalAmount += item.price * item.quantity;
      }

      // ၂။ Order Record အား သိမ်းဆည်းခြင်း
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          paymentStatus: "PAID", // Fake Card ဖြစ်၍ တန်းအောင်မြင်သည်ဟု သတ်မှတ်
          status: "PROCESSING",
          shippingAddress: shippingAddress, // JSON snapshot object
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return order;
    });

    // Cache များအား Clear လုပ်ပေးခြင်း
    revalidatePath("/");
    revalidatePath("/admin/products");
    
    return { success: true, orderId: result.id };
  } catch (error: any) {
    return { error: error.message || "Failed to process order." };
  }
}


export async function updateOrderStatusAction(orderId: string, newStatus: "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED") {
  // Admin ဟုတ်မဟုတ် အရင်စစ်ဆေးခြင်း
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized! Admin only." };
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus } as any,
    });

    // Admin ရဲ့ Orders list page ရော User ရဲ့ Profile page ပါ Data အသစ်ချက်ချင်းပြရန် revalidate လုပ်မယ်
    revalidatePath("/admin/orders");
    revalidatePath("/profile");

    return { success: true, data: updatedOrder };
  } catch (error) {
    return { error: "Failed to update order status." };
  }
}

// app/actions/order.ts သို့မဟုတ် သင်၏ action file
export async function hideOrderHistoryAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) return { error: "Unauthorized" };

  try {
    // ခဏတာ စမ်းသပ်ရန် status ကို ဖယ်ထားပါ
    const result = await prisma.order.updateMany({
      where: { 
        userId: session.user.id,
        // status: "COMPLETED" // ဤအချက်ကြောင့် မပျောက်တာ ဖြစ်နိုင်သည်
      },
      data: { isHidden: true },
    });
    
    console.log("Updated count:", result.count); // Terminal တွင် ဘယ်နှစ်ခု update ဖြစ်သွားလဲ ကြည့်ပါ
    
    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update history" };
  }
}


export async function archiveDailyOrdersAction(date: Date) {
  const startOfDay = new Date(date.setHours(0,0,0,0));
  const endOfDay = new Date(date.setHours(23,59,59,999));

  await prisma.order.updateMany({
    where: {
      createdAt: { gte: startOfDay, lte: endOfDay },
      isArchived: false
    },
    data: { isArchived: true }
  });
  revalidatePath("/admin/orders");
}