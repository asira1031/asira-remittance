"use client";

export default function AdminCompliancePage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Compliance
        </h1>

        <p className="text-white/50 mt-2">
          Monitor KYC verification, AML reviews, risk checks, and compliance approvals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Pending KYC</p>
            <h2 className="text-3xl font-black text-yellow-400 mt-2">0</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">AML Reviews</p>
            <h2 className="text-3xl font-black text-blue-400 mt-2">0</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Approved Accounts</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-2">0</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Flagged Activity</p>
            <h2 className="text-3xl font-black text-red-400 mt-2">0</h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">
            Compliance Monitoring Queue
          </h2>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">KYC Verification</p>
                <p className="text-white/40 text-sm">
                  Identity and customer verification workflow
                </p>
              </div>

              <div className="text-right">
                <p className="text-emerald-400 font-black">READY</p>
                <p className="text-white/30 text-xs">
                  Verification Queue Active
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">AML Monitoring</p>
                <p className="text-white/40 text-sm">
                  Anti-money laundering transaction screening
                </p>
              </div>

              <div className="text-right">
                <p className="text-yellow-400 font-black">MONITORING</p>
                <p className="text-white/30 text-xs">
                  Risk Detection Enabled
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Risk Assessment</p>
                <p className="text-white/40 text-sm">
                  Transaction behavior and account analysis
                </p>
              </div>

              <div className="text-right">
                <p className="text-blue-400 font-black">ACTIVE</p>
                <p className="text-white/30 text-xs">
                  Compliance Engine Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}