"use client";

import Link from "next/link";

export default function ClientDashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-emerald-400">
              Client Dashboard
            </h1>
            <p className="text-white/50 mt-2">
              Send money, track transfers, manage KYC, and view receipts.
            </p>
          </div>

          <Link
            href="/remit"
            className="rounded-2xl bg-emerald-500 px-6 py-3 font-bold text-black"
          >
            New Transfer
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">KYC Status</p>
            <h2 className="text-2xl font-black text-yellow-400 mt-2">
              PENDING
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Transfers</p>
            <h2 className="text-2xl font-black text-blue-400 mt-2">
              0
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Total Sent</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">
              $0
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Current Status</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">
              READY
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <Link
            href="/remit"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-emerald-500 hover:text-black transition"
          >
            <h2 className="text-2xl font-black">Send Money</h2>
            <p className="text-sm mt-2 opacity-70">
              Create a bank, card, or SWIFT transfer request.
            </p>
          </Link>

          <Link
            href="/track"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-emerald-500 hover:text-black transition"
          >
            <h2 className="text-2xl font-black">Track Transfer</h2>
            <p className="text-sm mt-2 opacity-70">
              Check status of your current remittance.
            </p>
          </Link>

          <Link
            href="/kyc"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-emerald-500 hover:text-black transition"
          >
            <h2 className="text-2xl font-black">Complete KYC</h2>
            <p className="text-sm mt-2 opacity-70">
              Upload identity documents for verification.
            </p>
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">Recent Activity</h2>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
            No recent client activity yet.
          </div>
        </div>
      </div>
    </main>
  );
}