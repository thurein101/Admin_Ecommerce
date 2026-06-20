"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/lib/actions/favourite"; // သင်၏ Action path

interface FavoriteButtonProps {
  productId: string;
  isFavoriteInitially: boolean;
  isLoggedIn: boolean; // Server ကနေ check လုပ်ပြီး ပို့ပေးရန်
}

export function FavoriteButton({ productId, isFavoriteInitially, isLoggedIn }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);
  const [isPending, startTransition] = useTransition();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Event bubble မဖြစ်အောင်

    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      return;
    }

    startTransition(async () => {
      const result = await toggleFavoriteAction(productId);
      
      if (result.error) {
        toast.error("Something went wrong");
      } else {
        const newStatus = result.isFavorite ?? false;
        setIsFavorite(newStatus);
        toast.success(
          newStatus ? "Added to Wishlist" : "Removed from Wishlist"
        );
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleFavorite}
      disabled={isPending}
      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white transition-all shadow-sm active:scale-90"
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
    </Button>
  );
}