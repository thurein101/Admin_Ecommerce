"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client"; // Better Auth hooks
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Layers,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { router } from "better-auth/api";
import { Logo } from "../Logo";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession(); // 🌟 Admin ရဲ့ Session Data လှမ်းယူခြင်း

  const routes = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Layers },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  const router = useRouter();

  return (
    <div className="w-64 h-screen bg-white text-gray-900 flex flex-col justify-between border-r border-gray-200">
      <div className="flex flex-col pt-6">
        <div className="px-6 pb-6 border-b border-gray-100">
         <Logo/>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-1">
            Admin Panel
          </p>
        </div>

        <nav className="mt-6 px-4 space-y-0.5">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gray-100 text-black font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* iOS Style Profile Card */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-4">
        {session?.user && (
          <div className="flex items-center gap-3 px-1">
            <div className="h-9 w-9 rounded-full relative overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-bold uppercase text-gray-500">
                  {session.user.name.slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {session.user.name}
              </h4>
              <p className="text-[11px] text-gray-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-[11px] font-semibold transition shadow-sm"
          >
            <ArrowLeft className="h-3 w-3" /> Home
          </Link>
          <button
            onClick={async () => {
              await signOut(); // Session အရင်ဖျက်ပါ
              router.push("/"); // ပြီးမှ home ကို ပို့ပါ
              router.refresh(); // UI လတ်ဆတ်သွားအောင် refresh လုပ်ပါ
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-red-50 text-red-500 rounded-lg text-[11px] font-semibold transition shadow-sm"
          >
            <LogOut className="h-3 w-3" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
