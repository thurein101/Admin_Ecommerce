"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const cart = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!session) {
      toast.error("You need to login to add items to cart");
      router.push("/login");
      return;
    }

    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      stock: product.stock,
      quantity: 1,
    });
    
    toast.success("Added to cart!");
  };

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="w-full md:w-auto h-12 px-8 rounded-2xl font-semibold gap-2 transition-all active:scale-[0.98]"
      size="lg"
    >
      <ShoppingCart className="h-5 w-5" />
      {product.stock > 0 ? "Add to Cart" : "Sold Out"}
    </Button>
  );
}