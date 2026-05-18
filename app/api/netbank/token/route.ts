import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId =
      process.env.NETBANK_UAT_CLIENT_ID ||
      process.env.NETBANK_SANDBOX_CLIENT_ID;

    const clientSecret =
      process.env.NETBANK_UAT_CLIENT_SECRET ||
      process.env.NETBANK_SANDBOX_CLIENT_SECRET;

    const baseUrl =
      process.env.NETBANK_UAT_BASE_URL ||
      process.env.NETBANK_SANDBOX_BASE_URL;

    if (!clientId || !clientSecret || !baseUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing Netbank environment variables",
        },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const response = await fetch(
      `${baseUrl}/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const data = await response.json();

    return NextResponse.json({
      ok: true,
      environment: baseUrl,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}