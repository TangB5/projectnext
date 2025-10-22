import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";


interface CustomJWTPayload extends JWTPayload {
    _id: string;
    email: string;
    name: string;
    roles: string[];
}

// --- Fonction de vérification JWT ---
async function verifyJWT(token: string): Promise<CustomJWTPayload | null> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        console.error("JWT_SECRET n'est pas défini.");
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
        console.error("Erreur de vérification JWT:", (error as Error).message);
        return null;
    }
}

// --- Middleware principal ---
export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // ✅ Lire le token JWT côté cookie
    const token = req.cookies.get("authToken")?.value || null;
    const session = token ? await verifyJWT(token) : null;
    const isAdmin = session?.roles?.includes("admin") || false;


    // --- Routes ---
    const protectedRoutes = ["/dashboard"];
    const adminRoutes = ["/admin"];
    const authRoutes = ["/auth/login", "/auth/signup"];


    if (authRoutes.includes(path) && session) {
        const redirectTo = isAdmin ? "/dashboard" : "/";
        return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    // 2️⃣ Utilisateur non-admin qui tente d'accéder à /dashboard
    if (protectedRoutes.some(r => path.startsWith(r)) && session && !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 3️⃣ Utilisateur non connecté qui tente d'accéder à des routes protégées
    if ((protectedRoutes.some(r => path.startsWith(r)) || adminRoutes.some(r => path.startsWith(r))) && !session) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 4️⃣ Utilisateur connecté sans rôle admin tente d'accéder à /admin
    if (adminRoutes.some(r => path.startsWith(r)) && !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Autoriser l'accès
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
