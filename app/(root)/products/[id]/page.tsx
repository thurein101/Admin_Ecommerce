import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, MessageSquare, Calendar, Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { ReviewForm } from "@/components/review-form";
import { ProductImages } from "@/components/product-Images"; // Client side image component
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/AddtoCartBtn";
import { ProductCard } from "@/components/product-card";

import { FavoriteButton } from "@/components/FavouriteBtn";
import { ReviewActions } from "@/components/reviewActionDelete";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  isFavouriteInitially: boolean;
}

export default async function ProductDetailPage({
  params,
  isFavouriteInitially = false,
}: ProductPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  // 1. Product နှင့် ၎င်း၏ Reviews + Users Data များကို ဆွဲထုတ်ခြင်း
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
      favorites: session?.user ? { where: { userId: session.user.id } } : false, // 👈 User အလိုက် favorite ရှိမရှိ စစ်ပါ
    },
  });

  if (!product) notFound();
  const isFavorite = session?.user ? product.favorites.length > 0 : false;

  const similarProducts = await prisma.product.findMany({
    where: {
      category: product.category, // schema ထဲက နာမည်အတိုင်း သုံးရမည်
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // 2. Average Rating (ပျမ်းမျှကြယ်ပွင့်) တွက်ချက်ခြင်း
  const totalReviews = product.reviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen w-full bg-gray-50/50">
      {" "}
      {/* Softer background */}
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* iOS-style Image Container */}
          <div className="relative overflow-hidden rounded-3xl shadow-sm border border-gray-100 bg-white">
            <ProductImages images={product.images} />

            {/* 🌟 ဤနေရာတွင် ထည့်သွင်းပါ */}
            <FavoriteButton
              productId={product.id}
              isFavoriteInitially={isFavorite} // 👈 ဒီနေရာမှာ စစ်ထားတဲ့ result ကို ပို့ပါ
              isLoggedIn={!!session}
            />
          </div>

          {/* Clean Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center text-orange-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 font-medium text-gray-900">
                    {avgRating}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {totalReviews} Reviews
                </span>
              </div>
            </div>

            <p className="text-2xl font-medium tracking-tight">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            <AddToCartButton product={product} />

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
              <span
                className={`h-2 w-2 rounded-full mr-2 ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-xs font-medium text-gray-600">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* --- SIMILAR PRODUCTS SECTION --- */}
        <div className="mt-20 border-t pt-16">
          <h2 className="text-2xl font-semibold mb-8">You Might Also Like</h2>

          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">
                No similar products found at this moment.
              </p>
            </div>
          )}
        </div>

        {/* --- REVIEW SECTION: Cards Style --- */}
        <div className="mt-20 space-y-8">
          <h2 className="text-2xl font-semibold">Customer Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-medium mb-4">Write a review</h3>
                <ReviewForm productId={product.id} isLoggedIn={!!session} />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {product.reviews.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
                  >
                <div className="flex items-center justify-between mb-4">
  {/* ဘယ်ဘက်: ပုံနှင့် နာမည် */}
  <div className="flex items-center gap-3">
    {review.user.image ? (
      <Image 
        src={review.user.image} 
        alt={review.user.name} 
        width={40} 
        height={40} 
        className="rounded-full object-cover"
      />
    ) : (
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600 text-sm">
        {review.user.name.slice(0, 2).toUpperCase()}
      </div>
    )}
    <span className="font-medium text-gray-900">{review.user.name}</span>
  </div>

  {/* ညာဘက်: Date နှင့် Actions */}
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-400 font-medium">
      {new Date(review.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}
    </span>
    
    {/* Only show actions if it's the owner */}
    {session?.user?.id === review.userId && (
      <div className="-mr-2"> {/* ခလုတ်လေး အစွန်းမရောက်အောင် နည်းနည်းရွှေ့ထားပါတယ် */}
        <ReviewActions review={review} />
      </div>
    )}
  </div>
</div>

                    <div className="flex text-orange-400 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-gray-200"}`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
