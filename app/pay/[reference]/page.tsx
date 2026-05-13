"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PaymentLink = {
  id: number;
  reference: string;
  merchant_name: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  payment_url: string;
  created_at: string;
};

export default function HostedPaymentPage() {
  const params = useParams();
  const reference = params.reference as string;

  const [payment, setPayment] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  async function loadPayment() {
    const { data, error } = await supabase
      .from("merchant_payment_links")
      .select("*")
      .eq("reference", reference)
      .single();

    if (!error && data) {
      setPayment(data);
    }

    setLoading(false);
  }

  async function markAsPaid() {
    if (!payment) return;

    setPaying(true);
    setMessage("");

    const { error } = await supabase
      .from("merchant_payment_links")
      .update({ status: "PAID" })
      .eq("id", payment.id);

    if (error) {
      setMessage(`❌ ${error.message}`);
      setPaying(false);
      return;
    }

    setPayment({
      ...payment,
      status: "PAID",
    });

    setMessage("✅ Payment marked as paid successfully.");
    setPaying(false);
  }

  useEffect(() => {
    if (reference) {
      loadPayment();
    }
  }, [reference]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading payment page...
      </main>
    );
  }

  if (!payment) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-black text-red-400">
            Payment Link Not Found
          </h1>
          <p className="text-white/50 mt-3">
            This payment link does not exist or may have been removed.
          </p>
        </div>
      </main>
    );
  }

  const isPaid = payment.status === "PAID";
  const isCancelled = payment.status === "CANCELLED";

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-black text-emerald-400">
            ASIRA CHECKOUT
          </h1>

          <p className="text-white/50 mt-2">
            Secure hosted payment page
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <p className="text-white/50 text-sm">
            Amount Due
          </p>

          <h2 className="text-5xl font-black text-emerald-400 mt-2">
            {payment.currency}{" "}
            {Number(payment.amount || 0).toLocaleString()}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Info label="Reference" value={payment.reference} />
          <Info label="Merchant" value={payment.merchant_name} />
          <Info label="Customer" value={payment.customer_name} />
          <Info label="Customer Email" value={payment.customer_email} />
          <Info label="Description" value={payment.description} />
          <Info label="Status" value={payment.status} />
        </div>

        {isCancelled && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400 font-bold">
            This payment link has been cancelled.
          </div>
        )}

        {isPaid && (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-400 font-bold">
            Payment already completed.
          </div>
        )}

        {!isPaid && !isCancelled && (
          <button
            onClick={markAsPaid}
            disabled={paying}
            className="w-full mt-8 rounded-2xl bg-emerald-500 py-4 font-black text-black disabled:opacity-50"
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        )}

        {message && (
          <p className="text-center text-white/70 mt-5">
            {message}
          </p>
        )}

        <p className="text-center text-white/30 text-xs mt-8">
          Powered by Asira Global Remit Gateway
        </p>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="font-bold mt-1 break-words">{value || "N/A"}</p>
    </div>
  );
}