"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PaymentLink = {
  id: number;
  reference: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  status: string;
  payment_url: string;
  created_at: string;
};

const currencies = ["USD", "PHP", "EUR", "GBP", "SGD", "AUD", "CAD", "JPY"];

export default function MerchantPaymentsPage() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");

  const loadLinks = useCallback(async () => {
    setLoading(true);
    const storedName = localStorage.getItem("merchant_name") || "";
    setMerchantName(storedName);

    const { data } = await supabase
      .from("merchant_payment_links")
      .select("id, reference, customer_name, customer_email, amount, currency, status, payment_url, created_at")
      .eq("merchant_name", storedName)
      .order("created_at", { ascending: false });

    setLinks((data as PaymentLink[] | null) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadLinks(), 0);
    return () => window.clearTimeout(timer);
  }, [loadLinks]);

  async function createPaymentLink() {
    setMessage("");
    const numericAmount = Number(amount);
    if (!merchantName || !customerName || !customerEmail || !numericAmount || numericAmount <= 0) {
      setMessage("Please complete the customer name, email, and a valid amount.");
      return;
    }

    setCreating(true);
    const reference = `ASIRA-CARD-${Date.now()}`;
    const paymentUrl = `${window.location.origin}/pay/${reference}`;
    const { error } = await supabase.from("merchant_payment_links").insert([
      {
        reference,
        merchant_name: merchantName,
        customer_name: customerName,
        customer_email: customerEmail,
        amount: numericAmount,
        currency,
        description: description || "International credit/debit card payment",
        status: "PENDING",
        payment_url: paymentUrl,
        payout_rail: "CARD",
        allow_bank: false,
        allow_card: true,
        allow_swift: false,
        allow_crypto: false,
      },
    ]);

    setCreating(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("International credit/debit card payment link created.");
    setCustomerName("");
    setCustomerEmail("");
    setAmount("");
    setDescription("");
    await loadLinks();
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("Payment link copied.");
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">International card acceptance</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Generate a payment link
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-white/45">
          Create a hosted checkout link that your international customer can
          open to pay using a credit or debit card.
        </p>

        <section className="glass-panel mt-8 rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Payment details</h2>
              <p className="mt-1 text-sm text-white/40">Cards are provider-authorized before any payment becomes successful.</p>
            </div>
            <span className="rounded-full border border-[#d7bb78]/20 bg-[#d7bb78]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d7bb78]">
              Credit &amp; debit card
            </span>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field label="Merchant" value={merchantName} readOnly />
            <Field label="Customer name" value={customerName} onChange={setCustomerName} />
            <Field label="Customer email" value={customerEmail} onChange={setCustomerEmail} type="email" />
            <div>
              <label className="text-sm text-white/50">Currency</label>
              <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="input mt-2">
                {currencies.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <Field label="Amount" value={amount} onChange={setAmount} type="number" />
            <Field label="Payment description" value={description} onChange={setDescription} />
          </div>

          {message && (
            <div className="mt-6 rounded-xl border border-[#62e6a7]/20 bg-[#62e6a7]/10 p-4 text-sm text-[#a7f2cf]">
              {message}
            </div>
          )}

          <button
            onClick={createPaymentLink}
            disabled={creating}
            className="mt-7 w-full rounded-xl bg-[#62e6a7] px-6 py-4 font-bold text-[#07100d] hover:bg-[#79edb6] disabled:opacity-50"
          >
            {creating ? "Creating secure link…" : "Generate international card payment link"}
          </button>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Hosted checkouts</p>
              <h2 className="mt-3 text-2xl font-semibold">Recent payment links</h2>
            </div>
            <span className="text-sm text-white/35">{links.length} links</span>
          </div>

          <div className="mt-5 space-y-3">
            {loading && <div className="premium-card rounded-2xl p-6 text-sm text-white/40">Loading payment links…</div>}
            {!loading && links.length === 0 && (
              <div className="premium-card rounded-2xl p-8 text-center text-sm text-white/40">
                No payment links yet. Create your first international card link above.
              </div>
            )}
            {links.map((link) => (
              <article key={link.id} className="premium-card rounded-2xl p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-mono text-xs text-[#62e6a7]">{link.reference}</p>
                      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/45">{link.status}</span>
                    </div>
                    <p className="mt-3 font-semibold">{link.customer_name}</p>
                    <p className="mt-1 text-sm text-white/38">{link.customer_email}</p>
                    <p className="mt-3 break-all text-xs text-white/28">{link.payment_url}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-2xl font-semibold">{link.currency} {Number(link.amount).toLocaleString()}</p>
                    <button onClick={() => copyLink(link.payment_url)} className="mt-3 rounded-xl border border-[#62e6a7]/25 bg-[#62e6a7]/10 px-4 py-2.5 text-sm font-semibold text-[#8ef0c1]">
                      Copy link
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-white/50">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        onChange={(event) => onChange?.(event.target.value)}
        className="input mt-2 read-only:text-white/45"
      />
    </div>
  );
}
