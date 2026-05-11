"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RemitPage() {
  const router = useRouter();

  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [usdRate, setUsdRate] = useState(56);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getRate() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();

        if (data?.rates?.PHP) {
          setUsdRate(data.rates.PHP);
        }
      } catch (error) {
        console.log("Rate fetch error:", error);
      }
    }

    getRate();
  }, []);

  function handleAmountChange(value: string) {
    setAmount(value);

    const usd = Number(value || 0);
    setConvertedAmount(usd * usdRate);
  }

  async function handleSubmit() {
    setLoading(true);
    setMessage("");

    const finalConvertedAmount = Number(amount || 0) * usdRate;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          sender_name: senderName,
          receiver_name: receiverName,
          amount: Number(amount),
          converted_amount: finalConvertedAmount,
          exchange_rate: usdRate,
          destination_country: destinationCountry,
        },
      ])
      .select()
      .single();

    if (error) {
      setMessage(`❌ ${error.message}`);
      console.log("Supabase insert error:", error);
      setLoading(false);
      return;
    }

    const { data: paymentData, error: paymentError } = await supabase
      .from("payment_intents")
      .insert([
        {
          transaction_id: data.id,
          reference: `ASIRA-${Date.now()}`,
          amount: Number(amount),
          currency: "USD",
        },
      ])
      .select()
      .single();

    if (paymentError) {
      setMessage(`❌ ${paymentError.message}`);
      console.log("Payment intent error:", paymentError);
      setLoading(false);
      return;
    }

    setSenderName("");
    setReceiverName("");
    setAmount("");
    setConvertedAmount(0);
    setDestinationCountry("");
    setLoading(false);

    if (paymentData) {
      router.push(`/checkout/${paymentData.id}`);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-4xl font-black text-emerald-400">
        Start Transfer
      </h1>

      <p className="text-white/50 mt-2">
        Create a new Asira Global Remit transaction.
      </p>

      <div className="mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <label className="block text-sm text-white/50 mb-2">
          Sender Name
        </label>

        <input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
        />

        <label className="block text-sm text-white/50 mb-2">
          Receiver Name
        </label>

        <input
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
        />

        <label className="block text-sm text-white/50 mb-2">
          Amount USD
        </label>

        <input
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="w-full mb-2 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
        />

        <p className="text-emerald-400 text-sm">
          Estimated PHP Payout: ₱
          {convertedAmount.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <p className="text-white/40 text-xs mb-5">
          Live Rate: 1 USD = ₱{usdRate.toFixed(2)}
        </p>

        <label className="block text-sm text-white/50 mb-2">
          Destination Country
        </label>

        <input
          value={destinationCountry}
          onChange={(e) => setDestinationCountry(e.target.value)}
          className="w-full mb-6 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-500 text-black font-bold py-4 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Create Transfer"}
        </button>

        {message && (
          <p className="mt-4 text-center text-white/70">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}