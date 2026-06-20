import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // ဘာမှမလုပ်ဘဲ တန်းလွှတ်လိုက်မယ်
  return NextResponse.next();
}

// ဒီမှာဘာမှမရှိရင် Middleware က အလုပ်မလုပ်တော့ပါ
export const config = {
  matcher: [], 
};