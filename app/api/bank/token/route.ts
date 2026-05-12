import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const clientId = process.env.UNIONBANK_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing UNIONBANK_CLIENT_ID" },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api-uat.unionbankph.com/partners/sb/convergent/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code,
        redirect_uri: "https://localhost:3000/callback",
      }),
    }
  );

  const text = await response.text();

  return NextResponse.json({
    success: response.ok,
    status: response.status,
    responseText: text,
  });
}