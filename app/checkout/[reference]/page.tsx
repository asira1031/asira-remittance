"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const params = useParams();
  const reference = params.reference as string;

  const [method, setMethod] = useState("Card");

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-black text-emerald-400">
          ASIRA CHECKOUT
        </h1>

        <p className="mt-2 text-white/50">
          Secure multi-rail payment processing
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
          <p className="text-white/50 text-sm">Payment Reference</p>
          <p className="mt-2 text-emerald-400 font-black break-all">
            {reference}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
          <p className="text-white/50 text-sm">Status</p>
          <p className="mt-2 text-yellow-400 font-black">PENDING</p>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-8">
          {["Card", "Bank", "SWIFT", "Crypto"].map((item) => (
            <button
              key={item}
              onClick={() => setMethod(item)}
              className={`rounded-2xl py-4 font-black ${
                method === item
                  ? "bg-emerald-500 text-black"
                  : "border border-white/10 text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
          {method === "Card" && (
            <div className="space-y-4">
              <p className="text-white/50">Card Payment Details</p>
              <input placeholder="Cardholder Name" className="input" />
              <input placeholder="Card Number" className="input" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Expiry" className="input" />
                <input placeholder="CVV" className="input" />
              </div>
            </div>
          )}

          {method === "Bank" && (
            <div className="space-y-4">
              <p className="text-white/50">Bank Transfer Details</p>
              <input placeholder="Bank Name" className="input" />
              <input placeholder="Account Name" className="input" />
              <input placeholder="Account Number" className="input" />
            </div>
          )}

          {method === "SWIFT" && (
            <div className="space-y-4">
              <p className="text-white/50">International SWIFT Details</p>
              <input placeholder="Beneficiary Bank" className="input" />
              <input placeholder="SWIFT / BIC Code" className="input" />
              <input placeholder="IBAN / Account Number" className="input" />
            </div>
          )}

          {method === "Crypto" && (
            <div className="space-y-4">
              <p className="text-white/50">Crypto Payment Details</p>
              <input placeholder="Wallet Address" className="input" />
              <input placeholder="Network" className="input" />
              <input placeholder="Transaction Hash" className="input" />
            </div>
          )}
        </div>

        <button
          onClick={() => alert("Payment submitted for review.")}
          className="mt-8 w-full rounded-2xl bg-emerald-500 py-4 font-black text-black"
        >
          Submit Payment
        </button>
      </div>
    </main>
  );
}