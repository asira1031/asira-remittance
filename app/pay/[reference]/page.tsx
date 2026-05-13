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

  receiver_bank_name: string;
  receiver_account_name: string;
  receiver_account_number: string;
  receiver_country: string;
  receiver_currency: string;
  payout_rail: string;
  swift_code: string;
  iban: string;
};

export default function HostedPaymentPage() {
  const params = useParams();
  const reference = params.reference as string;

  const [payment, setPayment] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

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
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-black text-emerald-400">
            ASIRA CHECKOUT
          </h1>

          <p className="text-white/50 mt-2">
            Secure hosted payment page
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <p className="text-white/50 text-sm">Amount Due</p>

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
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-black">
              Select Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedMethod("BANK")}
                className={`rounded-2xl border p-5 text-left transition ${
                  selectedMethod === "BANK"
                    ? "border-emerald-400 bg-emerald-500/10"
                    : "border-white/10 bg-black/40"
                }`}
              >
                <h3 className="text-xl font-black text-emerald-400">
                  Bank Transfer
                </h3>
                <p className="text-white/50 text-sm mt-2">
                  Local bank transfer via InstaPay or PESONet.
                </p>
              </button>

              <button
                onClick={() => setSelectedMethod("CARD")}
                className={`rounded-2xl border p-5 text-left transition ${
                  selectedMethod === "CARD"
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-white/10 bg-black/40"
                }`}
              >
                <h3 className="text-xl font-black text-blue-400">
                  Card Payment
                </h3>
                <p className="text-white/50 text-sm mt-2">
                  Visa / Mastercard secure checkout.
                </p>
              </button>

              <button
                onClick={() => setSelectedMethod("SWIFT")}
                className={`rounded-2xl border p-5 text-left transition ${
                  selectedMethod === "SWIFT"
                    ? "border-yellow-300 bg-yellow-500/10"
                    : "border-white/10 bg-black/40"
                }`}
              >
                <h3 className="text-xl font-black text-yellow-300">
                  SWIFT / International
                </h3>
                <p className="text-white/50 text-sm mt-2">
                  International wire transfer.
                </p>
              </button>
            </div>

            {selectedMethod === "BANK" && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                <h3 className="text-2xl font-black text-emerald-400">
                  Bank Transfer Instructions
                </h3>

                <p className="text-white/50 text-sm mt-2">
                  Send the exact amount to the receiver bank details below.
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Receiver Bank" value={payment.receiver_bank_name} />
                  <Info label="Account Name" value={payment.receiver_account_name} />
                  <Info label="Account Number" value={payment.receiver_account_number} />
                  <Info label="Country" value={payment.receiver_country} />
                  <Info label="Currency" value={payment.receiver_currency} />
                  <Info label="Payout Rail" value={payment.payout_rail} />
                  <Info label="Payment Reference" value={payment.reference} />
                </div>

                <input
                  placeholder="Enter bank transfer reference number"
                  className="w-full mt-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />

                <button
                  onClick={markAsPaid}
                  disabled={paying}
                  className="w-full mt-6 rounded-2xl bg-emerald-500 py-4 font-black text-black disabled:opacity-50"
                >
                  {paying ? "Processing..." : "Confirm Bank Payment"}
                </button>
              </div>
            )}

            {selectedMethod === "CARD" && (
              <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
                <h3 className="text-2xl font-black text-blue-400">
                  Card Checkout
                </h3>

                <p className="text-white/50 text-sm mt-2">
                  Demo card form only. Card details are not saved.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <input
                    placeholder="Cardholder Name"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  />

                  <input
                    placeholder="Card Number"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  />

                  <input
                    placeholder="Expiry MM/YY"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  />

                  <input
                    placeholder="CVV"
                    type="password"
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  />
                </div>

                <button
                  onClick={markAsPaid}
                  disabled={paying}
                  className="w-full mt-6 rounded-2xl bg-blue-500 py-4 font-black text-white disabled:opacity-50"
                >
                  {paying ? "Processing..." : "Pay with Card"}
                </button>
              </div>
            )}

            {selectedMethod === "SWIFT" && (
              <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6">
                <h3 className="text-2xl font-black text-yellow-300">
                  SWIFT / International Wire
                </h3>

                <p className="text-white/50 text-sm mt-2">
                  Use these details for international wire transfer.
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Beneficiary" value={payment.receiver_account_name} />
                  <Info label="Receiver Bank" value={payment.receiver_bank_name} />
                  <Info label="Account Number" value={payment.receiver_account_number} />
                  <Info label="SWIFT/BIC" value={payment.swift_code} />
                  <Info label="IBAN" value={payment.iban} />
                  <Info label="Country" value={payment.receiver_country} />
                  <Info label="Currency" value={payment.receiver_currency} />
                  <Info label="Payment Reference" value={payment.reference} />
                  <Info label="Transfer Type" value="International Wire Transfer" />
                </div>

                <input
                  placeholder="Enter SWIFT transaction reference"
                  className="w-full mt-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />

                <button
                  onClick={markAsPaid}
                  disabled={paying}
                  className="w-full mt-6 rounded-2xl bg-yellow-400 py-4 font-black text-black disabled:opacity-50"
                >
                  {paying ? "Processing..." : "Confirm SWIFT Transfer"}
                </button>
              </div>
            )}
          </div>
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