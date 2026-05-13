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

  allow_bank: boolean;
  allow_card: boolean;
  allow_swift: boolean;
  allow_crypto: boolean;
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

  async function markAsPaid(method: string) {
    if (!payment) return;

    setPaying(true);
    setMessage("");

    const { error } = await supabase
      .from("merchant_payment_links")
      .update({
        status: "PAID",
        payout_rail: method,
      })
      .eq("id", payment.id);

    if (error) {
      setMessage(`❌ ${error.message}`);
      setPaying(false);
      return;
    }

    setPayment({
      ...payment,
      status: "PAID",
      payout_rail: method,
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
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl font-black text-emerald-400">
            ASIRA CHECKOUT
          </h1>

          <p className="text-white/50 mt-2">
            Secure multi-rail payment processing
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
          <Alert
            tone="red"
            text="This payment link has been cancelled."
          />
        )}

        {isPaid && (
          <Alert
            tone="emerald"
            text="Payment already completed."
          />
        )}

        {!isPaid && !isCancelled && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-black">
              Select Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {payment.allow_bank !== false && (
                <MethodButton
                  title="Bank"
                  desc="Local bank transfer"
                  color="emerald"
                  active={selectedMethod === "BANK"}
                  onClick={() => setSelectedMethod("BANK")}
                />
              )}

              {payment.allow_card !== false && (
                <MethodButton
                  title="Card"
                  desc="Visa / Mastercard"
                  color="blue"
                  active={selectedMethod === "CARD"}
                  onClick={() => setSelectedMethod("CARD")}
                />
              )}

              {payment.allow_swift !== false && (
                <MethodButton
                  title="SWIFT"
                  desc="International wire"
                  color="yellow"
                  active={selectedMethod === "SWIFT"}
                  onClick={() => setSelectedMethod("SWIFT")}
                />
              )}

              {payment.allow_crypto === true && (
                <MethodButton
                  title="Crypto"
                  desc="USDT settlement"
                  color="purple"
                  active={selectedMethod === "CRYPTO"}
                  onClick={() => setSelectedMethod("CRYPTO")}
                />
              )}
            </div>

            {selectedMethod === "BANK" && (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                <h3 className="text-2xl font-black text-emerald-400">
                  Bank Transfer Details
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
                  <Info label="Payment Reference" value={payment.reference} />
                </div>

                <input
                  placeholder="Enter bank transfer reference number"
                  className="w-full mt-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />

                <button
                  onClick={() => markAsPaid("BANK")}
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
                  Card Payment Details
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
                  onClick={() => markAsPaid("CARD")}
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
                  SWIFT / International Wire Details
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
                </div>

                <input
                  placeholder="Enter SWIFT transaction reference"
                  className="w-full mt-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />

                <button
                  onClick={() => markAsPaid("SWIFT")}
                  disabled={paying}
                  className="w-full mt-6 rounded-2xl bg-yellow-400 py-4 font-black text-black disabled:opacity-50"
                >
                  {paying ? "Processing..." : "Confirm SWIFT Transfer"}
                </button>
              </div>
            )}

            {selectedMethod === "CRYPTO" && (
              <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
                <h3 className="text-2xl font-black text-purple-300">
                  Crypto Payment Details
                </h3>

                <p className="text-white/50 text-sm mt-2">
                  USDT settlement placeholder for future crypto rail.
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Network" value="USDT ERC20 / TRC20" />
                  <Info label="Payment Reference" value={payment.reference} />
                </div>

                <input
                  placeholder="Enter blockchain transaction hash"
                  className="w-full mt-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                />

                <button
                  onClick={() => markAsPaid("CRYPTO")}
                  disabled={paying}
                  className="w-full mt-6 rounded-2xl bg-purple-500 py-4 font-black text-white disabled:opacity-50"
                >
                  {paying ? "Processing..." : "Confirm Crypto Payment"}
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

function Alert({ text, tone }: { text: string; tone: "red" | "emerald" }) {
  const classes =
    tone === "red"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

  return (
    <div className={`mt-6 rounded-2xl border p-5 font-bold ${classes}`}>
      {text}
    </div>
  );
}

function MethodButton({
  title,
  desc,
  color,
  active,
  onClick,
}: {
  title: string;
  desc: string;
  color: "emerald" | "blue" | "yellow" | "purple";
  active: boolean;
  onClick: () => void;
}) {
  const activeClasses = {
    emerald: "border-emerald-400 bg-emerald-500/10 text-emerald-400",
    blue: "border-blue-400 bg-blue-500/10 text-blue-400",
    yellow: "border-yellow-300 bg-yellow-500/10 text-yellow-300",
    purple: "border-purple-300 bg-purple-500/10 text-purple-300",
  };

  const textClasses = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    yellow: "text-yellow-300",
    purple: "text-purple-300",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        active ? activeClasses[color] : "border-white/10 bg-black/40"
      }`}
    >
      <h3 className={`text-xl font-black ${textClasses[color]}`}>
        {title}
      </h3>
      <p className="text-white/50 text-sm mt-2">{desc}</p>
    </button>
  );
}