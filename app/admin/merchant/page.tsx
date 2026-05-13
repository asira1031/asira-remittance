"use client";

import Link from "next/link";

export default function MerchantPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-emerald-400">
          Merchant Portal
        </h1>

        <p className="mt-3 text-white/50">
          Hosted checkout gateway and merchant settlement dashboard.
        </p>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <Card title="Hosted Links" value="24" />
          <Card title="Pending Payments" value="8" />
          <Card title="Completed" value="16" />
          <Card title="Settlement Volume" value="$42.8K" />
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">
              Create Payment
            </h2>

            <p className="mt-3 text-white/50">
              Generate hosted payment links for clients.
            </p>

            <div className="space-y-4 mt-8">
              <input
                placeholder="Customer Name"
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none"
              />

              <input
                placeholder="Customer Email"
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none"
              />

              <input
                placeholder="Amount"
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none"
              />

              <select className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none">
                <option>Card</option>
                <option>Bank</option>
                <option>SWIFT</option>
                <option>Crypto</option>
              </select>

              <button className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-black">
                Generate Hosted Link
              </button>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">
              Payment Methods
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <MethodCard
                title="Card"
                description="Visa / Mastercard checkout"
              />

              <MethodCard
                title="Bank"
                description="Local bank transfer"
              />

              <MethodCard
                title="SWIFT"
                description="International wire settlement"
              />

              <MethodCard
                title="Crypto"
                description="USDT / digital asset payments"
              />
            </div>
          </div>
        </div>

        {/* TRANSACTION HISTORY */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">
              Payment History
            </h2>

            <Link
              href="/admin/reports"
              className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-black"
            >
              View Reports
            </Link>
          </div>

          <div className="overflow-x-auto mt-8">
            <table className="w-full text-left">
              <thead className="text-white/40 border-b border-white/10">
                <tr>
                  <th className="pb-4">Reference</th>
                  <th className="pb-4">Client</th>
                  <th className="pb-4">Method</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>

              <tbody className="text-white">
                <tr className="border-b border-white/5">
                  <td className="py-5">ASIRA-24001</td>
                  <td>Juan Dela Cruz</td>
                  <td>Card</td>
                  <td>$1,200</td>
                  <td>
                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400 text-xs font-bold">
                      PENDING
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-white/5">
                  <td className="py-5">ASIRA-24002</td>
                  <td>Michael Tan</td>
                  <td>SWIFT</td>
                  <td>$5,000</td>
                  <td>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-400 text-xs font-bold">
                      COMPLETED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-white/40 text-sm">
        {title}
      </p>

      <h3 className="text-4xl font-black text-emerald-400 mt-3">
        {value}
      </h3>
    </div>
  );
}

function MethodCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <h3 className="text-2xl font-black text-emerald-400">
        {title}
      </h3>

      <p className="mt-3 text-white/50">
        {description}
      </p>
    </div>
  );
}