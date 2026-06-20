"use client";

import { updateUserRoleAction } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { Shield, User } from "lucide-react";

export function UpdateRoleButton({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    startTransition(async () => {
      const res = await updateUserRoleAction(userId, newRole as any);
      if (res.error) toast.error(res.error);
      else toast.success(`User is now ${newRole}`);
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleUpdate} disabled={isPending}>
      {isPending ? "..." : currentRole === "ADMIN" ? <User className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
    </Button>
  );
}