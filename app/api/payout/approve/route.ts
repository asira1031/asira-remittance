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

    await supabase
      .from("transactions")
      .update({ status: "PROCESSING" })
      .eq("id", transaction_id);

    // SAFE SIMULATION MODE muna.
    // Later dito natin ilalagay real UnionBank transfer API call.
    const unionbankPayload = {
  senderRefId: `ASIRA-${transaction_id}`,
  tranRequestDate: new Date().toISOString().split("T")[0],
  accountNo: "DESTINATION_ACCOUNT",
  amount: {
    currency: "PHP",
    value: Number(transaction.amount || 100),
  },
  remarks: "Asira payout",
};

console.log("UnionBank Payload:", unionbankPayload);

    await supabase
      .from("transactions")
      .update({ status: "PAID_OUT" })
      .eq("id", transaction_id);

    return NextResponse.json({
      success: true,
      message: "Payout approved and marked as PAID_OUT.",
      transaction_id,
      provider: "UNIONBANK",
      mode: "SIMULATION",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}