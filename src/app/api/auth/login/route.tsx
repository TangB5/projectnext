import { NextRequest, NextResponse } from "next/server";
import { login as loginHelper } from "@/app/lib/apiHelpers";

export async function POST(req: NextRequest) {
  const data = await req.json(); 
  
  const result = await loginHelper(data); 
  return NextResponse.json(result);
}
