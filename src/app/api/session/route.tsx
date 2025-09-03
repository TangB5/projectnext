// /app/api/session/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  try {
    const session = await getSession(); 
    return NextResponse.json(session);
  } catch (error) {
    console.error("Erreur GET /api/session :", error);
    return NextResponse.json(null, { status: 500 });
  }
}
