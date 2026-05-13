export default function MerchantAdminPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-5xl font-black text-emerald-400">
        Merchant Portal
      </h1>

      <p className="mt-3 text-white/50">
        Create hosted payment links and monitor merchant settlement activity.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">Create Payment</h2>
          <p className="mt-4 text-white/50">
            Generate hosted links for bank, card, international, and crypto payments.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">Settlement Details</h2>
          <p className="mt-4 text-white/50">
            View merchant payout and settlement information.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-black">Payment History</h2>
          <p className="mt-4 text-white/50">
            Monitor payment links, transaction reports, and client payment status.
          </p>
        </div>
      </div>
    </main>
  );
}