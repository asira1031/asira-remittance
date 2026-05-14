import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code" },
      { status: 400 }
    );
  }

  const clientId = process.env.UNIONBANK_CLIENT_ID;
  const clientSecret = process.env.UNIONBANK_CLIENT_SECRET;

  const response = await fetch(
    "https://api-uat.unionbankph.com/partners/sb/convergent/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "x-ibm-client-id": clientId!,
        "x-ibm-client-secret": clientSecret!,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://localhost:3000/callback",
        client_id: clientId!,
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