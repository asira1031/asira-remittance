import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.UNIONBANK_CLIENT_ID;
  const clientSecret = process.env.UNIONBANK_CLIENT_SECRET;
  const partnerId = process.env.UNIONBANK_PARTNER_ID;

  return NextResponse.json({
    hasClientId: !!clientId,
    clientIdStart: clientId?.slice(0, 8),
    clientIdEnd: clientId?.slice(-8),

    hasClientSecret: !!clientSecret,
    clientSecretStart: clientSecret?.slice(0, 4),
    clientSecretEnd: clientSecret?.slice(-4),

    hasPartnerId: !!partnerId,
    partnerId,
  });
}