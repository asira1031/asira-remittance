"use client";

import Link from "next/link";

export default function ClientDashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black text-emerald-400">
              Merchant Gateway
            </h1>

            <p className="text-white/50 mt-2">
              Accept payments, create payment links, manage settlements, and monitor gateway transactions.
            </p>
          </div>

          <Link
            href="/client/payments"
            className="rounded-2xl bg-emerald-500 px-6 py-3 font-bold text-black"
          >
            Create Payment
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <Card label="Total Payments" value="0" color="text-blue-400" />
          <Card label="Total Volume" value="$0" color="text-emerald-400" />
          <Card label="Pending Settlement" value="$0" color="text-yellow-300" />
          <Card label="Gateway Status" value="READY" color="text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <Action
            href="/client/payments"
            title="Payment Links"
            desc="Create hosted checkout links for your customers."
          />

          <Action
            href="/client/transfers"
            title="Settlements"
            desc="Track merchant settlements and payout routing."
          />

          <Action
            href="/client/api-keys"
            title="API Keys"
            desc="Manage gateway keys and webhook configuration."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black mb-4">
              Merchant Integration
            </h2>

            <div className="space-y-4">
              <Info label="Gateway Mode" value="Sandbox / Demo Ready" />
              <Info label="Webhook URL" value="https://yourdomain.com/api/webhooks/merchant" />
              <Info label="Payment API" value="/api/merchant/payments/create" />
              <Info label="Settlement Rail" value="Multi-bank payout routing" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black mb-4">
              Recent Gateway Activity
            </h2>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
              No merchant payments yet.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-white/50 text-sm">{label}</p>
      <h2 className={`text-3xl font-black mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function Action({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-emerald-500 hover:text-black transition"
    >
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="text-sm mt-2 opacity-70">{desc}</p>
    </Link>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-white/40 text-xs">{label}</p>
      <p className="font-bold mt-1 break-words">{value}</p>
    </div>
  );
}