
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  // စာမျက်နှာ ၁ ခုတည်းပဲရှိရင် Pagination ပြစရာမလိုပါ
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {/* ⬅️ Previous Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        asChild={currentPage > 1} // Disabled ဖြစ်နေရင် Link အလုပ်မလုပ်စေရန်
      >
        {currentPage > 1 ? (
          <Link href={`?page=${currentPage - 1}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Current Page Info */}
      <span className="text-sm font-medium text-gray-700 px-3">
        Page {currentPage} of {totalPages}
      </span>

      {/* ➡️ Next Button */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={`?page=${currentPage + 1}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}