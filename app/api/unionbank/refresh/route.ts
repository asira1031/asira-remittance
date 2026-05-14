import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId =
      process.env.UNIONBANK_CLIENT_ID;

    const clientSecret =
      process.env.UNIONBANK_CLIENT_SECRET;

    const refreshToken =
      process.env.UNIONBANK_REFRESH_TOKEN;

    const basic = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const response = await fetch(
      "https://api-uat.unionbankph.com/partners/sb/convergent/v1/oauth2/token",
      {
        method: "POST",

        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken || "",
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}