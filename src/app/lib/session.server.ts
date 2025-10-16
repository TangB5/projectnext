import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

interface CustomJWTPayload {
    _id?: string;
    id?: string;
    sub?: string;
    email?: string;
    name?: string;
    roles?: string[] | string;
    [key: string]: unknown;
}

export interface Session {
    user: {
        id: string;
        email?: string;
        name?: string;
        roles?: string[];
    };
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        const typedPayload = payload as CustomJWTPayload;

        const roles = Array.isArray(typedPayload.roles)
            ? typedPayload.roles
            : typeof typedPayload.roles === "string"
                ? [typedPayload.roles]
                : [];

        const id = typedPayload._id ?? typedPayload.id ?? typedPayload.sub ?? "";
        if (!id) return null;

        return {
            user: {
                id,
                email: typedPayload.email,
                name: typedPayload.name,
                roles,
            },
        };
    } catch (err) {
        console.error("JWT invalide ou expiré:", err);
        return null;
    }
}

export function deleteSession(): NextResponse {
    const response = NextResponse.json({ ok: true, message: "Déconnexion réussie" });
    response.cookies.set({
        name: "authToken",
        value: "",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 0,
    });
    return response;
}
