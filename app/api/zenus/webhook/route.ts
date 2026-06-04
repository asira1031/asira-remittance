import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();

  console.log("ZENUS WEBHOOK:", payload);

  return NextResponse.json({
    ok: true,
  });
}