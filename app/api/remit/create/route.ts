import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { remitConfig } from "@/lib/remitConfig";

import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const transactionData = {
      sender_name: body.sender_name,

      receiver_name: body.receiver_name,

      amount: Number(body.amount),

      destination_country:
        body.destination_country,

      payment_method:
        body.payment_method,

      receive_currency:
        body.receive_currency,

      receiver_bank_name:
        body.receiver_bank_name,

      receiver_account_number:
        body.receiver_account_number,

      swift_code: body.swift_code,

      purpose_of_transfer:
        body.purpose_of_transfer,

      source_of_funds:
        body.source_of_funds,

      bank_name:
        remitConfig.receivingBankName,

      account_name:
        remitConfig.receivingAccountName,

      account_number:
        remitConfig.receivingAccountNumber,

      branch:
        remitConfig.receivingBranch,

      payment_mode:
        remitConfig.paymentMode,

      environment:
        remitConfig.mode,

      status: "PENDING",

      compliance_status:
        "UNDER_REVIEW",

      created_at:
        new Date().toISOString(),
    };

    const { data, error } =
      await supabase
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

    if (body.email) {
      await sendEmail({
        to: body.email,

        subject:
          "Asira Transfer Created",

        html: `
          <div style="font-family:Arial;padding:20px;">
            <h1>
              ASIRA GLOBAL REMIT
            </h1>

            <p>
              Your remittance transaction has been created successfully.
            </p>

            <hr />

            <p>
              <strong>
                Reference:
              </strong>
              ASIRA-${data.id}
            </p>

            <p>
              <strong>
                Receiver:
              </strong>
              ${
                body.receiver_name
              }
            </p>

            <p>
              <strong>
                Amount:
              </strong>
              $${Number(
                body.amount
              ).toLocaleString()}
            </p>

            <p>
              <strong>
                Status:
              </strong>
              PENDING
            </p>

            <p>
              Thank you for using
              Asira Global Remit.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,

      environment:
        remitConfig.mode,

      transaction: data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to create remittance",
      },
      { status: 500 }
    );
  }
}