"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// သင်ခွဲထားသော FavoriteButton ကို import လုပ်ပါ
import { FavoriteButton } from "@/components/FavouriteBtn"; 

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    reviews: { rating: number }[];
  };
  isFavoritedInitially?: boolean;
}

export function ProductCard({ product, isFavoritedInitially = false }: ProductCardProps) {
  const cart = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const displayImage = product.images[0] || "https://placehold.co/600x400.png";
  const avgRating = (product.reviews?.length ?? 0) > 0 
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1) 
    : "0.0";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) { toast.error("Please login first"); router.push("/login"); return; }
    cart.addItem({ id: product.id, name: product.name, price: product.price, image: displayImage, stock: product.stock, quantity: 1 });
    toast.success("Added to cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group border h-90 border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
        <div className="relative block aspect-square overflow-hidden bg-gray-50">
          <Link href={`/products/${product.id}`}>
            <Image src={displayImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-700" />
          </Link>
          
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              {product.category}
            </span>
          </div>

          {/* 🌟 ခွဲထားသော FavoriteButton ကို ဒီနေရာမှာ အသုံးပြုပါ */}
          <FavoriteButton 
  key={`${product.id}-${isFavoritedInitially}`} 
  productId={product.id} 
  isFavoriteInitially={isFavoritedInitially} 
  isLoggedIn={!!session} 
/>
        </div>

        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{product.name}</h3>
          </Link>

          <div className="flex items-center gap-1 mt-1 mb-3">
            <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
            <span className="text-xs font-bold text-gray-700">{avgRating}</span>
            <span className="text-xs text-gray-400">({product.reviews?.length ?? 0})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-950">${product.price.toFixed(2)}</p>
            <Button size="sm" onClick={handleAddToCart} disabled={product.stock <= 0} className="rounded-full w-9 h-9 p-0 bg-gray-900 hover:bg-blue-600">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}