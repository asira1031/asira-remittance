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
        tokenData,
      });
    }

    const payload = {
      dryRun: true,
      amount: "1.00",
      currency: "PHP",
      reference: `ASIRA-TEST-${Date.now()}`,
      sender: {
        name: "Asira Global Remit Test",
      },
      receiver: {
        bank: "TEST BANK",
        accountName: "TEST RECEIVER",
        accountNumber: "0000000000",
      },
      note: "Dry run only. No real money should be sent.",
    };

    return NextResponse.json({
      ok: true,
      mode: "DRY_RUN_ONLY",
      message: "Token works. Test payload prepared. No transfer sent.",
      tokenType: parsedToken?.token_type,
      payload,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      errorName: error?.name,
      errorMessage: error?.message,
    });
  }
}