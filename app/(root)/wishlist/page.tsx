

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";


export default async function WishlistPage() {
  // Session ရှိမရှိ စစ်ဆေးပြီး မရှိပါက Login ပို့မည်
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // User ရဲ့ Favorite ပစ္စည်းများကို Database မှ ဆွဲထုတ်ခြင်း
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      product: true, // Product Details ပါ တစ်ခါတည်း တွဲယူမည်
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen w-full bg-gray-50/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 border-b pb-4 mb-8">
          <Heart className="h-6 w-6 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold">My Wishlist ({favorites.length})</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-2xl shadow-sm">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-sm mt-1">Tap the heart icon on products to save them here.</p>
          </div>
        ) : (
          // သိမ်းထားသော ပစ္စည်းများအား Grid စနစ်ဖြင့် ပြန်ပြခြင်း
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((fav) => (
              <ProductCard 
                key={fav.id} 
                product={fav.product as any} 
                isFavoritedInitially={true} // Wishlist ထဲရောက်နေ၍ Heart ကို fill လုပ်ထားရန်
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}