import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from 'jose';

// --- Interface pour le Payload JWT ---
interface CustomJWTPayload extends JWTPayload {
    _id: string;
    email: string;
    name: string;
    roles: string[];
}

// --- Fonction de Vérification JWT ---
async function verifyJWT(token: string): Promise<CustomJWTPayload | null> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        console.error("JWT_SECRET n'est pas défini. La vérification est impossible.");
        return null;
    }

    try {
        const secret = new TextEncoder().encode(secretKey);
        const { payload } = await jwtVerify(token, secret);
        if (payload && payload._id && Array.isArray(payload.roles)) {
            return payload as CustomJWTPayload;
        }
        return null;
    } catch (error) {
        console.error("ERREUR DE VÉRIFICATION JWT:", (error as Error).message);
        return null;
    }
}

// --- Middleware principal ---
export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log("Middleware appelé pour:", path);

    // ✅ Lecture du cookie authToken côté Next.js
    const token = req.cookies.get("authToken")?.value || null;
    const session = token ? await verifyJWT(token) : null;
    const isAdmin = session?.roles?.includes("admin") || false;

    const protectedRoutes = ["/dashboard"];
    const adminRoutes = ["/admin"];
    const authRoutes = ["/auth/login", "/auth/signup"];

    console.log("Token JWT:", token);
    console.log("Raw cookies header:", req.headers.get("cookie"));


    if (authRoutes.includes(path) && session) {
        const redirect_destination = isAdmin ? "/dashboard" : "/";
        console.log(`Utilisateur connecté. Redirection vers ${redirect_destination} depuis: ${path}`);
        return NextResponse.redirect(new URL(redirect_destination, req.url));
    }

    // 2️⃣ Utilisateur non-admin qui tente d'accéder à /dashboard
    if (protectedRoutes.some((r) => path.startsWith(r)) && session && !isAdmin) {
        console.log("Accès non-admin au dashboard. Redirection vers / depuis:", path);
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 3️⃣ Utilisateur non-connecté qui tente d'accéder à /dashboard ou /admin
    if ((protectedRoutes.some((r) => path.startsWith(r)) || adminRoutes.some((r) => path.startsWith(r))) && !session) {
        console.log("Accès protégé requis. Redirection vers /auth/login depuis:", path);
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 4️⃣ Utilisateur connecté sans rôle admin qui tente d'accéder à /admin
    if (adminRoutes.some((r) => path.startsWith(r)) && !isAdmin) {
        console.log("Accès Admin requis ou rôle insuffisant. Redirection vers / depuis:", path);
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Laisse passer l'utilisateur
    return NextResponse.next();
}

// --- Config du matcher ---
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/auth/login",
        "/auth/signup",
    ],
};
