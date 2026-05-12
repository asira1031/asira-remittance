import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    return NextResponse.json({
      success: false,
      error,
      errorDescription,
    });
  }

  if (!code) {
    return NextResponse.json({
      success: false,
      message: "No authorization code received yet.",
      state,
    });
  }

  return NextResponse.json({
    success: true,
    message: "UnionBank callback received.",
    code,
    state,
  });
}