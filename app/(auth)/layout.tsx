import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const session = await auth.api.getSession({ 
    headers: await headers() 
  });

    if(session) redirect("/")
  return (
    <div className="flex h-screen">
     
      {/* Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}