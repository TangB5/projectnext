import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JWTPayload extends JwtPayload {
  _id: string;
  email: string;
  name: string;
  roles: string[];
}

async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "_id" in decoded &&
      "email" in decoded &&
      "name" in decoded &&
      "roles" in decoded
    ) {
      return decoded as JWTPayload;
    }

    console.error("JWT payload invalide:", decoded);
    return null;
  } catch (error) {
    console.error("Erreur lors de la vérification du JWT:", error);
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("Middleware appelé pour:", path);

  const token = req.cookies.get("authToken")?.value;
  console.log("Token dans middleware:", token);

  const session = token ? await verifyJWT(token) : null;
  console.log("Session dans middleware:", session);

  const protectedRoutes = ["/dashboard"];
  const adminRoutes = ["/admin"];

   if (protectedRoutes.some((r) => path.startsWith(r)) && !session) {
     console.log("Redirection vers /auth/login depuis:", path);
     return NextResponse.redirect(new URL("/auth/login", req.url));
   }

   if (
     adminRoutes.some((r) => path.startsWith(r)) &&
     (!session || !session.roles?.includes("admin"))
   ) {
     console.log("Redirection vers / depuis:", path);
     return NextResponse.redirect(new URL("/", req.url));
   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
