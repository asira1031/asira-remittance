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
    if (id) loadReceipt();
  }, [id]);

  if (!payment) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Receipt...
      </main>
    );
  }

  const fee = Number(payment.amount || 0) * 0.005;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8 print:bg-white print:text-black">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 print:border-black print:bg-white">
        <div className="flex justify-between items-start border-b border-white/10 pb-6 print:border-black">
          <div>
            <h1 className="text-4xl font-black text-emerald-400 print:text-black">
              ASIRA GLOBAL REMIT
            </h1>
            <p className="text-white/50 mt-2 print:text-black">
              Official Customer Payment Receipt
            </p>
          </div>

          <div className="text-right">
            <p className="text-white/50 text-sm print:text-black">
              Status
            </p>
            <h2 className="text-2xl font-black text-emerald-400 print:text-black">
              {payment.status || "PAID"}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 print:bg-white print:border-black">
          <p className="text-white/50 text-sm print:text-black">
            Payment Reference
          </p>
          <h2 className="text-2xl font-black text-emerald-400 print:text-black">
            {payment.reference}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Info label="Transaction ID" value={`TX-${payment.transaction_id}`} />
          <Info label="Receipt ID" value={`RCPT-${payment.id}`} />
          <Info label="Amount Paid" value={`$${Number(payment.amount).toLocaleString()} ${payment.currency}`} />
          <Info label="Service Fee 0.5%" value={`$${fee.toFixed(2)}`} />
          <Info label="Payment Method" value="Card / Bank / SWIFT" />
          <Info label="Date Issued" value={new Date(payment.created_at).toLocaleString()} />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 print:bg-white print:border-black">
          <h3 className="text-xl font-black mb-3">
            Receipt Notice
          </h3>
          <p className="text-white/60 text-sm leading-6 print:text-black">
            This receipt confirms that Asira Global Remit has created and recorded
            the payment instruction for this transaction. Final settlement is subject
            to compliance review, payout partner confirmation, and banking rail status.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full mt-8 rounded-2xl bg-emerald-500 text-black font-bold py-4 print:hidden"
        >
          Print / Save as PDF
        </button>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-black/40 p-5 border border-white/10 print:bg-white print:border-black">
      <p className="text-white/50 text-sm print:text-black">
        {label}
      </p>
      <h2 className="text-lg font-bold mt-2 break-words">
        {value || "N/A"}
      </h2>
    </div>
  );
}