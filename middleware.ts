import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Cookie ကို Header ထဲကနေ တိုက်ရိုက်ဖတ်ခြင်း (ပိုသေချာပါတယ်)
  const cookieHeader = request.headers.get("cookie");
  
  // better-auth ရဲ့ session token ရှိမရှိ စစ်ဆေးခြင်း
  const hasSession = cookieHeader?.includes("better-auth.session_token");

  // Profile page သွားဖို့ ကြိုးစားနေတာလား?
  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!hasSession) {
      // Session မရှိရင် Login ကို ပို့မယ်
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ကျန်တဲ့ Page တွေဆိုရင် ပုံမှန်အတိုင်း သွားခွင့်ပေးမယ်
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};