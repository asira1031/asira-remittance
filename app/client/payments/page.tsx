"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PaymentMethod = "BANK" | "CARD" | "INTERNATIONAL" | "CRYPTO";

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

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("BANK");

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
    const reference = `ASIRA-${Date.now()}`;
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
        status: "PENDING",
        payment_url: paymentUrl,
        payout_rail: selectedMethod,
        allow_bank: selectedMethod === "BANK",
        allow_card: selectedMethod === "CARD",
        allow_swift: selectedMethod === "INTERNATIONAL",
        allow_crypto: selectedMethod === "CRYPTO",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Hosted payment link created.");

    setMerchantName("");
    setCustomerName("");
    setCustomerEmail("");
    setAmount("");
    setCurrency("USD");
    setDescription("");
    setSelectedMethod("BANK");

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
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-black text-emerald-400">
          Merchant Dashboard
        </h1>

        <p className="mt-2 text-white/50">
          Create hosted checkout links for bank transfer, card payment,
          international settlement, and crypto checkout.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black">Create Payment</h2>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input label="Merchant Name" value={merchantName} setValue={setMerchantName} />
            <Input label="Customer Name" value={customerName} setValue={setCustomerName} />
            <Input label="Customer Email" value={customerEmail} setValue={setCustomerEmail} />
            <Input label="Amount" value={amount} setValue={setAmount} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm text-white/50">Currency</label>
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
              Allowed Payment Methods
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <MethodButton label="Bank" value="BANK" selected={selectedMethod} setSelected={setSelectedMethod} />
              <MethodButton label="Card" value="CARD" selected={selectedMethod} setSelected={setSelectedMethod} />
              <MethodButton label="International" value="INTERNATIONAL" selected={selectedMethod} setSelected={setSelectedMethod} />
              <MethodButton label="Crypto" value="CRYPTO" selected={selectedMethod} setSelected={setSelectedMethod} />
            </div>

            <div className="mt-8">
              {selectedMethod === "BANK" && <BankInfo />}
              {selectedMethod === "CARD" && <CardInfo />}
              {selectedMethod === "INTERNATIONAL" && <InternationalInfo />}
              {selectedMethod === "CRYPTO" && <CryptoInfo />}
            </div>
          </div>

          <button
            onClick={createPaymentLink}
            className="mt-10 w-full rounded-3xl bg-emerald-500 py-5 text-xl font-black text-black"
          >
            Generate Hosted Link
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black">Transfer Report History</h2>

          <div className="mt-8 space-y-5">
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
                Loading payment links...
              </div>
            )}

            {!loading &&
              links.map((link) => (
                <div key={link.id} className="rounded-3xl border border-white/10 bg-black/40 p-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                    <Info label="Reference" value={link.reference} />
                    <Info label="Merchant" value={link.merchant_name} />
                    <Info label="Amount" value={`${link.currency} ${link.amount}`} />
                    <Info label="Status" value={link.status} />
                  </div>

                  <div className="mt-5 break-all rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-white/60">
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

function BankInfo() {
  return (
    <InfoBox
      title="Bank Transfer Information"
      items={[
        "Client will fill bank name.",
        "Client will fill account name.",
        "Client will fill account number.",
        "Client will upload or confirm bank transfer proof.",
      ]}
    />
  );
}

function CardInfo() {
  return (
    <InfoBox
      title="Card Payment Information"
      items={[
        "Client will fill cardholder name.",
        "Client will fill card number.",
        "Client will fill expiry date.",
        "Client will fill CVV.",
        "This is for card checkout, not merchant description.",
      ]}
    />
  );
}

function InternationalInfo() {
  return (
    <InfoBox
      title="International Settlement Information"
      items={[
        "Client will fill receiver country.",
        "Client will fill SWIFT / BIC code.",
        "Client will fill IBAN if required.",
        "Client will fill beneficiary bank details.",
      ]}
    />
  );
}

function CryptoInfo() {
  return (
    <InfoBox
      title="Crypto Checkout Information"
      items={[
        "Client will see wallet address.",
        "Client will select network.",
        "Client will enter transaction hash.",
        "Client payment will be monitored for confirmation.",
      ]}
    />
  );
}

function InfoBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
      <h3 className="text-xl font-black text-emerald-300">{title}</h3>
      <ul className="mt-4 space-y-2 text-white/70">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function MethodButton({
  label,
  value,
  selected,
  setSelected,
}: {
  label: string;
  value: PaymentMethod;
  selected: PaymentMethod;
  setSelected: (value: PaymentMethod) => void;
}) {
  const active = selected === value;

  return (
    <button
      onClick={() => setSelected(value)}
      className={`rounded-2xl border p-5 font-black transition ${
        active
          ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-black/40 text-white/40"
      }`}
    >
      {label}
    </button>
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
      <label className="text-sm text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 break-words font-bold">{value || "N/A"}</p>
    </div>
  );
}