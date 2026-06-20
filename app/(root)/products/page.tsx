import { ProductCard } from "@/components/product-card";
import { CategoryFilter } from "@/components/category-filter";
import { Navbar } from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/pagination";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 8;

export default async function Page({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search;
  const category = resolvedParams.category;
  const currentPage = Number(resolvedParams.page) || 1;

  // ၁။ Filtering Logic ကို အရင်တည်ဆောက်ပါ
  const whereClause = {
    AND: [
      search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {},
      category ? { category: category } : {},
    ],
  };

  // ၂။ Pagination အတွက် Count ကို Filtering အပေါ်မူတည်ပြီး တွက်ပါ
  const totalProducts = await prisma.product.count({ where: whereClause });
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // 1. Session ကိုယူပါ
  const session = await auth.api.getSession({ headers: await headers() });

  const userFavoriteProductIds = session?.user
    ? (
        await prisma.favorite.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      ).map((f) => f.productId)
    : [];
  // ၃။ ပစ္စည်းများကို Fetch လုပ်ပါ
  const products = await prisma.product.findMany({
    where: whereClause,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: { createdAt: "desc" },
    // 👈 ဒီနေရာမှာ include ထည့်ပေးရပါမယ်
    include: {
      reviews: {
        select: { rating: true }, // Rating တွက်ဖို့ rating field လေးပဲယူလိုက်ရင် ပိုမြန်ပါတယ်
      },
    },
  });
  // ၄။ Category list ကိုလည်း Database မှ ဆွဲထုတ်ပါ
  const distinctCategories = await prisma.product.findMany({
    distinct: ["category"],
    select: { category: true },
  });
  const categoriesList = distinctCategories.map((p) => p.category);

  return (
    <div className="min-h-screen mx-auto w-full bg-gray-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Discover Products
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore our high-quality professional items.
            </p>
          </div>
        </div>

        <CategoryFilter categories={categoriesList} />

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed mt-6">
            <p className="text-xl font-medium text-gray-500">
              No products found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product as any}
                isFavoritedInitially={userFavoriteProductIds.includes(
                  product.id,
                )}
              />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </main>
    </div>
  );
}
