// src/app/api/auth/logout/route.ts
import { deleteSession } from "@/app/lib/session.server";

export async function POST() {
    return deleteSession();
}
