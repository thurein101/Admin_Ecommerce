
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {toast} from "sonner"

export default function RegisterPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // React Hook Form Setup
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  const onSubmit = (data: RegisterFormValues) => {
    startTransition(async () => {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/", 
      });

      if (error) {
        toast.error("Failed")
      } else {
        toast.success("account created")
        router.push("/");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-md bg-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Register a new client profile</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input type="text" placeholder="John Doe" {...register("name")} disabled={isPending} />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

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

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-semibold hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}