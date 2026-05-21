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

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    state,
  });

  const authUrl =
    `https://api-uat.unionbankph.com/partners/sb/customers/v1/oauth2/authorize?${params.toString()}`;

  return NextResponse.json({
    ok: true,
    authUrl,
    redirectUri,
    clientId,
  });
}