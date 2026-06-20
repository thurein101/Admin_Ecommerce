import { checkAdmin } from "@/lib/admin-guard";
import { OrderStatusForm } from "./orderstatusdropdown";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link"
import { archiveDailyOrdersAction } from "@/lib/actions/order";
import { Button } from "@/components/ui/button";
import { ClearOrdersButton } from "@/components/admin/clearOrderBtn";

export default async function AdminOrdersPage() {
  await checkAdmin();

  // Performance အတွက် လိုအပ်သော fields များကိုသာ select လုပ်ယူပါ
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      orderItems: { include: { product: { select: { name: true } } } },
     
    },
     where: { isArchived: false },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    pending: orders.filter((o) => o.status === "PROCESSING").length,
    total: orders.length,
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      {/* iOS Style Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
        <p className="text-gray-500">
          Manage your store's logistics and fulfillment.
        </p>
      </div>
<div className="flex justify-between items-center mb-6">

  <div className="flex gap-2">
    <Link href="/admin/reports" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-xl text-sm font-medium transition">
       View Reports
    </Link>
    <ClearOrdersButton />
  </div>
</div>

      {/* iOS Style Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", val: `$${stats.revenue.toFixed(2)}` },
          {
            label: "Pending Processing",
            val: stats.pending,
            color: "text-blue-600",
          },
          { label: "Total Orders", val: stats.total },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {s.label}
            </p>
            <h3
              className={`text-3xl font-bold mt-2 ${s.color || "text-gray-900"}`}
            >
              {s.val}
            </h3>
          </div>
        ))}
      </div>

      {/* iOS Style Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-semibold text-lg">Recent Transactions</h2>
        </div>

      <div className="overflow-x-auto w-full"> {/* Container */}
  <table className="w-full min-w-[800px] text-left table-auto">
            <thead className="text-xs uppercase text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Summary</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-gray-900">
                      {order.user.name}
                    </p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium">
                      {order.orderItems.length} items
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[150px]">
                      {order.orderItems.map((i) => i.product.name).join(", ")}
                    </p>
                  </td>
                  <td className="px-6 py-5 font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-5">
                    <Badge
                      variant="outline"
                      className="rounded-full bg-green-50 border-green-200 text-green-700"
                    >
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <OrderStatusForm
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
