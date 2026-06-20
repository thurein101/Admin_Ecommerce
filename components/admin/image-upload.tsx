
"use client";

import { X, ImagePlus } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import {toast} from "sonner"
interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      {/* 1. Upload ပြီးသားပုံများကို Grid ဖြင့် Preview ပြသခြင်း */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-full h-[150px] rounded-lg overflow-hidden border">
            <Image src={url} alt="Product Image" fill className="object-cover" />
            {/* ပုံဖျက်ရန် Button */}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full"
              onClick={() => onRemove(url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* 2. သတ်မှတ်ထားတဲ့ ပုံအရေအတွက် မပြည့်သေးရင် Dropzone ကို ပြပေးခြင်း */}
      {value.length < 4 && (
 <UploadDropzone<OurFileRouter, "productImageUploader">
  endpoint="productImageUploader"
  // ဒီမှာ appearance နဲ့ ပြင်ပါ
  appearance={{
    container: "border-2 border-dashed border-gray-300 rounded-lg p-2 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all",
    button: "bg-black text-white p-2 text-sm h-8", // ခလုတ် size ကို လျှော့ထားတယ်
    label: "text-sm text-gray-500", // စာသား size ကို လျှော့ထားတယ်
    allowedContent: "text-xs text-gray-400",
  }}
  // Cloud icon ကို သေးစေရန်
  content={{
    button: "Select Files",
    allowedContent: "Max 4MB",
  }}
  onClientUploadComplete={(res) => {
    const urls = res.map((file) => file.url);
    onChange([...value, ...urls]);
  }}
  onUploadError={(error: Error) => {
    toast.error(`Upload failed: ${error.message}`);
  }}
/>
      )}
      <p className="text-xs text-muted-foreground">You can upload up to 4 detailed images (Max 4MB each).</p>
    </div>
  );
}