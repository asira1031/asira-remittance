"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-black text-emerald-400">
            ASIRA
          </h1>

          <div className="flex items-center gap-8 text-sm font-medium text-white">
            <Link href="/" className="hover:text-emerald-400 transition">
              Home
            </Link>

            <Link href="/remit" className="hover:text-emerald-400 transition">
              Services
            </Link>

            <Link href="/admin/merchant" className="hover:text-emerald-400 transition">
              Merchant Portal
            </Link>

            <Link href="/admin/reports" className="hover:text-emerald-400 transition">
              Reports
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-emerald-400 text-sm">
            Global Digital Remittance
          </div>

          <h1 className="mt-10 text-7xl font-black leading-tight">
            ASIRA
            <br />
            <span className="text-emerald-400">GLOBAL REMIT</span>
          </h1>

          <p className="mt-10 text-xl leading-10 text-white/70 max-w-2xl">
            Fast international remittance platform with crypto-powered liquidity,
            secure payouts, partner integrations, and real-time transaction processing.
          </p>

          <div className="flex gap-4 mt-10">
            <Link
              href="/remit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-black hover:opacity-90 transition"
            >
              Start Transfer
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-8 py-4 font-bold text-white hover:border-emerald-400 hover:text-emerald-400 transition"
            >
              Admin Portal
            </Link>
          </div>
        </div>

        <div className="rounded-[40px] border border-emerald-500/20 bg-white/[0.03] p-8 shadow-2xl shadow-emerald-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/40 text-sm">Available Liquidity</p>
              <h2 className="text-6xl font-black mt-2">$12.8M</h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-2xl">
              A
            </div>
          </div>

          <div className="mt-10 space-y-5">
            <Stat title="Today's Transfers" value="1,248" />
            <Stat title="Active Partners" value="82" />
            <Stat title="Countries Supported" value="34" />
            <Stat title="Processing Volume" value="$48.2M" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-white/40 text-sm">{title}</p>
      <h3 className="text-5xl font-black text-emerald-400 mt-4">{value}</h3>
    </div>
  );
}