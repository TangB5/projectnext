import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; 
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/admin"];
  const publicRoutes = ["/auth/login", "/auth/register"];

  const token = req.cookies.get("authToken")?.value;
  const session = token ? await verifyJWT(token) : null;

  if (protectedRoutes.some((r) => path.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (
    path.startsWith("/admin") && 
    session?.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (publicRoutes.some((r) => path.startsWith(r)) && session) {
    if (session.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/login",
    "/auth/register",
    "/dashboard/:path*",
    "/admin/:path*"
  ],
};
