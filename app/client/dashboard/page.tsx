"use client";

import { useEffect, useState } from "react";
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
  payout_rail: string;
};

export default function MerchantPaymentWizardPage() {
  const [step, setStep] = useState(1);
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [merchantName, setMerchantName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("PHP");
  const [description, setDescription] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  const [receiverBankName, setReceiverBankName] = useState("");
  const [receiverAccountName, setReceiverAccountName] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("Philippines");
  const [receiverCurrency, setReceiverCurrency] = useState("PHP");
  const [swiftCode, setSwiftCode] = useState("");
  const [iban, setIban] = useState("");

  async function loadLinks() {
    setLoading(true);

    const { data, error } = await supabase
      .from("merchant_payment_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setLinks(data);

    setLoading(false);
  }

  async function createPaymentLink() {
    const reference = `ASIRA-PAY-${Date.now()}`;
    const paymentUrl = `${window.location.origin}/pay/${reference}`;

    const { error } = await supabase.from("merchant_payment_links").insert([
      {
        reference,
        merchant_name: merchantName,
        customer_name: customerName,
        customer_email: customerEmail,
        amount: Number(amount || 0),
        currency,
        description,
        status: "ACTIVE",
        payment_url: paymentUrl,

        receiver_bank_name: receiverBankName,
        receiver_account_name: receiverAccountName,
        receiver_account_number: receiverAccountNumber,
        receiver_country: receiverCountry,
        receiver_currency: receiverCurrency,
        payout_rail: paymentMethod,
        swift_code: swiftCode,
        iban,

        allow_bank: paymentMethod === "BANK",
        allow_card: paymentMethod === "CARD",
        allow_swift: paymentMethod === "SWIFT",
        allow_crypto: paymentMethod === "CRYPTO",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    await loadLinks();
    setStep(5);
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    alert("Payment link copied!");
  }

  useEffect(() => {
    loadLinks();
  }, []);

  const latestLink = links[0];

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-emerald-400">
          Create Merchant Payment
        </h1>

        <p className="text-white/50 mt-2">
          Step-by-step gateway setup for payment links and settlement routing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-8">
          {["Payment", "Method", "Details", "Generate", "Monitor"].map(
            (label, index) => (
              <button
                key={label}
                onClick={() => setStep(index + 1)}
                className={`rounded-2xl border px-4 py-3 font-black ${
                  step === index + 1
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white/50"
                }`}
              >
                {index + 1}. {label}
              </button>
            )
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          {step === 1 && (
            <>
              <h2 className="text-3xl font-black">Step 1 — Create Payment</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                <Input label="Merchant Name" value={merchantName} setValue={setMerchantName} />
                <Input label="Customer Name" value={customerName} setValue={setCustomerName} />
                <Input label="Customer Email" value={customerEmail} setValue={setCustomerEmail} />
                <Input label="Amount" value={amount} setValue={setAmount} />

                <Select
                  label="Currency"
                  value={currency}
                  setValue={setCurrency}
                  options={["PHP", "USD", "EUR", "GBP", "SGD", "HKD", "JPY"]}
                />

                <Input label="Description" value={description} setValue={setDescription} />
              </div>

              <NextButton onClick={() => setStep(2)} />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-3xl font-black">
                Step 2 — Choose Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
                <MethodCard
                  title="Bank"
                  desc="Local bank transfer"
                  active={paymentMethod === "BANK"}
                  onClick={() => setPaymentMethod("BANK")}
                />

                <MethodCard
                  title="Card"
                  desc="Card gateway payment"
                  active={paymentMethod === "CARD"}
                  onClick={() => setPaymentMethod("CARD")}
                />

                <MethodCard
                  title="SWIFT"
                  desc="International wire"
                  active={paymentMethod === "SWIFT"}
                  onClick={() => setPaymentMethod("SWIFT")}
                />

                <MethodCard
                  title="Crypto"
                  desc="USDT settlement later"
                  active={paymentMethod === "CRYPTO"}
                  onClick={() => setPaymentMethod("CRYPTO")}
                />
              </div>

              <NextButton onClick={() => setStep(3)} />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-3xl font-black">
                Step 3 — Method Details
              </h2>

              {!paymentMethod && (
                <p className="text-red-400 mt-5">
                  Please choose a payment method first.
                </p>
              )}

              {paymentMethod === "BANK" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                  <Input label="Receiver Bank Name" value={receiverBankName} setValue={setReceiverBankName} />
                  <Input label="Receiver Account Name" value={receiverAccountName} setValue={setReceiverAccountName} />
                  <Input label="Receiver Account Number" value={receiverAccountNumber} setValue={setReceiverAccountNumber} />
                  <Input label="Receiver Country" value={receiverCountry} setValue={setReceiverCountry} />
                  <Input label="Receiver Currency" value={receiverCurrency} setValue={setReceiverCurrency} />
                </div>
              )}

              {paymentMethod === "CARD" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                  <Input label="Settlement Bank Name" value={receiverBankName} setValue={setReceiverBankName} />
                  <Input label="Settlement Account Name" value={receiverAccountName} setValue={setReceiverAccountName} />
                  <Input label="Settlement Account Number" value={receiverAccountNumber} setValue={setReceiverAccountNumber} />
                  <Input label="Settlement Country" value={receiverCountry} setValue={setReceiverCountry} />
                  <Input label="Settlement Currency" value={receiverCurrency} setValue={setReceiverCurrency} />
                </div>
              )}

              {paymentMethod === "SWIFT" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                  <Input label="Receiver Bank Name" value={receiverBankName} setValue={setReceiverBankName} />
                  <Input label="Receiver Account Name" value={receiverAccountName} setValue={setReceiverAccountName} />
                  <Input label="Receiver Account Number" value={receiverAccountNumber} setValue={setReceiverAccountNumber} />
                  <Input label="Receiver Country" value={receiverCountry} setValue={setReceiverCountry} />
                  <Input label="Receiver Currency" value={receiverCurrency} setValue={setReceiverCurrency} />
                  <Input label="SWIFT / BIC Code" value={swiftCode} setValue={setSwiftCode} />
                  <Input label="IBAN" value={iban} setValue={setIban} />
                </div>
              )}

              {paymentMethod === "CRYPTO" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                  <Input label="Receiver Wallet / Settlement ID" value={receiverAccountNumber} setValue={setReceiverAccountNumber} />
                  <Input label="Network" value={receiverBankName} setValue={setReceiverBankName} />
                  <Input label="Settlement Currency" value={receiverCurrency} setValue={setReceiverCurrency} />
                </div>
              )}

              <NextButton onClick={() => setStep(4)} />
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-3xl font-black">
                Step 4 — Generate Hosted Link
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                <Info label="Merchant" value={merchantName} />
                <Info label="Customer" value={customerName} />
                <Info label="Amount" value={`${currency} ${amount}`} />
                <Info label="Method" value={paymentMethod} />
                <Info label="Receiver Bank" value={receiverBankName} />
                <Info label="Receiver Account" value={receiverAccountNumber} />
              </div>

              <button
                onClick={createPaymentLink}
                className="w-full mt-8 rounded-3xl bg-emerald-500 py-5 text-xl font-black text-black"
              >
                Generate Payment Link
              </button>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-3xl font-black">
                Step 5 — Monitor Payment Link
              </h2>

              {loading && (
                <p className="text-white/40 mt-6">Loading links...</p>
              )}

              {!loading && !latestLink && (
                <p className="text-white/40 mt-6">
                  No payment links yet.
                </p>
              )}

              {latestLink && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <Info label="Reference" value={latestLink.reference} />
                    <Info label="Merchant" value={latestLink.merchant_name} />
                    <Info label="Amount" value={`${latestLink.currency} ${latestLink.amount}`} />
                    <Info label="Status" value={latestLink.status} />
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4 text-sm break-all text-white/60">
                    {latestLink.payment_url}
                  </div>

                  <button
                    onClick={() => copyLink(latestLink.payment_url)}
                    className="mt-5 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-black"
                  >
                    Copy Payment Link
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <div>
      <label className="text-sm text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
      />
    </div>
  );
}

function Select({ label, value, setValue, options }: any) {
  return (
    <div>
      <label className="text-sm text-white/50">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
      >
        {options.map((option: string) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function MethodCard({ title, desc, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-3xl border p-6 text-left ${
        active
          ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-black/40 text-white"
      }`}
    >
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="text-sm opacity-70 mt-2">{desc}</p>
    </button>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="font-bold mt-1 break-words">{value || "N/A"}</p>
    </div>
  );
}

function NextButton({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-8 rounded-2xl bg-emerald-500 py-4 font-black text-black"
    >
      Continue
    </button>
  );
}