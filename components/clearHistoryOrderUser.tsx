"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // App Router အတွက်
import {  hideOrderHistoryAction } from "@/lib/actions/order";

export function ClearHistoryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClearHistory = () => {
    startTransition(async () => {
      const result = await hideOrderHistoryAction(); 
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order history cleared!");
        router.refresh(); // Server Component ကို ပြန်ဆွဲထုတ်ပေးသည်
      }
    });
  };

  return (
    <button 
      onClick={handleClearHistory}
      disabled={isPending}
      className="text-xs text-red-500 hover:underline"
    >
      {isPending ? "Clearing..." : "Clear History"}
    </button>
  );
}