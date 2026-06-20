import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export default async function ArchiveReportsPage() {
  // Archive ဖြစ်ပြီးသား Order အားလုံးကို ဆွဲထုတ်
  const archivedOrders = await prisma.order.findMany({
    where: { isArchived: true },
    orderBy: { createdAt: "desc" },
  });

  // ရက်စွဲအလိုက် စုစည်းခြင်း (Group by date)
  const groupedOrders = archivedOrders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = { count: 0, revenue: 0 };
    acc[date].count += 1;
    acc[date].revenue += order.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Sales Receipt History</h1>
      <div className="space-y-4">
        {Object.entries(groupedOrders).map(([date, data]) => (
          <div key={date} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-400">Date</p>
              <p className="text-lg font-bold">{date}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400">Orders</p>
              <p className="text-lg font-medium">{data.count} Orders</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-400">Total Revenue</p>
              <p className="text-xl font-extrabold text-green-600">${data.revenue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}