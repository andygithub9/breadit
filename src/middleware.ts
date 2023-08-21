// 保護需要登入才能訪問的路徑
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // 沒有 token 表示使用者沒有登入， redirect 到 "/sign-in"
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }
}

export const config = {
  // 在 "/r/任何長度字串/submit" 和 "/r/create" 這兩個路徑下執行 middleware function
  matcher: ["/r/:path*/submit", "/r/create"],
};
