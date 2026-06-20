// app/admin/orders/order-status-form.tsx
"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/actions/order";
import { toast } from "sonner";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {

  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as any;

    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, nextStatus);

      if (result.error) {
        toast.error("failed")
      } else {
        toast.success("Order Updated")
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={currentStatus}
        onChange={handleStatusChange}
        disabled={isPending}
        className={`text-xs font-semibold rounded-md border p-1.5 cursor-pointer bg-white focus:outline-none ${
          currentStatus === "PROCESSING" ? "text-blue-600 border-blue-200 bg-blue-50/50" :
          currentStatus === "SHIPPED" ? "text-purple-600 border-purple-200 bg-purple-50/50" :
          currentStatus === "COMPLETED" ? "text-green-600 border-green-200 bg-green-50" : "text-gray-600"
        }`}
      >
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Confirm & Ship</option>
        <option value="COMPLETED">Delivered / Done</option>
        <option value="CANCELLED">Cancel Order</option>
      </select>
    </div>
  );
}