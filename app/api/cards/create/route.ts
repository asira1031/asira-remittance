import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = Number(body.amount || 0);
    const reference = body.reference || `ASIRA-CARD-${Date.now()}`;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    // DEMO hosted checkout URL muna
    // Later papalitan natin ito ng Maya/PayMongo real checkout URL
    const checkoutUrl = `/checkout/card?reference=${reference}&amount=${amount}`;

    return NextResponse.json({
      success: true,
      provider: "ASIRA_DEMO_CARD",
      reference,
      checkoutUrl,
    });
  } catch (error) {
    console.log("Create card payment error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}