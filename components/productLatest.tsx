"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function CompactProductCard({ product }: { product: any }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      className="group relative flex flex-col bg-white h-80"
    >
      {/* Image Container: 1:1 Aspect Ratio + Rounded Corners */}
      <Link href={`/products/${product.id}`} className="relative aspect-square bg-gray-100 overflow-hidden rounded-2xl">
        <Image 
          src={product.images[0] || "/placeholder.png"} 
          alt={product.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </Link>

      {/* Info Section: Padding လျှော့ထားပါတယ် */}
      <div className="py-3 px-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[13px] font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">{product.category}</p>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</span>
          {/* ခလုတ်လေးကို ပိုသေးအောင်လုပ်ထားပါတယ် */}
          <button className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}