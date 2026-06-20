import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  // Product ပုံများအတွက် Route သတ်မှတ်ခြင်း (Max: 4 ပုံ, တစ်ပုံချင်းစီ Max: 4MB)
  productImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      // Admin ဖြစ်မှသာ ပုံတင်ခွင့်ပြုရန် ကာကွယ်ခြင်း
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session || session.user.role !== "ADMIN")
        throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }), // Add this block so your ProfileAvatar works:
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
