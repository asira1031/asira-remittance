import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = process.env.UNIONBANK_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing UNIONBANK_ACCESS_TOKEN in .env.local" },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api-uat.unionbankph.com/partners/sb/convergent/v1/accounts",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const text = await response.text();

  return NextResponse.json({
    success: response.ok,
    status: response.status,
    responseText: text,
  });
}