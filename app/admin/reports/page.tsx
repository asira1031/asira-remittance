"use client";

export default function AdminReportsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Reports
        </h1>

        <p className="text-white/50 mt-2">
          Monitor remittance analytics, payout summaries, operational metrics, and transaction reporting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Daily Volume</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-2">
              $0
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Transfers Today</p>
            <h2 className="text-3xl font-black text-blue-400 mt-2">
              0
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Completed Payouts</p>
            <h2 className="text-3xl font-black text-yellow-400 mt-2">
              0
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">System Revenue</p>
            <h2 className="text-3xl font-black text-pink-400 mt-2">
              $0
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">
            Operational Reporting
          </h2>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Transfer Analytics</p>
                <p className="text-white/40 text-sm">
                  Monitor sender transaction activity and payout flows
                </p>
              </div>

              <div className="text-right">
                <p className="text-emerald-400 font-black">ACTIVE</p>
                <p className="text-white/30 text-xs">
                  Reporting Engine Online
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Financial Summary</p>
                <p className="text-white/40 text-sm">
                  Revenue, fees, and payout settlement overview
                </p>
              </div>

              <div className="text-right">
                <p className="text-blue-400 font-black">READY</p>
                <p className="text-white/30 text-xs">
                  Awaiting Live Metrics
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Audit Reporting</p>
                <p className="text-white/40 text-sm">
                  Compliance logs and operational transaction records
                </p>
              </div>

              <div className="text-right">
                <p className="text-yellow-400 font-black">MONITORING</p>
                <p className="text-white/30 text-xs">
                  Audit Tracking Enabled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}