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
};

export default function ClientPaymentsPage() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [merchantName, setMerchantName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("PHP");
  const [description, setDescription] = useState("");

  const [receiverBankName, setReceiverBankName] = useState("");
  const [receiverAccountName, setReceiverAccountName] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("");
  const [receiverCurrency, setReceiverCurrency] = useState("PHP");
  const [payoutRail, setPayoutRail] = useState("BANK");
  const [swiftCode, setSwiftCode] = useState("");
  const [iban, setIban] = useState("");

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
    const reference = `ASIRA-PAY-${Date.now()}`;
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
          status: "ACTIVE",
          payment_url: paymentUrl,

          receiver_bank_name: receiverBankName,
          receiver_account_name: receiverAccountName,
          receiver_account_number: receiverAccountNumber,
          receiver_country: receiverCountry,
          receiver_currency: receiverCurrency,
          payout_rail: payoutRail,
          swift_code: swiftCode,
          iban,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setMerchantName("");
    setCustomerName("");
    setCustomerEmail("");
    setAmount("");
    setCurrency("PHP");
    setDescription("");

    setReceiverBankName("");
    setReceiverAccountName("");
    setReceiverAccountNumber("");
    setReceiverCountry("");
    setReceiverCurrency("PHP");
    setPayoutRail("BANK");
    setSwiftCode("");
    setIban("");

    await loadLinks();
  }

  async function cancelLink(id: number) {
    await supabase
      .from("merchant_payment_links")
      .update({ status: "CANCELLED" })
      .eq("id", id);

    await loadLinks();
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    alert("Payment link copied!");
  }

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Merchant Gateway
        </h1>

        <p className="text-white/50 mt-2">
          Create hosted payment links and define settlement destinations.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-5">
            Create Payment Link
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Merchant Name" value={merchantName} setValue={setMerchantName} />
            <Input label="Customer Name" value={customerName} setValue={setCustomerName} />
            <Input label="Customer Email" value={customerEmail} setValue={setCustomerEmail} />
            <Input label="Amount" value={amount} setValue={setAmount} />
            <Input label="Description" value={description} setValue={setDescription} />

            <div>
              <label className="mb-2 block text-sm text-white/50">
                Currency
              </label>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              >
                <option>PHP</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>SGD</option>
              </select>
            </div>
          </div>

          <h2 className="text-2xl font-black mt-10 mb-5">
            Settlement Destination
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <Input
              label="Receiver Currency"
              value={receiverCurrency}
              setValue={setReceiverCurrency}
            />

            <div>
              <label className="mb-2 block text-sm text-white/50">
                Payout Rail
              </label>

              <select
                value={payoutRail}
                onChange={(e) => setPayoutRail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              >
                <option value="BANK">BANK</option>
                <option value="CARD">CARD</option>
                <option value="SWIFT">SWIFT</option>
              </select>
            </div>

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

          <button
            onClick={createPaymentLink}
            className="w-full mt-8 rounded-2xl bg-emerald-500 py-4 font-black text-black"
          >
            Create Payment Link
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-5">
            Created Payment Links
          </h2>

          <div className="space-y-4">
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
                Loading payment links...
              </div>
            )}

            {!loading && links.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
                No payment links created yet.
              </div>
            )}

            {links.map((link) => (
              <div
                key={link.id}
                className="rounded-2xl border border-white/10 bg-black/40 p-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Info label="Reference" value={link.reference} />
                  <Info label="Merchant" value={link.merchant_name} />
                  <Info label="Customer" value={link.customer_name} />
                  <Info
                    label="Amount"
                    value={`${link.currency} ${Number(link.amount).toLocaleString()}`}
                  />
                  <Info label="Receiver Bank" value={link.receiver_bank_name} />
                  <Info label="Payout Rail" value={link.payout_rail} />
                  <Info label="Status" value={link.status} />
                  <Info label="SWIFT" value={link.swift_code} />
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-white/60 break-all">
                  {link.payment_url}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => copyLink(link.payment_url)}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-black"
                  >
                    Copy Link
                  </button>

                  <button
                    onClick={() => cancelLink(link.id)}
                    className="rounded-xl bg-red-500 px-4 py-2 text-xs font-black text-white"
                  >
                    Cancel
                  </button>
                </div>
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
      <label className="mb-2 block text-sm text-white/50">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="font-bold break-words">{value || "N/A"}</p>
    </div>
  );
}