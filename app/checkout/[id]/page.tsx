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
};

export default function CheckoutPage() {
  const params = useParams();
  const id = params.id as string;

  const [payment, setPayment] = useState<PaymentIntent | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"card" | "bank" | "crypto">("card");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  async function loadPayment() {
    const { data, error } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setPayment(data);
  }

  async function proceedPayment() {
    if (!payment) return;

    if (method === "card" && (!cardName || !cardNumber || !expiry || !cvv)) {
      alert("Please complete card details");
      return;
    }

    setLoading(true);

    const nextStatus =
      method === "card"
        ? "PAID"
        : method === "bank"
        ? "AWAITING_BANK_TRANSFER"
        : "AWAITING_CRYPTO_PAYMENT";

    const { error } = await supabase
      .from("payment_intents")
      .update({ status: nextStatus })
      .eq("id", payment.id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (method === "card") {
      await supabase
        .from("transactions")
        .update({ status: "APPROVED" })
        .eq("id", payment.transaction_id);
    }

    await loadPayment();
    setLoading(false);
  }

  useEffect(() => {
    if (id) loadPayment();
  }, [id]);

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-red-400">❌ {errorMessage}</div>
      </main>
    );
  }

  if (!payment) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Checkout...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-black text-emerald-400">
          ASIRA CHECKOUT
        </h1>

        <p className="text-white/50 mt-2">
          Secure multi-rail payment processing
        </p>

        <div className="mt-10 space-y-5">
          <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
            <p className="text-white/50 text-sm">Payment Reference</p>
            <h2 className="text-xl font-bold text-emerald-400 mt-2">
              {payment.reference}
            </h2>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
            <p className="text-white/50 text-sm">Amount Due</p>
            <h2 className="text-4xl font-black mt-2">
              ${payment.amount} {payment.currency}
            </h2>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
            <p className="text-white/50 text-sm">Status</p>
            <h2
              className={`text-xl font-bold mt-2 ${
                payment.status === "PAID"
                  ? "text-emerald-400"
                  : "text-yellow-300"
              }`}
            >
              {payment.status}
            </h2>
          </div>
        </div>

        {payment.status !== "PAID" && (
          <>
            <div className="grid grid-cols-3 gap-3 mt-8">
              <button
                onClick={() => setMethod("card")}
                className={`rounded-2xl py-4 font-bold border ${
                  method === "card"
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : "bg-black/30 text-white border-white/10"
                }`}
              >
                Card
              </button>

              <button
                onClick={() => setMethod("bank")}
                className={`rounded-2xl py-4 font-bold border ${
                  method === "bank"
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : "bg-black/30 text-white border-white/10"
                }`}
              >
                Bank
              </button>

              <button
                onClick={() => setMethod("crypto")}
                className={`rounded-2xl py-4 font-bold border ${
                  method === "crypto"
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : "bg-black/30 text-white border-white/10"
                }`}
              >
                Crypto
              </button>
            </div>

            {method === "card" && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-white/50 text-sm mb-4">
                  Card Payment 
                </p>

                <label className="block text-sm text-white/50 mb-2">
                  Cardholder Name
                </label>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full mb-4 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                />

                <label className="block text-sm text-white/50 mb-2">
                  Card Number
                </label>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full mb-4 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-2">
                      Expiry
                    </label>
                    <input
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="12/30"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/50 mb-2">
                      CVV
                    </label>
                    <input
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === "bank" && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
                <p className="text-white/50 text-sm">
                  Bank Transfer / SWIFT Instructions
                </p>

                <div>
                  <p className="text-white/50 text-sm">Beneficiary Name</p>
                  <p className="font-bold">ASIRA GLOBAL REMIT LTD</p>
                </div>

                <div>
                  <p className="text-white/50 text-sm">Bank Name</p>
                  <p className="font-bold">Partner Settlement Bank</p>
                </div>

                <div>
                  <p className="text-white/50 text-sm">SWIFT / BIC</p>
                  <p className="font-bold">ASIRAPHXXX</p>
                </div>

                <div>
                  <p className="text-white/50 text-sm">Payment Reference</p>
                  <p className="font-bold text-emerald-400">
                    {payment.reference}
                  </p>
                </div>

                <p className="text-yellow-300 text-sm">
                  Send exact amount and include the payment reference. Admin will confirm once funds are received.
                </p>
              </div>
            )}

            {method === "crypto" && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
                <p className="text-white/50 text-sm">
                  Crypto Payment Instructions
                </p>

                <div>
                  <p className="text-white/50 text-sm">Asset</p>
                  <p className="font-bold">USDT</p>
                </div>

                <div>
                  <p className="text-white/50 text-sm">Network</p>
                  <p className="font-bold">ERC20</p>
                </div>

                <div>
                  <p className="text-white/50 text-sm">Wallet Address</p>
                  <p className="font-bold text-emerald-400 break-all">
                   0xc47133a6bd653793562a1ea25cb1d3161fbd99cd
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-sm">Payment Reference</p>
                  <p className="font-bold text-emerald-400">
                    {payment.reference}
                  </p>
                </div>

                <p className="text-yellow-300 text-sm">
                  Send USDT using ERC20 only. Admin will verify blockchain confirmation before approval.
                </p>
              </div>
            )}
          </>
        )}

        <button
          onClick={proceedPayment}
          disabled={loading || payment.status === "PAID"}
          className="w-full mt-8 rounded-2xl bg-emerald-500 text-black font-bold py-4 disabled:opacity-50"
        >
          {payment.status === "PAID"
            ? "Payment Completed"
            : loading
            ? "Processing..."
            : method === "bank"
            ? "Confirm Bank Transfer Instructions"
            : method === "crypto"
            ? "Confirm Crypto Payment Instructions"
            : "Pay Now"}
        </button>
      </div>
    </main>
  );
}