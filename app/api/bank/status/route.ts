import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("bank_connections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({
      connected: false,
      error: error.message,
    });
  }

  if (!data) {
    return NextResponse.json({
      connected: false,
      message: "No bank connection saved yet",
    });
  }

  return NextResponse.json({
    connected: true,
    provider: data.provider,
    created_at: data.created_at,
  });
}