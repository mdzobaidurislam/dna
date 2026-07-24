import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// @ts-ignore
export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  let tempUserId = req.cookies.get('temp_userid');
  if (!tempUserId) {
      tempUserId = generateTempUserId();
      const res = NextResponse.next();
      res.cookies.set('temp_userid', tempUserId, { httpOnly: true });
      return res;
  }
  return NextResponse.next();
}
function generateTempUserId() {
  return `ext_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
export const config = {
  // matcher: ["/user/:path*"],
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
