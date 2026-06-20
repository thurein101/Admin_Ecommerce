import { Footer } from "@/components/Footer";
import { Inter } from "next/font/google"; 

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", // Tailwind မှာ သုံးဖို့ variable
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
      <body  className={`${inter.className} min-h-screen flex flex-col`}>
     {children}
        <Footer/>
      </body>
   
  );
}