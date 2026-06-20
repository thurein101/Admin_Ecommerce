// components/product-images.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductImages({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState(images[0] || "https://placehold.co/600x400.png");

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-square w-full max-h-[500px] rounded-xl overflow-hidden border bg-gray-50">
        <Image src={activeImage} alt="Main product view" fill className="object-cover" />
      </div>

      {/* Thumbnails (ပုံငယ် ၃၊ ၄ ပုံ) */}
      <div className="flex gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition ${
              activeImage === img ? "border-black scale-95" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={img} alt={`Thumbnail ${index}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}