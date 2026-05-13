import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { remitConfig } from "@/lib/remitConfig";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      sender_name,
      receiver_name,
      amount,
      destination_country,
    } = body;

    const transactionData = {
      sender_name,
      receiver_name,
      amount,
      destination_country,

      bank_name: remitConfig.receivingBankName,
      account_name: remitConfig.receivingAccountName,
      account_number: remitConfig.receivingAccountNumber,
      branch: remitConfig.receivingBranch,
      environment: remitConfig.mode,
      payment_mode: remitConfig.paymentMode,

      status: "PENDING",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}