import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/session.server";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { message: "Utilisateur non connecté" },
                { status: 401 }
            );
        }

        return NextResponse.json(session);
    } catch (err) {
        console.error("Erreur récupération session :", err);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}
