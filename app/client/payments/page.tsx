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

export default function MerchantGatewayPage() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [merchantName, setMerchantName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");

  const [receiverBankName, setReceiverBankName] = useState("");
  const [receiverAccountName, setReceiverAccountName] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("");
  const [receiverCurrency, setReceiverCurrency] = useState("USD");

  const [payoutRail, setPayoutRail] = useState("BANK");
  const [swiftCode, setSwiftCode] = useState("");
  const [iban, setIban] = useState("");

  const [allowBank, setAllowBank] = useState(true);
  const [allowCard, setAllowCard] = useState(true);
  const [allowSwift, setAllowSwift] = useState(true);
  const [allowCrypto, setAllowCrypto] = useState(false);

  async function loadLinks() {
    setLoading(true);

    const { data, error } = await supabase
      .from("merchant_payment_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLinks(data);
    }

    setLoading(false);
  }

  async function createPaymentLink() {
    const reference = `ASIRA-${Date.now()}`;
    const paymentUrl = `${window.location.origin}/pay/${reference}`;

    const { error } = await supabase
      .from("merchant_payment_links")
      .insert([
        {
          reference,
          merchant_name: merchantName,
          customer_name: customerName,
          customer_email: customerEmail,
          amount: Number(amount || 0),
          currency,
          description,
          status: "PENDING",
          payment_url: paymentUrl,

          receiver_bank_name: receiverBankName,
          receiver_account_name: receiverAccountName,
          receiver_account_number: receiverAccountNumber,
          receiver_country: receiverCountry,
          receiver_currency: receiverCurrency,
          payout_rail: payoutRail,
          swift_code: swiftCode,
          iban,

          allow_bank: allowBank,
          allow_card: allowCard,
          allow_swift: allowSwift,
          allow_crypto: allowCrypto,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Payment link created successfully.");

    setMerchantName("");
    setCustomerName("");
    setCustomerEmail("");
    setAmount("");
    setCurrency("USD");
    setDescription("");

    await loadLinks();
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    alert("Payment link copied.");
  }

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-black text-emerald-400">
          Merchant Gateway
        </h1>

        <p className="mt-2 text-white/50">
          Create hosted checkout links with multi-rail settlement routing.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black">
            Create Merchant Payment Link
          </h2>

          <div className="mt-8">
            <label className="text-sm text-white/50">
              Payment Type
            </label>

            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            >
              <option>Merchant Payment</option>
              <option>International Settlement</option>
              <option>Invoice Collection</option>
              <option>Gateway Checkout</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <Input label="Merchant Name" value={merchantName} setValue={setMerchantName} />
            <Input label="Customer Name" value={customerName} setValue={setCustomerName} />
            <Input label="Customer Email" value={customerEmail} setValue={setCustomerEmail} />
            <Input label="Amount" value={amount} setValue={setAmount} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="text-sm text-white/50">
                Currency
              </label>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
              >
                <option>USD</option>
                <option>PHP</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>SGD</option>
              </select>
            </div>

            <Input label="Description" value={description} setValue={setDescription} />
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-2xl font-black text-emerald-400">
              Settlement Destination
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <Input
                label="Receiver Bank Name"
                value={receiverBankName}
                setValue={setReceiverBankName}
              />

              <Input
                label="Receiver Account Name"
                value={receiverAccountName}
                setValue={setReceiverAccountName}
              />

              <Input
                label="Receiver Account Number"
                value={receiverAccountNumber}
                setValue={setReceiverAccountNumber}
              />

              <Input
                label="Receiver Country"
                value={receiverCountry}
                setValue={setReceiverCountry}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <Input
                label="Receiver Currency"
                value={receiverCurrency}
                setValue={setReceiverCurrency}
              />

              <div>
                <label className="text-sm text-white/50">
                  Payout Rail
                </label>

                <select
                  value={payoutRail}
                  onChange={(e) => setPayoutRail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
                >
                  <option value="BANK">BANK</option>
                  <option value="SWIFT">SWIFT</option>
                  <option value="CARD">CARD</option>
                  <option value="CRYPTO">CRYPTO</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <Input
                label="SWIFT Code"
                value={swiftCode}
                setValue={setSwiftCode}
              />

              <Input
                label="IBAN"
                value={iban}
                setValue={setIban}
              />
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-2xl font-black text-emerald-400">
              Allowed Payment Methods
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Toggle
                label="Bank"
                enabled={allowBank}
                setEnabled={setAllowBank}
              />

              <Toggle
                label="Card"
                enabled={allowCard}
                setEnabled={setAllowCard}
              />

              <Toggle
                label="SWIFT"
                enabled={allowSwift}
                setEnabled={setAllowSwift}
              />

              <Toggle
                label="Crypto"
                enabled={allowCrypto}
                setEnabled={setAllowCrypto}
              />
            </div>
          </div>

          <button
            onClick={createPaymentLink}
            className="mt-10 w-full rounded-3xl bg-emerald-500 py-5 text-xl font-black text-black"
          >
            Create Hosted Payment Link
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black">
            Generated Payment Links
          </h2>

          <div className="space-y-5 mt-8">
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
                Loading payment links...
              </div>
            )}

            {!loading &&
              links.map((link) => (
                <div
                  key={link.id}
                  className="rounded-3xl border border-white/10 bg-black/40 p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <Info label="Reference" value={link.reference} />
                    <Info label="Merchant" value={link.merchant_name} />
                    <Info label="Amount" value={`${link.currency} ${link.amount}`} />
                    <Info label="Status" value={link.status} />
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4 text-sm break-all text-white/60">
                    {link.payment_url}
                  </div>

                  <button
                    onClick={() => copyLink(link.payment_url)}
                    className="mt-5 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-black"
                  >
                    Copy Payment Link
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-white/50">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
      />
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-white/40">
        {label}
      </p>

      <p className="mt-1 break-words font-bold">
        {value || "N/A"}
      </p>
    </div>
  );
}

function Toggle({
  label,
  enabled,
  setEnabled,
}: {
  label: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`rounded-2xl border p-5 font-black transition ${
        enabled
          ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-black/40 text-white/40"
      }`}
    >
      {label}
    </button>
  );
}