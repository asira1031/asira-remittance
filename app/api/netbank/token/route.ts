import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.NETBANK_CLIENT_ID;
    const clientSecret = process.env.NETBANK_CLIENT_SECRET;
    const baseUrl = process.env.NETBANK_BASE_URL;
    const authUrl = process.env.NETBANK_AUTH_URL;

    if (!clientId || !clientSecret || !baseUrl || !authUrl) {
      return NextResponse.json({
        ok: false,
        message: "Missing Netbank environment variables",
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasBaseUrl: !!baseUrl,
        hasAuthUrl: !!authUrl,
      });
    }

    const tokenUrl = `${authUrl}/oauth2/token`;

    const auth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const text = await response.text();

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      tokenUrl,
      responseText: text,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      errorName: error?.name,
      errorMessage: error?.message,
      errorCause: error?.cause,
    });
  }
}