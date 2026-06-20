// middleware.ts
import { NextRequest, NextResponse } from "next/server";


export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token"); // သင့် cookie name ကို သေချာစစ်ပါ

  // Login မဝင်ထားရင် auth page တွေကလွဲရင် အကုန် Redirect လုပ်မယ်
  if (!sessionCookie && request.nextUrl.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};