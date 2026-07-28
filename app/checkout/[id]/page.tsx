"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PaymentIntent = {
  id: number | null;
  transaction_id: number | null;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  transactions?: {
    amount: number;
    payment_method?: string;
  };
};

type Method = "qrph" | "nfc" | "softpos" | "card" | "bank" | "swift" | "crypto";

const methods: Array<{
  id: Method;
  name: string;
  description: string;
  icon: string;
  sandbox?: boolean;
}> = [
  { id: "qrph", name: "QR Ph", description: "Scan with your bank or e-wallet", icon: "▦", sandbox: true },
  { id: "nfc", name: "Tap to Pay", description: "Contactless card or mobile wallet", icon: ")))", sandbox: true },
  { id: "softpos", name: "SoftPOS", description: "Pay on a merchant device", icon: "◇", sandbox: true },
  { id: "card", name: "Card", description: "Visa or Mastercard", icon: "▭" },
  { id: "bank", name: "Bank transfer", description: "Local account transfer", icon: "⌂" },
  { id: "swift", name: "SWIFT", description: "International wire", icon: "↗" },
  { id: "crypto", name: "Digital assets", description: "USDT settlement", icon: "◈" },
];

const statusByMethod: Record<Method, string> = {
  qrph: "AWAITING_QRPH_PAYMENT",
  nfc: "AWAITING_NFC_AUTHORIZATION",
  softpos: "AWAITING_SOFTPOS_PAYMENT",
  card: "AWAITING_CARD_AUTHORIZATION",
  bank: "AWAITING_BANK_TRANSFER",
  swift: "AWAITING_SWIFT_TRANSFER",
  crypto: "AWAITING_CRYPTO_PAYMENT",
};

