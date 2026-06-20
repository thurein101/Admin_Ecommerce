import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // သင်၏ project မှာ cn function ရှိပြီးသားဖြစ်မှာပါ

export function UserAvatarView({ 
  image, 
  name, 
  className // className prop ကို ထည့်ပေးပါ
}: { 
  image?: string | null; 
  name: string; 
  className?: string; // ဒီနေရာမှာ Type သတ်မှတ်ပေးပါ
}) {
  return (
    // cn() ကိုသုံးပြီး default size (h-8 w-8) နဲ့ အပြင်ကလှမ်းပေးတဲ့ className ကို ပေါင်းပေးပါမယ်
    <Avatar className={cn("h-8 w-8 border border-gray-200", className)}>
      <AvatarImage src={image || ""} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}