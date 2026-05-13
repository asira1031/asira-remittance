export default function MerchantAdminPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-5xl font-black text-emerald-400">
        Merchant Portal
      </h1>

      <p className="mt-4 text-white/50">
        Merchant payment gateway and settlement dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">
            Create Payment
          </h2>

          <p className="mt-4 text-white/50">
            Generate hosted payment links.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">
            Settlement
          </h2>

          <p className="mt-4 text-white/50">
            Merchant payout and settlement details.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">
            Payment History
          </h2>

          <p className="mt-4 text-white/50">
            Monitor transactions and reports.
          </p>
        </div>
      </div>
    </main>
  );
}