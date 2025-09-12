import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  user: {
    id: string;
    name?: string;
    email: string;
    roles?: string[];
  };
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const protectedRoutes = ["/dashboard"];
  const adminRoutes = ["/admin"];
  const publicRoutes = ["/auth/login", "/auth/register"];
  const token = req.cookies.get("authToken")?.value;
  const session = token ? await verifyJWT(token) : null;

  if (publicRoutes.some((r) => path.startsWith(r)) && session) {
    if (session.user?.roles?.includes("admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (protectedRoutes.some((r) => path.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (adminRoutes.some((r) => path.startsWith(r)) && (!session || !session.user?.roles?.includes("admin"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/login",
    "/auth/register",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};