import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { UpdateRoleButton } from "@/components/admin/updaterolebtn";
import { DeleteUserButton } from "@/components/admin/DeleteUserBtn";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


import { UserAvatarView } from "@/components/admin/AdminUserView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (session?.user.id === id) redirect("/admin");

  // User အချက်အလက်နှင့်အတူ နောက်ဆုံး Order အခြေအနေကိုပါ ဆွဲထုတ်ခြင်း
  const user = await prisma.user.findUnique({ 
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });
  
  if (!user) notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto">

        <Link 
        href="/admin/users" 
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          <UserAvatarView 
            image={user.image} 
            name={user.name || "User"} 
            className="h-24 w-24 text-2xl" 
          />
          <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* User Overview Details */}
        <div className="grid grid-cols-2 gap-4 border-t pt-6">
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-xs text-gray-500 uppercase">Role</label>
            <p className="font-semibold">{user.role}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-xs text-gray-500 uppercase">Phone</label>
            <p className="font-semibold">{user.phone || "Not set"}</p>
          </div>
          <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
            <label className="text-xs text-gray-500 uppercase">Shipping Address</label>
            <p className="font-semibold text-sm">{user.address || "No address provided"}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-xs text-gray-500 uppercase">Joined Date</label>
            <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-xs text-gray-500 uppercase">Last Order</label>
            <p className="font-semibold text-sm">
              {user.orders.length > 0 ? user.orders[0].status : "No orders yet"}
            </p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <UpdateRoleButton userId={user.id} currentRole={user.role} />
          <DeleteUserButton userId={user.id} />
        </div>
      </div>
    </div>
  );
}