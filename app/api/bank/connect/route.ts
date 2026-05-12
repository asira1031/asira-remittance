import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.UNIONBANK_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing UNIONBANK_CLIENT_ID" },
      { status: 500 }
    );
  }

  const authUrl = new URL(
    "https://api-uat.unionbankph.com/partners/sb/convergent/v1/oauth2/authorize"
  );

  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", "https://localhost:3000/callback");
  authUrl.searchParams.set("scope", "payments");
  authUrl.searchParams.set("state", `ASIRA-${Date.now()}`);

  return NextResponse.redirect(authUrl.toString());
}