import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Inter ကို သုံးပါမယ်
import "./globals.css";
import { Toaster } from "sonner";


// Font ကို Configure လုပ်ပါ
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", // Tailwind မှာ သုံးဖို့ variable
});

export const metadata: Metadata = {
  title: "My Store",
  description: "Ecommerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}> 
     
      <body className={`${inter.className} min-h-screen flex flex-col`}>
      
          {children}
      
       
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}