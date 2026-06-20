import { ProductCard } from "@/components/product-card";
import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { HeroCarousel } from "@/components/hero-casual";
import { CompactProductCard } from "@/components/productLatest";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  // 1. Search ရှိနေရင် Search Result ကို Fetch ပါ
  const searchResults = search
    ? await prisma.product.findMany({
        where: { name: { contains: search, mode: "insensitive" } },
        include: { reviews: { select: { rating: true } } },
      })
    : [];

  // 2. Search မရှိမှသာ Latest Products ကို Fetch ပါ
  const latestProducts = !search
    ? await prisma.product.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { reviews: { select: { rating: true } } },
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50/50  ">
      {" "}
      {/* Background color */}
      <Navbar />
      {/* Search မရှိမှသာ Hero Section ပြပါ */}
      {!search && (
        <div className=" flex items-center justify-center ">
          <section className="  w-200">
            <HeroCarousel />
          </section>
        </div>
      )}
      {/* Main Container: ဘယ်ညာ မကပ်စေဖို့ px-4 နဲ့ mx-auto သုံးထားပါတယ် */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          {search ? `Search results for "${search}"` : "New Arrivals"}
        </h2>

        {/* Grid layout မှာ gap နဲ့ padding ကို သေချာချိန်ထားပါတယ် */}
       {search && searchResults.length === 0 ? (
    // Search လုပ်ထားပြီး ရလဒ်မရှိမှ ပြမည့်နေရာ
    <div className="text-center py-20 text-gray-500">
      <p className="text-lg">No products found for "{search}"</p>
    </div>
  ) : !search && latestProducts.length === 0 ? (
    // Search မလုပ်ထားဘဲ ပစ္စည်းအသစ်မရှိမှ ပြမည့်နေရာ
    <div className="text-center py-20 text-gray-500">
      <p className="text-lg">No new products available at the moment.</p>
    </div>
  ) : (
    // ပစ္စည်းရှိရင် Grid နဲ့ပြမယ်
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {(search ? searchResults : latestProducts).map((p) => (
        search ? (
          <ProductCard key={p.id} product={p as any} />
        ) : (
          <CompactProductCard key={p.id} product={p as any} />
        )
      ))}
    </div>
  )}

      

        {!search && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-100 transition-all shadow-sm"
            >
              See More Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
