import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      amount,
      accountName,
      accountNumber,
      bankCode,
    } = body;

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

    const payload = {
      dryRun: true,
      amount,
      currency: "PHP",
      reference: `ASIRA-${Date.now()}`,
      sender: {
        name: "Asira Global Remit",
      },
      receiver: {
        bankCode,
        accountName,
        accountNumber,
      },
      note: "UAT transfer test only",
    };

    return NextResponse.json({
      ok: true,
      mode: "UAT_DRY_RUN",
      message:
        "Transfer payload prepared successfully. No money sent.",
      payload,
      tokenType: parsedToken?.token_type,
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      errorName: error?.name,
      errorMessage: error?.message,
    });
  }
}