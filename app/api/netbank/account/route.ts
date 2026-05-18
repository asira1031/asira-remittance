import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tokenRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/netbank/token`
    );

    const tokenData = await tokenRes.json();

    const accessToken =
      tokenData?.token?.access_token;

    if (!accessToken) {
      return NextResponse.json({
        ok: false,
        message: "No access token",
      });
    }

    const response = await fetch(
      `${process.env.NETBANK_BASE_URL}/accounts`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
    });
  }
}