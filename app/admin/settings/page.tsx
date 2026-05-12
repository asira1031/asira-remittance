"use client";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Settings
        </h1>

        <p className="text-white/50 mt-2">
          Configure environment, banking APIs, fees, payout limits, and platform controls.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Environment</p>
            <h2 className="text-2xl font-black text-yellow-400 mt-2">
              SANDBOX
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Platform Fee</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">
              0%
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Daily Limit</p>
            <h2 className="text-2xl font-black text-blue-400 mt-2">
              $0
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">System Mode</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">
              ACTIVE
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">Platform Configuration</h2>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Banking Environment</p>
                <p className="text-white/40 text-sm">
                  Current API mode for UnionBank and financial rails
                </p>
              </div>
              <p className="text-yellow-400 font-black">SANDBOX</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Transfer Controls</p>
                <p className="text-white/40 text-sm">
                  Limits, fees, payout routing, and transaction rules
                </p>
              </div>
              <p className="text-blue-400 font-black">READY</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Security Controls</p>
                <p className="text-white/40 text-sm">
                  Admin access, API token safety, and operational restrictions
                </p>
              </div>
              <p className="text-emerald-400 font-black">ACTIVE</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}