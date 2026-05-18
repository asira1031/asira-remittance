"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CardCheckoutPage() {
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference") || "ASIRA-CARD";
  const amount = searchParams.get("amount") || "0";

  const [status, setStatus] = useState("");

  function handlePay() {
    setStatus("✅ Demo card payment approved. Transaction is ready for confirmation.");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-bold">Asira Card Checkout</h1>

        <p className="mt-2 text-white/50 text-sm">
          Demo hosted card payment page
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/50">Reference</label>
            <input
              value={reference}
              readOnly
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-white/50">Amount</label>
            <input
              value={`PHP ${Number(amount).toLocaleString()}`}
              readOnly
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm text-white/50">Card Number</label>
            <input
              placeholder="4242 4242 4242 4242"
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="MM/YY"
              className="rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />
            <input
              placeholder="CVV"
              className="rounded-xl bg-black/40 border border-white/10 px-4 py-3"
            />
          </div>

          <button
            onClick={handlePay}
            className="w-full rounded-xl bg-white text-black font-semibold py-3"
          >
            Pay Now
          </button>

          {status && (
            <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm">
              {status}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}