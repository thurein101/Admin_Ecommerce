
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({ image, name }: { image?: string | null; name: string }) {
  return (
    <Avatar className="h-8 w-8 border border-gray-200">
      <AvatarImage src={image || ""} alt={name} className="object-cover" />
      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}