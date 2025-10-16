import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token manquant" }, { status: 400 });
        }


        const response = NextResponse.json({ message: "Cookie défini avec succès" });

        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 jours
        });

        return response;
    } catch (error) {
        console.error("Erreur set-cookie:", error);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}
