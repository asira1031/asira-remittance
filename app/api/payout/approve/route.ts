import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transaction_id } = body;

    if (!transaction_id) {
      return NextResponse.json(
        { success: false, error: "Missing transaction_id" },
        { status: 400 }
      );
    }

    const { data: transaction, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transaction_id)
      .single();

    if (fetchError || !transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    const unionbankEnv = process.env.UNIONBANK_ENV || "uat";

    const baseUrl =
      process.env.UNIONBANK_BASE_URL || "https://api-uat.unionbankph.com";

    const accessToken = process.env.UNIONBANK_ACCESS_TOKEN;
    const clientId = process.env.UNIONBANK_CLIENT_ID;
    const clientSecret = process.env.UNIONBANK_CLIENT_SECRET;
    const partnerId = process.env.UNIONBANK_PARTNER_ID;

    if (!accessToken || !clientId || !clientSecret || !partnerId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing UnionBank credentials. Check UNIONBANK_ACCESS_TOKEN, UNIONBANK_CLIENT_ID, UNIONBANK_CLIENT_SECRET, and UNIONBANK_PARTNER_ID.",
        },
        { status: 500 }
      );
    }

    const destinationAccount =
      transaction.account_number ||
      transaction.receiver_account_number ||
      process.env.REMIT_RECEIVING_ACCOUNT_NUMBER;

    if (!destinationAccount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing destination account number",
        },
        { status: 400 }
      );
    }

    const payoutAmount = Number(
      transaction.php_amount || transaction.amount || 100
    );

    if (!payoutAmount || payoutAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payout amount",
        },
        { status: 400 }
      );
    }

    await supabase
      .from("transactions")
      .update({ status: "PROCESSING" })
      .eq("id", transaction_id);

    const unionbankPayload = {
      senderRefId: `ASIRA-${transaction_id}`,
      tranRequestDate: new Date().toISOString().split("T")[0],
      accountNo: String(destinationAccount),
      amount: {
        currency: "PHP",
        value: String(payoutAmount),
      },
      remarks: "Asira payout",
    };

    const endpoint =
      process.env.UNIONBANK_TRANSFER_ENDPOINT ||
      `${baseUrl}/partners/sb/pesonet/v1/transfers/single`;

    console.log("UnionBank ENV:", unionbankEnv);
    console.log("UnionBank Base URL:", baseUrl);
    console.log("UnionBank Full Endpoint:", endpoint);
    console.log("UnionBank Client ID loaded:", !!clientId);
    console.log("UnionBank Client Secret loaded:", !!clientSecret);
    console.log("UnionBank Partner ID loaded:", !!partnerId);
    console.log("UnionBank Access Token loaded:", !!accessToken);
    console.log("UnionBank Payload:", unionbankPayload);

    const unionbankResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-ibm-client-id": clientId,
        "x-ibm-client-secret": clientSecret,
        "x-partner-id": partnerId,
      },
      body: JSON.stringify(unionbankPayload),
    });

    const responseText = await unionbankResponse.text();

    let unionbankResult: any;

    try {
      unionbankResult = JSON.parse(responseText);
    } catch {
      unionbankResult = { raw: responseText };
    }

    console.log("UnionBank HTTP Status:", unionbankResponse.status);
    console.log("UnionBank Transfer Response:", unionbankResult);

    if (!unionbankResponse.ok) {
      await supabase
        .from("transactions")
        .update({ status: "FAILED" })
        .eq("id", transaction_id);

      return NextResponse.json(
        {
          success: false,
          message: "UnionBank transfer failed",
          endpoint,
          status: unionbankResponse.status,
          unionbankResult,
        },
        { status: 500 }
      );
    }

    await supabase
      .from("transactions")
      .update({ status: "PAID_OUT" })
      .eq("id", transaction_id);

    return NextResponse.json({
      success: true,
      message: "UnionBank payout executed successfully.",
      transaction_id,
      provider: "UNIONBANK",
      environment: unionbankEnv,
      endpoint,
      unionbankResult,
    });
  } catch (error) {
    console.log("Payout approve error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}