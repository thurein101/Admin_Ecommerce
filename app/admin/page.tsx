import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileAvatar } from "@/components/profile-avatar";
import { prisma } from "@/lib/prisma"; // Prisma ကို import ပါ

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session || session.user.role !== "ADMIN") redirect("/admin");

  // 🌟 DB ထဲက အချက်အလက် အစုံအလင်ကို ပြန်ဆွဲထုတ်ပါ
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!dbUser) redirect("/admin");

  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl font-bold mb-6">Admin Profile Settings</h1>
      
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        <div className="flex flex-col items-center">
          <ProfileAvatar 
            initialImage={dbUser.image} 
            name={dbUser.name} 
          />
          <h2 className="mt-4 text-lg font-semibold">{dbUser.name}</h2>
          <p className="text-gray-500">{dbUser.email}</p>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h3 className="font-medium">Account Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="text-xs text-gray-500">Phone</label>
              <div className="font-semibold">{dbUser.phone || "Not set"}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="text-xs text-gray-500">Role</label>
              <div className="font-semibold text-primary uppercase">{dbUser.role}</div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-xs text-gray-500">Address</label>
            <div className="font-semibold">{dbUser.address || "Not set"}</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="text-xs text-gray-500">Member Since</label>
            <div className="font-semibold">
              {new Date(dbUser.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}