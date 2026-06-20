// components/profile-avatar.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing"; // ပရောဂျက်အစက သတ်မှတ်ခဲ့သော UploadThing Helper
import { updateProfileImageAction } from "@/lib/actions/user";
import {toast} from "sonner"
import { useRouter } from "next/navigation";

interface ProfileAvatarProps {
  initialImage: string | null;
  name: string;
}

export function ProfileAvatar({ initialImage, name }: ProfileAvatarProps) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // လက်ရှိပြသမယ့် ပုံစတိတ် (ပုံမရှိရင် နာမည်အစ ၂ လုံးပြမည့် Default Avatar သုံးမည်)
  const [avatarUrl, setAvatarUrl] = useState(initialImage);

  return (
    <div className="relative group w-24 h-24 mx-auto">
      {/* Profile Image Display */}
      <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 bg-primary/5 flex items-center justify-center relative">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill className="object-cover" />
        ) : (
          <span className="font-bold text-3xl uppercase text-primary">{name.slice(0, 2)}</span>
        )}

        {/* Loading Overlay (ပုံတက်နေစဉ် လည်နေမည့် အဝိုင်းလေး) */}
        {isPending && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white rounded-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>

      {/* Camera Hover Button & UploadThing Trigger */}
      {!isPending && (
        <div className="absolute bottom-0 right-0 p-1.5 bg-black hover:bg-gray-800 text-white rounded-full shadow-md cursor-pointer border border-white transition transform group-hover:scale-110">
          <Camera className="h-4 w-4" />
          
          {/* UploadThing Drop-in Button (UI အား ဖျောက်ပြီး Camera အိုင်ကွန်နောက်ကွယ်မှ အလုပ်လုပ်စေခြင်း) */}
          <div className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden">
          <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        const uploadedUrl = res[0].url;
        
        startTransition(async () => {
          const result = await updateProfileImageAction(uploadedUrl);
          if (result.error) {
            toast.error(result.error); // Updated to Sonner
          } else {
            setAvatarUrl(uploadedUrl);
            toast.success("Profile picture updated!"); // Updated to Sonner
            router.refresh();
          }
        });
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message); // Updated to Sonner
      }}
    />
          </div>
        </div>
      )}
    </div>
  );
}