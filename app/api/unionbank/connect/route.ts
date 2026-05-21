import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.UNIONBANK_CLIENT_ID;
  const redirectUri = process.env.UNIONBANK_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json({
      ok: false,
      message: "Missing UnionBank env",
      hasClientId: !!clientId,
      redirectUri,
    });
  }

  const state = `ASIRA-${Date.now()}`;

  const authUrl =
    `https://api-uat.unionbankph.com/partners/sb/customers/v1/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("account_info")}` +
    `&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(authUrl);
}