export default function CheckoutPage() {
  const params = useParams();
  const id = params.id as string;
  const [payment, setPayment] = useState<PaymentIntent | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [method, setMethod] = useState<Method>("qrph");

  const loadPayment = useCallback(async () => {
    setErrorMessage("");
    const isNumericId = /^\d+$/.test(id);
    const query = supabase.from("payment_intents").select("*");
    const { data: paymentData, error: paymentError } = isNumericId
      ? await query.eq("id", Number(id)).maybeSingle()
      : await query.eq("reference", id).maybeSingle();

    if (!paymentData || paymentError) {
      setPayment({
        id: null,
        transaction_id: null,
        reference: id,
        amount: 0,
        currency: "USD",
        status: "PENDING",
      });
      return;
    }

    let transactionData: PaymentIntent["transactions"];
    if (paymentData.transaction_id) {
      const { data } = await supabase
        .from("transactions")
        .select("amount, payment_method")
        .eq("id", paymentData.transaction_id)
        .maybeSingle();
      transactionData = data || undefined;
    }

    setPayment({ ...paymentData, transactions: transactionData });
    const rail = transactionData?.payment_method?.toLowerCase() as Method | undefined;
    if (rail && methods.some((item) => item.id === rail)) setMethod(rail);
  }, [id]);

  useEffect(() => {
    if (id) {
      const timer = window.setTimeout(() => void loadPayment(), 0);
      return () => window.clearTimeout(timer);
    }
  }, [id, loadPayment]);

  async function proceedPayment() {
    if (!payment) return;
    setLoading(true);
    setErrorMessage("");

    const nextStatus = statusByMethod[method];
    const intentResult = payment.id
      ? await supabase.from("payment_intents").update({ status: nextStatus }).eq("id", payment.id)
      : { error: null };

    if (intentResult.error) {
      setErrorMessage(intentResult.error.message);
      setLoading(false);
      return;
    }

    if (payment.transaction_id) {
      await supabase
        .from("transactions")
        .update({ status: "PROCESSING", payment_method: method.toUpperCase() })
        .eq("id", payment.transaction_id);
    }

    setPayment({ ...payment, status: nextStatus });
    setSubmitted(true);
    setLoading(false);
  }

  if (!payment) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <span className="mx-auto block h-8 w-8 animate-pulse rounded-xl bg-[#62e6a7]" />
          <p className="mt-4 text-sm text-white/45">Preparing secure checkout…</p>
        </div>
      </main>
    );
  }

  const displayAmount = Number(payment.amount || 0) > 0
    ? Number(payment.amount)
    : Number(payment.transactions?.amount || 0);
  const selected = methods.find((item) => item.id === method) ?? methods[0];
  const isCompleted = payment.status === "PAID" || payment.status === "COMPLETED";

  return (
    <main className="app-shell min-h-screen text-white">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#62e6a7] font-black text-[#07100d]">A</span>
            <span className="text-sm font-bold tracking-[0.17em]">ASIRA</span>
          </Link>
          <span className="flex items-center gap-2 text-xs font-medium text-white/40">
            <span className="h-2 w-2 rounded-full bg-[#62e6a7]" />
            Secure checkout
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_23rem] lg:py-12">
        <section>
          <div className="mb-8">
            <p className="eyebrow">Choose how to pay</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Complete your payment
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Select a payment method. Live confirmation only happens after
              verification by the connected payment provider.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {methods.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMethod(item.id);
                  setSubmitted(false);
                }}
                className={`relative rounded-2xl border p-5 text-left ${
                  method === item.id
                    ? "border-[#62e6a7]/55 bg-[#62e6a7]/[0.09] shadow-[0_0_0_3px_rgba(98,230,167,0.04)]"
                    : "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                }`}
              >
                {item.sandbox && (
                  <span className="absolute right-3 top-3 rounded-full border border-[#d7bb78]/20 bg-[#d7bb78]/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#d7bb78]">
                    Sandbox
                  </span>
                )}
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono ${
                  method === item.id ? "bg-[#62e6a7] text-[#07100d]" : "bg-white/[0.06] text-white/60"
                }`}>
                  {item.icon}
                </span>
                <p className="mt-5 font-semibold">{item.name}</p>
                <p className="mt-1 text-xs leading-5 text-white/38">{item.description}</p>
              </button>
            ))}
          </div>

          <div className="glass-panel mt-5 rounded-[1.5rem] p-5 sm:p-7">
            <PaymentMethodPanel method={method} reference={payment.reference} amount={displayAmount} currency={payment.currency || "USD"} />

            {errorMessage && (
              <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            {submitted && (
              <div className="mt-5 flex gap-3 rounded-xl border border-[#62e6a7]/20 bg-[#62e6a7]/10 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#62e6a7] text-sm font-black text-[#07100d]">✓</span>
                <div>
                  <p className="text-sm font-semibold text-[#8ef0c1]">Payment request created</p>
                  <p className="mt-1 text-xs leading-5 text-white/45">
                    Status is pending. It will only change to paid after provider verification.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={proceedPayment}
              disabled={loading || isCompleted}
              className="mt-6 w-full rounded-xl bg-[#62e6a7] px-6 py-4 font-bold text-[#07100d] shadow-[0_10px_35px_rgba(98,230,167,0.12)] hover:bg-[#79edb6] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isCompleted ? "Payment completed" : loading ? "Creating secure request…" : `Continue with ${selected.name}`}
            </button>
          </div>
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="premium-card rounded-[1.5rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/32">Payment summary</p>
            <div className="mt-6">
              <p className="text-sm text-white/42">Amount due</p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                {formatMoney(displayAmount, payment.currency || "USD")}
              </p>
            </div>
            <div className="my-6 h-px bg-white/[0.08]" />
            <SummaryRow label="Reference" value={payment.reference} mono />
            <SummaryRow label="Payment rail" value={selected.name} />
            <SummaryRow label="Status" value={prettyStatus(payment.status)} accent />
            <div className="mt-6 rounded-xl bg-black/25 p-4 text-xs leading-5 text-white/35">
              Your payment details are protected. ASIRA does not mark a payment
              successful until the provider confirms it.
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-5 text-[10px] font-semibold uppercase tracking-wider text-white/28">
            <span>Encrypted</span><span>•</span><span>Monitored</span><span>•</span><span>Verified</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PaymentMethodPanel({
  method,
  reference,
  amount,
  currency,
}: {
  method: Method;
  reference: string;
  amount: number;
  currency: string;
}) {
  if (method === "qrph") {
    return (
      <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:items-center">
        <DemoQr />
        <div>
          <PanelTitle title="Scan with QR Ph" label="Sandbox preview" />
          <p className="mt-3 text-sm leading-6 text-white/45">
            Open a participating bank or e-wallet, scan the code, then confirm
            the exact amount of {formatMoney(amount, currency)}.
          </p>
          <p className="mt-4 break-all font-mono text-xs text-[#62e6a7]">{reference}</p>
        </div>
      </div>
    );
  }

  if (method === "nfc" || method === "softpos") {
    const isNfc = method === "nfc";
    return (
      <div className="py-3 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#62e6a7]/25 bg-[#62e6a7]/10">
          <span className="text-3xl text-[#62e6a7]">{isNfc ? ")))" : "◇"}</span>
        </div>
        <PanelTitle title={isNfc ? "Tap card or phone" : "Ready for merchant tap"} label="Sandbox preview" centered />
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
          {isNfc
            ? "A live contactless session requires a certified NFC payment provider and a compatible device."
            : "SoftPOS turns a supported merchant Android device into a contactless terminal through a certified provider."}
        </p>
      </div>
    );
  }

  if (method === "card") {
    return (
      <div>
        <PanelTitle title="Card details" label="Secure authorization" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input aria-label="Cardholder name" placeholder="Cardholder name" className="input sm:col-span-2" autoComplete="cc-name" />
          <input aria-label="Card number" placeholder="Card number" className="input sm:col-span-2" inputMode="numeric" autoComplete="cc-number" />
          <input aria-label="Expiry date" placeholder="MM / YY" className="input" autoComplete="cc-exp" />
          <input aria-label="Security code" placeholder="CVC" className="input" inputMode="numeric" autoComplete="cc-csc" type="password" />
        </div>
        <p className="mt-4 text-xs text-[#d7bb78]">Demo form — do not enter real card details.</p>
      </div>
    );
  }

  if (method === "bank" || method === "swift") {
    return (
      <div>
        <PanelTitle title={method === "bank" ? "Bank transfer instructions" : "International wire instructions"} label="Manual verification" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label="Payment reference" value={reference} />
          <Detail label="Status after submission" value={method === "bank" ? "Awaiting bank transfer" : "Awaiting SWIFT transfer"} />
        </div>
        <p className="mt-4 text-sm leading-6 text-white/42">
          Your account details and final instructions will appear after the
          secure payment request is created.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PanelTitle title="Digital asset settlement" label="Manual verification" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <select aria-label="Digital asset" className="input"><option>USDT</option><option>USDC</option></select>
        <select aria-label="Network" className="input"><option>TRC20</option><option>ERC20</option><option>Polygon</option></select>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/42">
        The wallet address and exact network will be shown after the request is created.
      </p>
    </div>
  );
}

function DemoQr() {
  const cells = [
    0,1,2,3,4,6,8,9,10,11,12,14,16,18,20,22,24,26,28,30,32,34,36,38,
    40,41,42,43,44,46,48,49,50,51,52,54,56,57,58,59,60,62,64,67,69,71,
    72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,
    112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,
  ];
  return (
    <div className="mx-auto grid h-40 w-40 grid-cols-11 gap-[2px] rounded-2xl bg-white p-4" aria-label="QR Ph sandbox preview">
      {Array.from({ length: 121 }, (_, index) => (
        <span key={index} className={cells.includes(index) ? "rounded-[1px] bg-[#07100d]" : ""} />
      ))}
    </div>
  );
}

function PanelTitle({ title, label, centered = false }: { title: string; label: string; centered?: boolean }) {
  return (
    <div className={`${centered ? "mt-5 justify-center" : ""} flex flex-wrap items-center gap-3`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/35">{label}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
      <p className="mt-2 break-all text-sm font-semibold">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4 text-sm">
      <span className="text-white/38">{label}</span>
      <span className={`text-right ${mono ? "break-all font-mono text-xs" : "font-medium"} ${accent ? "text-[#d7bb78]" : "text-white/75"}`}>{value}</span>
    </div>
  );
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function prettyStatus(status: string) {
  return status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
