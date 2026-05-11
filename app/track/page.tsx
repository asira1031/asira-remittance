"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type PaymentIntent = {
  id: number;
  transaction_id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
};

export default function TrackPage() {
  const [reference, setReference] = useState("");
  const [payment, setPayment] = useState<PaymentIntent | null>(null);
  const [message, setMessage] = useState("");

  async function handleTrack() {
    setMessage("");
    setPayment(null);

    const cleanReference = reference.trim();

    const { data, error } = await supabase
      .from("payment_intents")
      .select("*");

    if (error) {
      setMessage(`❌ ${error.message}`);
      console.log("Track error:", error);
      return;
    }

    console.log("REFERENCE INPUT:", cleanReference);
    console.log("PAYMENT DATA:", data);

    const found = data.find(
      (item) => String(item.reference).trim() === cleanReference
    );

    if (!found) {
      setMessage("❌ Transaction not found");
      return;
    }

    setPayment(found);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-black text-emerald-400">
          TRACK TRANSFER
        </h1>

        <p className="text-white/50 mt-2">
          Enter your payment reference
        </p>

        <div className="mt-8">
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="ASIRA-XXXXXXXX"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-4 outline-none"
          />

          <button
            onClick={handleTrack}
            className="w-full mt-4 rounded-2xl bg-emerald-500 text-black font-bold py-4"
          >
            Track Transaction
          </button>
        </div>

        {message && (
          <p className="mt-6 text-center text-red-400">
            {message}
          </p>
        )}

        {payment && (
          <div className="mt-10 space-y-4">
            <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
              <p className="text-white/50 text-sm">Payment Reference</p>
              <h2 className="text-xl font-bold text-emerald-400 mt-2">
                {payment.reference}
              </h2>
            </div>

            <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
              <p className="text-white/50 text-sm">Transaction ID</p>
              <h2 className="text-xl font-bold mt-2">
                TX-{payment.transaction_id}
              </h2>
            </div>

            <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
              <p className="text-white/50 text-sm">Amount</p>
              <h2 className="text-3xl font-black mt-2">
                ${payment.amount} {payment.currency}
              </h2>
            </div>

            <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
              <p className="text-white/50 text-sm">Payment Status</p>
              <h2 className="text-2xl font-black text-emerald-400 mt-2">
                {payment.status}
              </h2>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}