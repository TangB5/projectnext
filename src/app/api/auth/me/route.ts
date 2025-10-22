import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload as JoseJWTPayload } from "jose";

// --- Interface personnalisée pour ton payload JWT ---
interface MyJWTPayload extends JoseJWTPayload {
    _id: string;
    name: string;
    email: string;
    roles: string[];
}

async function verifyJWT(token: string): Promise<MyJWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        // ✅ Passe d'abord par unknown pour TS
        return payload as unknown as MyJWTPayload;
    } catch (err) {
        console.error("JWT invalide :", err);
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("authToken")?.value;
        if (!token) return NextResponse.json({ user: null });

        const payload = await verifyJWT(token);
        if (!payload) return NextResponse.json({ user: null });

        return NextResponse.json({
            user: {
                id: payload._id,
                name: payload.name,
                email: payload.email,
                roles: payload.roles,
            },
        });
    } catch (err) {
        console.error("Erreur /api/auth/me :", err);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
