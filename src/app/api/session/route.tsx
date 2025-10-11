// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/session.server";

export async function GET() {
    const session = await getSession();
    return NextResponse.json(session ?? null);
}
