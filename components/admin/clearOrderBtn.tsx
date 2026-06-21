"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { archiveDailyOrdersAction } from "@/lib/actions/order"; // Server Action ကို သုံးရပါမယ်
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ClearOrdersButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClear = async () => {
    const confirmed = window.confirm("ဒီနေ့အတွက် စာရင်းအားလုံးကို ရှင်းလင်းပြီး Archive လုပ်မှာ သေချာပါသလား?");
    if (!confirmed) return;

    setLoading(true);
    try {
      // ဒီမှာ Client ကနေ Server Action ကိုပဲ ခေါ်ပါမယ်
      await archiveDailyOrdersAction(); 
      toast.success("ဒီနေ့အတွက် စာရင်းရှင်းပြီး Archive လုပ်ပြီးပါပြီ။");
      router.push("/admin/reports");
    } catch (error) {
      toast.error("တစ်ခုခုမှားယွင်းနေပါသည်။");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClear} disabled={loading} variant="destructive">
      {loading ? "Clearing..." : "Clear Today's Orders"}
    </Button>
  );
}