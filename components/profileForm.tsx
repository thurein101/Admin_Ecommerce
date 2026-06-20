"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfileDetailsAction } from "@/lib/actions/user";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

interface ProfileFormProps {
  user: {
    name: string | null; // null ဖြစ်နိုင်ချေကို ထည့်ပေးပါ
    phone: string | null;
    address: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    startTransition(async () => {
      const result = await updateProfileDetailsAction({ name, phone, address });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully!");
        router.refresh(); // Page ကို ပြန်လည် Refresh လုပ်ပြီး အချက်အလက်အသစ်ကို ပေါ်စေခြင်း
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t text-left">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" placeholder="09xxxxxxxxx" />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Shipping Address</label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" placeholder="Your address" />
      </div>

      <Button type="submit" disabled={isPending} className="w-full mt-2 gap-2">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Changes
      </Button>
    </form>
  );
}