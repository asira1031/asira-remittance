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
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [transferType, setTransferType] =
  useState("LOCAL");
  const [receiveCurrency, setReceiveCurrency] = useState("PHP");

  const [receiverBankName, setReceiverBankName] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const [purposeOfTransfer, setPurposeOfTransfer] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fee = Number(amount || 0) * 0.005;
  const totalToPay = Number(amount || 0) + fee;

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
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/remit/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_name: senderName,
          receiver_name: receiverName,
          amount: Number(amount),
          destination_country: destinationCountry,
          payment_method: paymentMethod,
          receive_currency: receiveCurrency,
          receiver_bank_name: receiverBankName,
          receiver_account_number: receiverAccountNumber,
          swift_code: swiftCode,
          purpose_of_transfer: purposeOfTransfer,
          source_of_funds: sourceOfFunds,
        }),
      });

      const result = await response.json();

      console.log(result);

      const { data: paymentData, error: paymentError } = await supabase
        .from("payment_intents")
        .insert([
          {
            transaction_id: Date.now(),
            reference: `ASIRA-${Date.now()}`,
            amount: totalToPay,
            currency: "USD",
          },
        ])
        .select()
        .single();

      if (paymentError) {
        setMessage(`❌ ${paymentError.message}`);
        console.log("Payment intent error:", paymentError);
        return;
      }

      setSenderName("");
      setReceiverName("");
      setAmount("");
      setConvertedAmount(0);
      setDestinationCountry("");
      setPaymentMethod("BANK");
      setReceiveCurrency("PHP");
      setReceiverBankName("");
      setReceiverAccountNumber("");
      setSwiftCode("");
      setPurposeOfTransfer("");
      setSourceOfFunds("");

      if (paymentData) {
        router.push(`/checkout/${paymentData.id}`);
      }

      if (result.success) {
        setMessage("✅ International Remittance Created Successfully");
      } else {
        setMessage("❌ Failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Server Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-4xl font-black text-emerald-400">
        International Transfer
      </h1>

      <p className="text-white/50 mt-2">
        Create a new Asira Global Remit international transaction.
      </p>
      <div className="mt-6 mb-6">
  <label className="block text-sm text-white/50 mb-2">
    Transfer Type
  </label>

  <select
    value={transferType}
    onChange={(e) =>
      setTransferType(e.target.value)
    }
    className="w-full max-w-sm rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
  >
    <option value="LOCAL">
      Local Transfer
    </option>

    <option value="INTERNATIONAL">
      International Transfer
    </option>
  </select>
</div>

      <div className="mt-10 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
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

        <div className="mb-5 rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-emerald-400 text-sm">
            Estimated PHP Payout: ₱
            {convertedAmount.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-white/40 text-xs">
            Live Rate: 1 USD = ₱{usdRate.toFixed(2)}
          </p>

          <p className="text-white/50 text-sm mt-3">
            Transfer Fee 0.5%: ${fee.toFixed(2)}
          </p>

          <p className="text-white font-bold">
            Total To Pay: ${totalToPay.toFixed(2)}
          </p>
        </div>

        <label className="block text-sm text-white/50 mb-2">
          Destination Country
        </label>
        <input
          value={destinationCountry}
          onChange={(e) => setDestinationCountry(e.target.value)}
          className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
        />

      {transferType === "INTERNATIONAL" && (
  <>
    <label className="block text-sm text-white/50 mb-2">
      Receive Currency
    </label>

    <select
      value={receiveCurrency}
      onChange={(e) => setReceiveCurrency(e.target.value)}
      className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
    >
      <option value="PHP">PHP - Philippine Peso</option>
      <option value="USD">USD - US Dollar</option>
      <option value="EUR">EUR - Euro</option>
      <option value="GBP">GBP - British Pound</option>
      <option value="HKD">HKD - Hong Kong Dollar</option>
      <option value="SGD">SGD - Singapore Dollar</option>
      <option value="JPY">JPY - Japanese Yen</option>
    </select>

    <label className="block text-sm text-white/50 mb-2">
      Receiver Bank Name
    </label>

    <input
      value={receiverBankName}
      onChange={(e) => setReceiverBankName(e.target.value)}
      className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
    />

    <label className="block text-sm text-white/50 mb-2">
      Receiver Account Number / IBAN
    </label>

    <input
      value={receiverAccountNumber}
      onChange={(e) =>
        setReceiverAccountNumber(e.target.value)
      }
      className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
    />

    <label className="block text-sm text-white/50 mb-2">
      SWIFT / BIC Code
    </label>

    <input
      value={swiftCode}
      onChange={(e) =>
        setSwiftCode(
          e.target.value.toUpperCase()
        )
      }
      className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
    />

    <label className="block text-sm text-white/50 mb-2">
      Purpose of Transfer
    </label>

    <select
      value={purposeOfTransfer}
      onChange={(e) =>
        setPurposeOfTransfer(e.target.value)
      }
      className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
    >
      <option value="">Select Purpose</option>

      <option value="FAMILY_SUPPORT">
        Family Support
      </option>

      <option value="SALARY">
        Salary
      </option>

      <option value="BUSINESS_PAYMENT">
        Business Payment
      </option>

      <option value="EDUCATION">
        Education
      </option>

      <option value="MEDICAL">
        Medical
      </option>

      <option value="OTHER">
        Other
      </option>
    </select>

    <label className="block text-sm text-white/50 mb-2">
      Source of Funds
    </label>

    <select
      value={sourceOfFunds}
      onChange={(e) =>
        setSourceOfFunds(e.target.value)
      }
      className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
    >
      <option value="">Select Source</option>

      <option value="SALARY">
        Salary
      </option>

      <option value="BUSINESS_INCOME">
        Business Income
      </option>

      <option value="SAVINGS">
        Savings
      </option>

      <option value="INVESTMENT">
        Investment
      </option>

      <option value="OTHER">
        Other
      </option>
    </select>
  </>
)}

<label className="block text-sm text-white/50 mb-2">
  Payment Method
</label>

<select
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
  className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
>
        
          <option value="BANK">Bank Transfer</option>
          <option value="CARD">Card Payment</option>
          <option value="SWIFT">SWIFT Transfer</option>
        </select>

        <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-4">
          {paymentMethod === "BANK" && (
            <p className="text-emerald-400 text-sm">
              Bank payout routing selected.
            </p>
          )}

          {paymentMethod === "CARD" && (
            <p className="text-blue-400 text-sm">
              Card payment selected. Gateway integration ready for Visa /
              Mastercard settlement.
            </p>
          )}

          {paymentMethod === "SWIFT" && (
            <p className="text-yellow-400 text-sm">
              SWIFT international transfer selected.
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-500 text-black font-bold py-4 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Create International Transfer"}
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