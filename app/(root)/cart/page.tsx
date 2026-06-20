// app/cart/page.tsx
"use client";

import { useCart } from "@/hooks/use-cart";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validations/checkout";
import { placeOrderAction } from "@/lib/actions/order";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus, CreditCard, Lock } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Dangrek } from "next/font/google";

export default function CartPage() {
  const cart = useCart();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
 

  const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: "", city: "", state: "", postalCode: "", country: "",
      cardNumber: "", expiry: "", cvc: ""
    }
  });

  const onSubmit = (data: CheckoutFormValues) => {
    startTransition(async () => {
      const addressData = {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country
      };

      const itemsData = cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const result = await placeOrderAction(addressData, itemsData);

      if (result.error) {
        toast.error("Order Failed")
      } else {
        toast.success("Order Successfully");
        cart.clearCart(); // Zustand ခြင်းတောင်းကို ရှင်းမယ်
        router.push("/profile"); // Order list သွားကြည့်ရန် User profile သို့ ပို့မယ်
      }
    });
  };

  const {data : session} = useSession();

  if (cart.items.length === 0) {
    return (
      <>
       
        <div className="text-center py-20 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold">Your shopping cart is empty</h2>
          <Button className="mt-4" onClick={() => router.push("/")}>Go Shopping</Button>
        </div>
      </>
    );
  }

  return (
   <div className="min-h-screen w-full bg-gray-50">
      
     <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* Shopping Cart List */}
        <div className="lg:col-span-7 space-y-6">
            <Button onClick={()=>{router.push("/")}}>Go Back Home</Button>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {cart.items.length === 0 ? (
              <p className="text-gray-500 py-10 text-center">Your cart is empty.</p>
            ) : (
              cart.items.map((item) => (
               <div key={item.id} className="flex items-center gap-3 md:gap-6 border-b border-gray-100 py-4 md:py-6">
  {/* ပုံ size ကို md: မှာ ပိုကြီးပေးလိုက်ပါ */}
  <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden bg-gray-100 relative flex-shrink-0">
    <Image src={item.image} alt={item.name} fill className="object-cover" />
  </div>
  
  <div className="flex-1 min-w-0"> {/* min-w-0 က text တွေ overflow မဖြစ်အောင် ကူညီပေးပါတယ် */}
    <h3 className="font-semibold text-sm md:text-lg truncate">{item.name}</h3>
    <p className="text-gray-900 font-bold text-sm md:text-base">${item.price.toFixed(2)}</p>
  </div>

  <div className="flex flex-col items-center gap-2">
    <div className="flex items-center gap-1 border rounded-full px-1 py-0.5">
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => item.quantity > 1 && cart.updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
      <span className="font-medium text-xs w-6 text-center">{item.quantity}</span>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
    </div>
    <Button variant="ghost" size="sm" className="text-red-500 h-8 text-xs" onClick={() => cart.removeItem(item.id)}>Remove</Button>
  </div>
</div>
              ))
            )}
          </div>
        </div>

        {/* Checkout / Auth Section */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg sticky top-24 space-y-6">
            <h2 className="text-2xl font-bold">Checkout</h2>
            
            {!session ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                <Lock className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-4">Please sign in to checkout</p>
                <Button onClick={() => router.push("/login")} className="w-full">Sign In</Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Shipping Address</h3>
              <Input placeholder="Street Address" {...form.register("street")} disabled={isPending} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="City" {...form.register("city")} disabled={isPending} />
                <Input placeholder="State / Region" {...form.register("state")} disabled={isPending} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Postal Code" {...form.register("postalCode")} disabled={isPending} />
                <Input placeholder="Country" {...form.register("country")} disabled={isPending} />
              </div>

              {/* Fake Credit Card Inputs */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pt-2 flex items-center gap-1">
                <CreditCard className="h-4 w-4" /> Fake Payment (Simulated)
              </h3>
              <Input placeholder="Card Number (16 digits)" maxLength={16} {...form.register("cardNumber")} disabled={isPending} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="MM/YY" maxLength={5} {...form.register("expiry")} disabled={isPending} />
                <Input placeholder="CVC" maxLength={3} {...form.register("cvc")} disabled={isPending} />
              </div>

                <div className="pt-6 border-t flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalAmount.toFixed(2)}</span>
                </div>
                <Button type="submit" className="w-full h-12 text-lg" disabled={isPending}>
                  {isPending ? "Processing..." : "Pay Now"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

 