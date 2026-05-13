"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PaymentIntent = {
  id: number | null;
  transaction_id: number | null;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  transactions?: {
    amount: number;
    payment_method?: string;
  };
};

type Method = "card" | "bank" | "swift" | "crypto";

export default function CheckoutPage() {
  const params = useParams();
  const id = params.id as string;

  const [payment, setPayment] = useState<PaymentIntent | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<Method>("card");

  async function loadPayment() {
    setErrorMessage("");

    const isNumericId = /^\d+$/.test(id);

    const query = supabase
      .from("payment_intents")
      .select("*");

    const { data: paymentData, error: paymentError } = isNumericId
      ? await query.eq("id", Number(id)).maybeSingle()
      : await query.eq("reference", id).maybeSingle();

    if (!paymentData || paymentError) {
      setPayment({
        id: null,
        transaction_id: null,
        reference: id,
        amount: 0,
        currency: "USD",
        status: "PENDING",
      });
      return;
    }

    let transactionData = null;

    if (paymentData.transaction_id) {
      const { data } = await supabase
        .from("transactions")
        .select("amount, payment_method")
        .eq("id", paymentData.transaction_id)
        .maybeSingle();

      transactionData = data;
    }

    setPayment({
      ...paymentData,
      transactions: transactionData || undefined,
    });

    const rail = transactionData?.payment_method;

    if (rail === "BANK") setMethod("bank");
    if (rail === "CARD") setMethod("card");
    if (rail === "SWIFT") setMethod("swift");
    if (rail === "CRYPTO") setMethod("crypto");
  }

  async function proceedPayment() {
    if (!payment) return;

    setLoading(true);

    const nextStatus =
      method === "card"
        ? "PAID"
        : method === "bank"
        ? "AWAITING_BANK_TRANSFER"
        : method === "swift"
        ? "AWAITING_SWIFT_TRANSFER"
        : "AWAITING_CRYPTO_PAYMENT";

    if (payment.id) {
      await supabase
        .from("payment_intents")
        .update({ status: nextStatus })
        .eq("id", payment.id);
    }

    if (payment.transaction_id) {
      await supabase
        .from("transactions")
        .update({
          status: method === "card" ? "APPROVED" : "PROCESSING",
          payment_method: method.toUpperCase(),
        })
        .eq("id", payment.transaction_id);
    }

    setPayment({
      ...payment,
      status: nextStatus,
    });

    setLoading(false);

    alert("Payment submitted for review.");
  }

  useEffect(() => {
    if (id) loadPayment();
  }, [id]);

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">❌ {errorMessage}</p>
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

  const displayAmount =
    Number(payment.amount || 0) > 0
      ? Number(payment.amount)
      : Number(payment.transactions?.amount || 0);

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
            <h2 className="text-xl font-bold text-emerald-400 mt-2 break-all">
              {payment.reference}
            </h2>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
            <p className="text-white/50 text-sm">Amount Due</p>
            <h2 className="text-4xl font-black mt-2">
              ${displayAmount.toLocaleString()} {payment.currency || "USD"}
            </h2>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10">
            <p className="text-white/50 text-sm">Status</p>
            <h2 className="text-xl font-bold text-yellow-300 mt-2">
              {payment.status}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-8">
          {(["card", "bank", "swift", "crypto"] as Method[]).map((item) => (
            <button
              key={item}
              onClick={() => setMethod(item)}
              className={`rounded-2xl py-4 font-bold border capitalize ${
                method === item
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-black/30 text-white border-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {method === "card" && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
            <p className="text-white/50 text-sm">Card Payment Details</p>

            <input placeholder="Cardholder Name" className="input" />
            <input placeholder="Card Number" className="input" />

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Expiry" className="input" />
              <input placeholder="CVV" className="input" />
            </div>
          </div>
        )}

        {method === "bank" && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
            <p className="text-white/50 text-sm">Bank Transfer Details</p>

            <input placeholder="Account Holder Name" className="input" />
            <input placeholder="Bank Name" className="input" />
            <input placeholder="Account Number" className="input" />
            <input placeholder="Routing Number / IBAN" className="input" />

            <input value={payment.reference} readOnly className="input text-emerald-400 font-bold" />
          </div>
        )}

        {method === "swift" && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
            <p className="text-white/50 text-sm">SWIFT Transfer Details</p>

            <input placeholder="Beneficiary Name" className="input" />
            <input placeholder="Bank Name" className="input" />
            <input placeholder="SWIFT / BIC Code" className="input" />
            <input placeholder="IBAN / Account Number" className="input" />

            <input value={payment.reference} readOnly className="input text-emerald-400 font-bold" />
          </div>
        )}

        {method === "crypto" && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
            <p className="text-white/50 text-sm">Crypto Payment Details</p>

            <select className="input">
              <option>USDT</option>
              <option>BTC</option>
              <option>ETH</option>
              <option>USDC</option>
            </select>

            <select className="input">
              <option>ERC20</option>
              <option>TRC20</option>
              <option>BEP20</option>
              <option>Polygon</option>
            </select>

            <input placeholder="Sender Wallet Address" className="input" />

            <input
              value="0xc47133a6bd653793562a1ea25cb1d3161fbd99cd"
              readOnly
              className="input text-emerald-400 font-bold"
            />

            <input value={payment.reference} readOnly className="input text-emerald-400 font-bold" />
          </div>
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
            ? "Confirm Bank Transfer"
            : method === "swift"
            ? "Confirm SWIFT Instructions"
            : method === "crypto"
            ? "Confirm Crypto Instructions"
            : "Pay Now"}
        </button>
      </div>
    </main>
  );
}