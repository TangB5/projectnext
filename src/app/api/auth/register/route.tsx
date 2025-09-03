// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { register as registerHelper } from "@/app/lib/apiHelpers";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await registerHelper(data);
  return NextResponse.json(result);
}
