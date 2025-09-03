import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // payload contient userId, role, email, etc.
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const protectedRoutes = ["/dashboard"];
  const publicRoutes = ["/auth/login"];

  const token = req.cookies.get("authToken")?.value;
  const session = token ? await verifyJWT(token) : null;

  console.log("Chemin:", path);
  console.log("Token présent:", !!token);
  console.log("Rôle:", session?.role);

  // Cas 1 : accès à une route protégée sans être connecté
  if (protectedRoutes.some((r) => path.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Cas 2 : accès à une route protégée (ex: /dashboard) mais pas admin
  if (protectedRoutes.some((r) => path.startsWith(r)) && session && session.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url)); // retour page d'accueil
  }

  // Cas 3 : utilisateur déjà connecté qui va sur /auth/login → on le renvoie
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
  matcher: ["/auth/login", "/dashboard/:path*"],
};
