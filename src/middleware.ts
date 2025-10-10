import { NextRequest, NextResponse } from "next/server";
// 🚨 Utilisation de 'jose' pour la compatibilité avec l'Edge Runtime de Next.js
import { jwtVerify, JWTPayload } from 'jose';

// --- Interface pour le Payload JWT ---

interface CustomJWTPayload extends JWTPayload {
    _id: string;
    email: string;
    name: string;
    roles: string[]; // Doit être un tableau
}

// --- Fonction de Vérification JWT ---

async function verifyJWT(token: string): Promise<CustomJWTPayload | null> {
    // 🚨 Le secret doit être une chaîne non vide.
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        console.error("JWT_SECRET n'est pas défini. La vérification est impossible.");
        return null;
    }

    try {
        // Le secret doit être converti en Uint8Array pour 'jose'
        const secret = new TextEncoder().encode(secretKey);

        const { payload } = await jwtVerify(token, secret, {
            // Vous pouvez spécifier l'algorithme ici si vous le connaissez (ex: 'HS256')
        });

        // Vérification de la présence des champs essentiels
        if (payload && payload._id && Array.isArray(payload.roles)) {
            return payload as CustomJWTPayload;
        }

        return null;
    } catch (error) {
        // Si le token est invalide ou expiré, jose lance une erreur.
        console.error("ERREUR DE VÉRIFICATION JWT:", (error as Error).message);
        return null;
    }
}

// --- Fonction Middleware Principale ---

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log("Middleware appelé pour:", path);

    const token = req.cookies.get("authToken")?.value;
    const session = token ? await verifyJWT(token) : null;
    const isAdmin = session?.roles?.includes("admin") || false; // Assure une valeur booléenne

    const protectedRoutes = ["/dashboard"];
    const adminRoutes = ["/admin"];
    const authRoutes = ["/auth/login", "/auth/signup"];

    // --------------------------------------------------------
    // 1. UTILISATEUR DÉJÀ CONNECTÉ QUI VA VERS /auth/*
    // --------------------------------------------------------
    if (authRoutes.includes(path) && session) {
        const redirect_destination = isAdmin ? "/dashboard" : "/";

        console.log(`Utilisateur connecté. Redirection vers ${redirect_destination} depuis: ${path}`);
        return NextResponse.redirect(new URL(redirect_destination, req.url));
    }

    // --------------------------------------------------------
    // 2. UTILISATEUR NON-ADMIN QUI TENTE D'ACCÉDER AU DASHBOARD
    // --------------------------------------------------------
    // L'utilisateur est connecté (session existe), mais n'est pas admin, et essaie d'accéder à /dashboard.
    if (protectedRoutes.some((r) => path.startsWith(r)) && session && !isAdmin) {
        console.log("Accès non-admin au dashboard. Redirection vers / depuis:", path);
        return NextResponse.redirect(new URL("/", req.url));
    }

    // --------------------------------------------------------
    // 3. UTILISATEUR NON-CONNECTÉ QUI VA VERS /dashboard ou /admin
    // --------------------------------------------------------
    // L'utilisateur n'est pas connecté et essaie d'accéder à une route protégée.
    if ((protectedRoutes.some((r) => path.startsWith(r)) || adminRoutes.some((r) => path.startsWith(r))) && !session) {
        console.log("Accès protégé requis. Redirection vers /auth/login depuis:", path);
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // --------------------------------------------------------
    // 4. UTILISATEUR SANS RÔLE ADMIN QUI VA VERS /admin
    // --------------------------------------------------------
    // L'utilisateur est connecté, mais n'est pas admin, et essaie d'accéder à /admin.
    if (adminRoutes.some((r) => path.startsWith(r)) && !isAdmin) {
        console.log("Accès Admin requis ou rôle insuffisant. Redirection vers / depuis:", path);
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Laisse passer l'utilisateur
    return NextResponse.next();
}

export const config = {
    // Le matcher doit couvrir toutes les routes d'authentification et les routes protégées
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/auth/login",
        "/auth/signup",
    ],
};