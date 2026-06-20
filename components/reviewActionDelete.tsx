"use client";
import { useState } from "react";
import { deleteReviewAction, editReviewAction } from "@/lib/actions/review";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { ReviewForm } from "./review-form";

export function ReviewActions({ review }: { review: any }) {
  const [open, setOpen] = useState(false); // Dialog ပိတ်ဖို့ state
   const handleDelete = async () => {
    await deleteReviewAction(review.id);
    toast.success("Review deleted");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <h3 className="font-bold text-lg">Edit Review</h3>
            <ReviewForm 
              productId={review.productId} 
              isLoggedIn={true} 
              initialData={{ id: review.id, comment: review.comment, rating: review.rating }}
              onSuccess={() => setOpen(false)} // Edit ပြီးရင် Dialog ပိတ်မယ်
            />
          </DialogContent>
        </Dialog>
        
        <DropdownMenuItem onClick={handleDelete} className="text-red-500">
           <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}