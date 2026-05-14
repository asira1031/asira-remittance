import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.UNIONBANK_CLIENT_ID;

  const redirectUri =
  "https://api-uat.unionbankph.com/ubp/uat/v1/redirect";

  const state = `ASIRA-${Date.now()}`;

  const url =
    "https://api-uat.unionbankph.com/partners/sb/customers/v1/oauth2/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId || "")}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent("account_info")}` +
    `&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(url);
}