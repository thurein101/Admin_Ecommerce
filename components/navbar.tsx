// components/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client"; // Better Auth Hook
import { useCart } from "@/hooks/use-cart"; // Zustand Cart Store
import {
  ShoppingCart,
  Heart,
  User,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const cart = useCart();
  const router = useRouter();
  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === "ADMIN";

  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname(); // 👈 လက်ရှိ URL ကိုယူပါ

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  // အခုလိုရေးထားရင် Home Page (/) ကိုပဲ ပြန်ပို့ပြီး search query ပါသွားပါလိမ့်မယ်
  const url = searchQuery.trim() ? `/?search=${encodeURIComponent(searchQuery)}` : "/";
  router.push(url);
};
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ၁။ ဘယ်ဘက်ခြမ်း: BRAND LOGO */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80"
        >
          NEXT<span className="text-primary">SHOP</span>
        </Link>

        {/* ၂။ အလယ်ပိုင်း: NAV LINKS */}
       <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      <Link 
        href="/" 
        className={cn(
          "transition hover:text-primary",
          pathname === "/" ? "text-primary font-bold" : "text-muted-foreground"
        )}
      >
        Home
      </Link>
      <Link 
        href="/products" 
        className={cn(
          "transition hover:text-primary",
          pathname === "/products" ? "text-primary font-bold" : "text-muted-foreground"
        )}
      >
        All Products
      </Link>
    </nav>
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <Input
              type="text"
              placeholder="Search..." // Mobile မှာ စာတိုအောင်ပြင်ထားပါ
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // md: တွေဖြုတ်ပြီး အားလုံးမှာ ပေါ်အောင်လုပ်ပါ
              className="w-full bg-gray-50 border-gray-200 pl-4 pr-10 rounded-full transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-gray-400 group-hover:text-primary transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* ၃။ ညာဘက်ခြမ်း: WISHLIST, CART & AUTH DROPDOWN */}
        <div className="flex items-center gap-4">
          {/* Wishlist Link */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-gray-600" />
            </Link>
          </Button>

          {/* Cart Link with Badge Count */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 text-gray-600" />

              {/* 🌟 ပြင်ဆင်ချက်: စုစုပေါင်းအရေအတွက်ကို တွက်ချက်ခြင်း */}
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center animate-in fade-in zoom-in-50">
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
          </Button>

          {/* User Auth Dropdown Logic */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                {/* User Avatar ပုံရှိရင်ပြမယ်၊ မရှိရင် Default စာသားပြမယ် */}
                <div className="h-9 w-9 rounded-full relative overflow-hidden border bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-90">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold uppercase text-gray-600">
                      {session.user.name.slice(0, 2)}
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 mt-1 rounded-xl shadow-lg"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Regular Profile Link */}
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer gap-2 py-2.5 rounded-lg"
                >
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4" /> My Profile & Orders
                  </Link>
                </DropdownMenuItem>

                {/* 🌟 ROLE က ADMIN ဖြစ်နေမှသာ ဤ LINK အား ပြမည် */}
                {isAdmin && (
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer gap-2 py-2.5 text-blue-600 focus:text-blue-600 font-medium rounded-lg"
                  >
                    <Link href="/admin">
                      <MakeAdminIcon /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                {/* Log Out */}
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut(); // Session အရင်ဖျက်ပါ
                    router.push("/"); // ပြီးမှ home ကို ပို့ပါ
                    router.refresh(); // UI လတ်ဆတ်သွားအောင် refresh လုပ်ပါ
                  }}
                  className="cursor-pointer gap-2 py-2.5 text-red-600 focus:text-red-600 font-medium rounded-lg"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // အကောင့်မဝင်ရသေးလျှင် ပြသမည့် Login ခလုတ်
            <Button size="sm" className="rounded-xl px-4" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// Admin Icon အတွက် သီးသန့် အသေးစား helper
function MakeAdminIcon() {
  return <LayoutDashboard className="h-4 w-4" />;
}
