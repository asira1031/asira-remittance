"use client";

import Link from "next/link";

export default function ClientDashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-emerald-400 font-black text-sm tracking-widest">
              ASIRA BUSINESS PORTAL
            </p>

            <h1 className="text-5xl font-black text-white mt-2">
              Merchant Gateway
            </h1>

            <p className="text-white/50 mt-3 max-w-2xl">
              Create hosted payment links, collect customer payments, choose
              settlement routes, and monitor gateway transactions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/client/payments"
              className="rounded-2xl bg-emerald-500 px-6 py-3 font-black text-black"
            >
              Create Payment Link
            </Link>

            <Link
              href="/remit"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-black text-white"
            >
              Start Transfer
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <Card label="Payment Links" value="READY" color="text-emerald-400" />
          <Card label="Gateway Mode" value="DEMO" color="text-blue-400" />
          <Card label="Settlement" value="MULTI-RAIL" color="text-yellow-300" />
          <Card label="Merchant Status" value="ACTIVE" color="text-purple-300" />
        </div>

        <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-3xl font-black text-emerald-400">
                Merchant Payment Link System
              </h2>

              <p className="text-white/60 mt-2">
                Business clients can create a payment link, define receiver bank
                settlement details, and send the hosted checkout link to their customers.
              </p>
            </div>

            <Link
              href="/client/payments"
              className="rounded-2xl bg-emerald-500 px-6 py-4 font-black text-black text-center"
            >
              Open Merchant Gateway
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <Action
            href="/client/payments"
            title="Merchant Gateway"
            desc="Create hosted checkout links with Bank, Card, SWIFT, and Crypto payment options."
          />

          <Action
            href="/client/transfers"
            title="Settlements"
            desc="Track merchant settlements, payout status, and routing operations."
          />

          <Action
            href="/client/api-keys"
            title="API & Webhooks"
            desc="Manage gateway API access, webhook URLs, and integration settings."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black mb-4">
              Gateway Flow
            </h2>

            <div className="space-y-4">
              <Info label="Step 1" value="Merchant creates payment link" />
              <Info label="Step 2" value="Merchant adds receiver bank / SWIFT / settlement details" />
              <Info label="Step 3" value="Customer opens hosted checkout link" />
              <Info label="Step 4" value="Customer chooses Bank, Card, SWIFT, or Crypto" />
              <Info label="Step 5" value="Admin monitors payment and payout status" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black mb-4">
              Merchant Integration
            </h2>

            <div className="space-y-4">
              <Info label="Gateway Mode" value="Sandbox / Demo Ready" />
              <Info label="Payment Link Creator" value="/client/payments" />
              <Info label="Hosted Checkout" value="/pay/[reference]" />
              <Info label="Settlement Rail" value="Bank / Card / SWIFT / Crypto" />
              <Info label="Backend Storage" value="merchant_payment_links" />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">
            Recent Gateway Activity
          </h2>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
            Open Merchant Gateway to create and monitor payment links.
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
      <h2 className={`text-2xl font-black mt-2 ${color}`}>
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