import { NextResponse } from "next/server";
import { remitConfig } from "@/lib/remitConfig";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Production Mode:", remitConfig.mode);

    const payload = {
      senderName: body.senderName,
      receiverName: body.receiverName,
      amount: body.amount,
      bankName: remitConfig.receivingBankName,
      accountName: remitConfig.receivingAccountName,
      accountNumber: remitConfig.receivingAccountNumber,
      branch: remitConfig.receivingBranch,
      paymentMode: remitConfig.paymentMode,
    };

    return NextResponse.json({
      success: true,
      environment: remitConfig.mode,
      data: payload,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create remittance",
      },
      { status: 500 }
    );
  }
}