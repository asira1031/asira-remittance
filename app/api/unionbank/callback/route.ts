import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // If UnionBank returns an OAuth error
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          provider: "UnionBank",
          message: "OAuth callback returned an error",
          error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      provider: "UnionBank",
      message: "UnionBank callback route working",
      received: {
        code,
        state,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Callback route failed",
        error: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}