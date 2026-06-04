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
          status: "NOT CONFIGURED",
          message: "Zenus environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const body = new URLSearchParams();
    body.set("client_id", clientId);
    body.set("client_secret", clientSecret);
    body.set("grant_type", grantType);
    if (scope) body.set("scope", scope);

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        status: "DISCONNECTED",
        message: "Zenus token check failed.",
      });
    }

    return NextResponse.json({
      ok: true,
      status: "CONNECTED",
      environment: "ZENUS DEV / SANDBOX",
      token: "VALID",
      message: "Zenus Bank API connected successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        status: "ERROR",
        message: error.message || "Zenus status check failed.",
      },
      { status: 500 }
    );
  }
}