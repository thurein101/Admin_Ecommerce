"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";


export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (emblaApi) {
      const interval = setInterval(() => emblaApi.scrollNext(), 5000);
      return () => clearInterval(interval);
    }
  }, [emblaApi]);

const slides = [
    {
      title: "Elevate Your Tech Game",
      subtitle: "The latest gadgets, curated for your digital life.",
      bg: "bg-gradient-to-br from-[#DADBDD] to-[#BDBDBD]", // ပထမအရောင်
    },
    {
      title: "Smart Living, Simplified",
      subtitle: "Innovative devices to keep you ahead of the curve.",
      bg: "bg-gradient-to-br from-[#E2E8F0] to-[#CBD5E1]", // ဒုတိယအရောင်
    },
    {
      title: "Exclusive Launch Deals",
      subtitle: "Grab the cutting-edge tech at unbeatable prices.",
      bg: "bg-gradient-to-br from-[#FDE68A] to-[#FCD34D]", // တတိယအရောင် (Warm color)
    },
  ];
  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
             <div className="relative  h-[350px] overflow-hidden bg-gray-100 shadow-2xl mt-2.5 rounded-3xl"  ref={emblaRef}>
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div key={index} className="flex-[0_0_100%] relative h-full" >
          
            <div className={slide.bg}>
                  {/* Content Overlay */}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-start p-10 md:p-20">
              <div className="max-w-md">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg text-gray-700 mb-6 font-medium">
                  {slide.subtitle}
                </p>
                <Link 
                  href="/products"
                  className="inline-block bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-gray-800 transition"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
            </div>
          
          </div>
        ))}
      </div>
      
      {/* Navigation Indicators (Dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-black/30" />
        ))}
      </div>
    </div>
        </motion.div>
   
  );
}