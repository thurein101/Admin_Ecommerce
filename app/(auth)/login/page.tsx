
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {toast} from "sonner"

export default function LoginPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // 1. React Hook Form Setup with Zod
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  // Email/Password ဖြင့် Login ဝင်ခြင်း
  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/", 
      });

      if (error) {
        toast.error("Login Failed")
      } else {
        toast.success("Logged Successfully")
        router.push("/");
        router.refresh();
      }
    });
  };

  // 🌐 GOOGLE OAUTH ဖြင့် Login ဝင်ခြင်း
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // အောင်မြင်ရင် Home page ပြန်ပို့မယ်
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Access your NEXTSHOP account</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <Input type="email" placeholder="john@example.com" {...register("email")} disabled={isPending} />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input type="password" placeholder="••••••••" {...register("password")} disabled={isPending} />
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing In..." : "Login with Email"}
            </Button>

            {/* OR DIVIDER */}
            <div className="relative w-full my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or continue with</span></div>
            </div>

            {/* GOOGLE OAUTH BUTTON */}
            <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogleLogin}>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.94 1 12 1 7.35 1 3.37 3.68 1.44 7.6l3.77 2.92C6.1 7.4 8.84 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.67 2.84c2.15-1.98 3.39-4.9 3.39-8.5z"/>
                <path fill="#FBBC05" d="M5.21 14.72c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.44 7.24C.52 9.09 0 11.16 0 13.32s.52 4.23 1.44 6.08l3.77-2.92z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.67-2.84c-1.02.68-2.33 1.09-4.29 1.09-3.16 0-5.9-2.36-6.79-5.48L1.44 15.77C3.37 19.69 7.35 23 12 23z"/>
              </svg>
              Sign In with Google
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-black font-semibold hover:underline">Sign Up</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}