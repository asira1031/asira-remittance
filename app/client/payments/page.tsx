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
          Payment Links
        </h1>

        <p className="text-white/50 mt-2">
          Create hosted payment links for business customers using the Asira Gateway.
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

            <div>
              <label className="mb-2 block text-sm text-white/50">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              >
                <option value="PHP">PHP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="SGD">SGD</option>
                <option value="HKD">HKD</option>
                <option value="JPY">JPY</option>
              </select>
            </div>

            <Input label="Description" value={description} setValue={setDescription} />

            <div className="md:col-span-3">
              <button
                onClick={createPaymentLink}
                className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-black"
              >
                Create Payment Link
              </button>
            </div>
          </div>
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
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <Info label="Reference" value={link.reference} />
                  <Info label="Merchant" value={link.merchant_name} />
                  <Info label="Customer" value={link.customer_name} />
                  <Info
                    label="Amount"
                    value={`${link.currency} ${Number(link.amount).toLocaleString()}`}
                  />
                  <Info label="Status" value={link.status} />
                  <Info label="Created" value={new Date(link.created_at).toLocaleString()} />
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
