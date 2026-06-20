// proxy.ts (middleware.ts ကနေ rename လုပ်ပါ)
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie && request.nextUrl.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};