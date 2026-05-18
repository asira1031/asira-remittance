import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.NETBANK_CLIENT_ID;
    const clientSecret = process.env.NETBANK_CLIENT_SECRET;
    const baseUrl = process.env.NETBANK_BASE_URL;

    if (!clientId || !clientSecret || !baseUrl) {
      return NextResponse.json({
        ok: false,
        message: "Missing Netbank environment variables",
      });
    }

    const auth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const response = await fetch(
      `${baseUrl}/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      ok: true,
      token: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}