// components/category-filter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const onClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category"); // "All" နှိပ်လျှင် category param ကို ဖျက်မည်
    }
    
    router.push(`/products/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 my-6">
      <Button
        variant={!currentCategory ? "default" : "outline"}
        onClick={() => onClick(null)}
        size="sm"
      >
        All Products
      </Button>
      
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={currentCategory === cat ? "default" : "outline"}
          onClick={() => onClick(cat)}
          size="sm"
          className="capitalize"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}