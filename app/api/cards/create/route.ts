import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function detectCardType(cardNumber: string) {
  if (cardNumber.startsWith("4")) {
    return "VISA";
  }

  if (cardNumber.startsWith("5")) {
    return "MASTERCARD";
  }

  return "CARD";
}

function maskCard(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");

  const first = digits.slice(0, 1);
  const last4 = digits.slice(-4);

  return `${first}*** **** **** ${last4}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const reference = `CARD-${Date.now()}`;

    const maskedCard = maskCard(
      body.card_number || ""
    );

    const cardType = detectCardType(
      body.card_number || ""
    );

    const { data, error } = await supabase
      .from("card_payments")
      .insert([
        {
          reference,

          cardholder_name:
            body.cardholder_name,

          masked_card: maskedCard,

          card_type: cardType,

          country: body.country,

          amount: Number(body.amount || 0),

          currency:
            body.currency || "USD",

          linked_transfer:
            body.linked_transfer || "",

          status: "PROCESSING",
        },
      ])
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
      card_payment: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create card payment",
      },
      { status: 500 }
    );
  }
}