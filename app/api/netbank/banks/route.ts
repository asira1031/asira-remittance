import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tokenRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/netbank/token`
    );

    const tokenData = await tokenRes.json();

    let parsedToken: any = tokenData?.token;

    if (!parsedToken && tokenData?.responseText) {
      parsedToken = JSON.parse(tokenData.responseText);
    }

    const accessToken = parsedToken?.access_token;

    if (!accessToken) {
      return NextResponse.json({
        ok: false,
        message: "No access token",
      });
    }

    const response = await fetch(
      `https://api.netbank.ph/v1/collect/financial_institutions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const text = await response.text();

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseText: text,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      errorName: error?.name,
      errorMessage: error?.message,
    });
  }
}