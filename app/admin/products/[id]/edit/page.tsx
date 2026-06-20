import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // DB မှ ပစ္စည်းအချက်အလက်ကို ဆွဲထုတ်ခြင်း
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <div className="p-8">
      {/* 🌟 initialData နေရာသို့ product ကို ပို့ပေးလိုက်ခြင်း */}
      <ProductForm initialData={product} />
    </div>
  );
}