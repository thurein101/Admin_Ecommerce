"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { createReviewAction, editReviewAction } from "@/lib/actions/review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  comment: z.string().min(5, "Comment must be at least 5 characters."),
});

interface ReviewFormProps {
  productId: string;
  isLoggedIn: boolean;
  initialData?: { id: string; comment: string; rating: number }; // Edit အတွက်
  onSuccess?: () => void; // Dialog ပိတ်ဖို့အတွက်
}

export function ReviewForm({ productId, isLoggedIn, initialData, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { comment: initialData?.comment || "" },
  });

  if (!isLoggedIn) {
    return (
      <div className="p-4 bg-gray-50 border rounded-lg text-center text-sm text-muted-foreground">
        Please <a href="/login" className="underline font-bold text-black">Sign In</a> to review.
      </div>
    );
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      let result;
      if (initialData) {
        // Edit Mode
        result = await editReviewAction(initialData.id, { comment: values.comment, rating });
      } else {
        // Create Mode
        result = await createReviewAction({ productId, rating, comment: values.comment });
      }

      if (result?.error) {
        toast.error("Something went wrong");
      } else {
        toast.success(initialData ? "Updated Successfully" : "Commented Successfully");
        if (!initialData) form.reset();
        onSuccess?.(); // Dialog ကို ပိတ်ပေးမယ်
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-600 mr-2">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
          >
            <Star className={`h-6 w-6 ${star <= (hoveredRating ?? rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>

      <Textarea placeholder="Share your experience..." {...form.register("comment")} disabled={isPending} />
      
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : initialData ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
}