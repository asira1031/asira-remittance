"use client";

export default function AdminPayoutsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Payouts
        </h1>

        <p className="text-white/50 mt-2">
          Manage payout approvals, processing, and completion tracking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Pending Payouts</p>
            <h2 className="text-3xl font-black text-yellow-400 mt-2">0</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Processing</p>
            <h2 className="text-3xl font-black text-blue-400 mt-2">0</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Completed</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-2">0</h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">Payout Queue</h2>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
            Payout workflow ready. Next step: connect approved transfers.
          </div>
        </div>
      </div>
    </main>
  );
}