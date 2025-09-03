import { NextResponse } from "next/server";
import { logout as logoutHelper } from "@/app/lib/apiHelpers";

export async function POST() {
  const result = await logoutHelper();
  return NextResponse.json(result);
}
