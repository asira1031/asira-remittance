import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tokenUrl = process.env.ZENUS_TOKEN_URL;
    const clientId = process.env.ZENUS_CLIENT_ID;
    const clientSecret = process.env.ZENUS_CLIENT_SECRET;
    const grantType = process.env.ZENUS_GRANT_TYPE || "client_credentials";
    const scope = process.env.ZENUS_SCOPE;

    if (!tokenUrl || !clientId || !clientSecret) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Missing Zenus environment variables. Required: ZENUS_TOKEN_URL, ZENUS_CLIENT_ID, ZENUS_CLIENT_SECRET",
        },
        { status: 500 }
      );
    }

    const body = new URLSearchParams();
    body.set("client_id", clientId);
    body.set("client_secret", clientSecret);
    body.set("grant_type", grantType);

    if (scope) {
      body.set("scope", scope);
    }

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    const text = await res.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          message: "Zenus token request failed",
          response: data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      token_type: data.token_type,
      expires_in: data.expires_in,
      access_token_preview: data.access_token
        ? `${data.access_token.slice(0, 20)}...`
        : null,
      message: "Zenus access token received successfully.",
    });
  } catch (error: any) {
    console.error("ZENUS TOKEN ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Failed to get Zenus token.",
      },
      { status: 500 }
    );
  }
}