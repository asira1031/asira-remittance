"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PaymentIntent = {
  id: number;
  transaction_id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

export default function ReceiptPage() {
  const params = useParams();
  const id = params.id as string;

  const [payment, setPayment] = useState<PaymentIntent | null>(null);

  async function loadReceipt() {
    const { data, error } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (!error && data) {
      setPayment(data);
    }
  }

  useEffect(() => {
    if (id) {
      loadReceipt();
    }
  }, [id]);

  if (!payment) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Receipt...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="flex justify-between items-start border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-black text-emerald-400">
              ASIRA RECEIPT
            </h1>
            <p className="text-white/50 mt-2">
              Global Remit Payment Confirmation
            </p>
          </div>

          <div className="text-right">
            <p className="text-white/50 text-sm">Status</p>
            <h2 className="text-2xl font-black text-emerald-400">
              {payment.status}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 mt-8">
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
            <p className="text-white/50 text-sm">Amount Paid</p>
            <h2 className="text-4xl font-black mt-2">
              ${payment.amount} {payment.currency}
            </h2>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
            <p className="text-white/50 text-sm">Date</p>
            <h2 className="text-lg font-bold mt-2">
              {new Date(payment.created_at).toLocaleString()}
            </h2>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full mt-8 rounded-2xl bg-emerald-500 text-black font-bold py-4"
        >
          Print Receipt
        </button>
      </div>
    </main>
  );
}