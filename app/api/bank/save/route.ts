import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const access_token = process.env.UNIONBANK_ACCESS_TOKEN;
  const refresh_token = process.env.UNIONBANK_REFRESH_TOKEN;

  const { data, error } = await supabase
    .from("bank_connections")
    .insert([
      {
        provider: "UNIONBANK",
        access_token,
        refresh_token,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    data,
  });
}