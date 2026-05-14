import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  return NextResponse.json({
    ok: true,
    message: "UnionBank callback route working",
    code,
    state,
  });
}