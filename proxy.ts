import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // better-auth ရဲ့ default cookie name ကို သုံးပါ
 const sessionCookie = request.cookies.get("better-auth.session_token") || 
                        request.cookies.get("__better-auth.session_token");

  // Profile page ကို သွားရင်
  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};