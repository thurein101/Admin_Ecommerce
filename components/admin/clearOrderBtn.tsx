// components/admin/clearOrderBtn.tsx မှာ
"use client";
import { useState } from "react";
import { archiveDailyOrdersAction } from "@/lib/actions/order";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ClearOrdersButton() {
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    // အတည်ပြုချက်တောင်းမယ်
    const confirmed = window.confirm("ဒီနေ့အတွက် စာရင်းအားလုံးကို ရှင်းလင်းပြီး Archive လုပ်မှာ သေချာပါသလား?");
    if (!confirmed) return;

    setLoading(true);
    await archiveDailyOrdersAction(new Date());
    toast.success("ဒီနေ့အတွက် စာရင်းရှင်းပြီး Archive လုပ်ပြီးပါပြီ။");
    window.location.reload(); // Refresh အမြန်ဆုံးနည်း
    setLoading(false);
  };

  return (
    <Button onClick={handleClear} disabled={loading} variant="destructive">
      {loading ? "Clearing..." : "Clear Today's Orders"}
    </Button>
  );
}