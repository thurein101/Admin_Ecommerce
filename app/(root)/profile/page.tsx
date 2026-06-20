// app/profile/page.tsx

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/profile-avatar";
import { ProfileForm } from "@/components/profileForm"; // 🌟 အသစ်ထည့်လိုက်သော Form Component
import { Calendar, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ClearHistoryButton } from "@/components/clearHistoryOrderUser";



export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // User ရဲ့ Data အစုံအလင်ကို DB မှ ပြန်ဆွဲထုတ်ခြင်း (ဖုန်းနှင့် လိပ်စာ အမြဲ real-time ရစေရန်)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // User ရဲ့ Orders သမိုင်းကြောင်းအား ဆွဲထုတ်ခြင်း
  const orders = await prisma.order.findMany({
  where: { 
    userId: session.user.id,
    isHidden: false // 🌟 ဤနေရာကို မေ့နေတတ်သည်
  },
  include: {
    orderItems: { include: { product: true } },
  },
  orderBy: { createdAt: "desc" },
});

  if (!dbUser) redirect("/login");

  return (
    <div className="min-h-screen w-full bg-gray-50/50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
{/* ဘယ်ဘက်ခြမ်း (Fixed Width/Spacing) */}
        <div className="md:col-span-4 h-fit">
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center">
              <ProfileAvatar initialImage={dbUser.image} name={dbUser.name} />
              <h2 className="text-xl font-bold mt-4 text-gray-800">{dbUser.name}</h2>
              <Badge variant="secondary" className="mt-2">{dbUser.role}</Badge>
              <p className="text-xs text-muted-foreground mt-2">{dbUser.email}</p>
            </div>
            
            <ProfileForm user={dbUser} />
          </div>
        </div>

        {/* 🚚 ညာဘက်ခြမ်း: Real-time Order Tracking (8 Columns) */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-800">Order History & Tracking</h2>
          </div>

          {orders.length > 0 && <ClearHistoryButton />}

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-2xl text-muted-foreground text-sm shadow-sm">
              <Package className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              You haven&apos;t placed any orders yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                  {/* Order Top Bar Info */}
                  <div className="bg-gray-50/70 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-mono font-medium block">ORDER ID: #{order.id.slice(-8).toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Live Status Badge */}
                    <div>
                      <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${
                        order.status === "PROCESSING" ? "bg-blue-50 text-blue-600 border-blue-100" :
                        order.status === "SHIPPED" ? "bg-purple-50 text-purple-600 border-purple-100" :
                        order.status as any === "COMPLETED" ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-50 text-gray-600"
                      }`}>
                        {order.status === "PROCESSING" ? "⏱️ Processing" : 
                         order.status === "SHIPPED" ? "🚚 Shipped / In Transit" : "✅ Delivered"}
                      </span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-6 divide-y">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="relative h-12 w-12 bg-gray-50 rounded-lg overflow-hidden border flex-shrink-0">
                          <Image src={item.product.images[0] || "https://placehold.co/100"} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 truncate">{item.product.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Bottom Price Summary */}
                  <div className="bg-gray-50/30 px-6 py-3 border-t flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Payment Status: <strong className="text-green-600 font-medium">{order.paymentStatus}</strong></span>
                    <span className="font-bold text-gray-900 text-base">Total: ${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}