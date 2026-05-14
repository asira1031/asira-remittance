"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HostedPayment = {
  reference: string;
  client: string;
  method: string;
  amount: string;
  status: string;
};

export default function MerchantDashboardPage() {
  const router = useRouter();

  const [merchantName, setMerchantName] = useState("");
  const [merchantEmail, setMerchantEmail] = useState("");

  const [payments] = useState<HostedPayment[]>([
    {
      reference: "ASIRA-24001",
      client: "Juan Dela Cruz",
      method: "Card",
      amount: "$1,200",
      status: "PENDING",
    },
    {
      reference: "ASIRA-24002",
      client: "Michael Tan",
      method: "SWIFT",
      amount: "$5,000",
      status: "COMPLETED",
    },
  ]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("merchant_email");
    const storedName = localStorage.getItem("merchant_name");

    if (!storedEmail) {
      router.push("/merchant-login");
      return;
    }

    setMerchantEmail(storedEmail);
    setMerchantName(storedName || "Merchant");
  }, [router]);

  function logout() {
    localStorage.removeItem("merchant_email");
    localStorage.removeItem("merchant_id");
    localStorage.removeItem("merchant_name");

    router.push("/merchant-login");
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-black text-emerald-400">
              Merchant Dashboard
            </h1>

            <p className="mt-3 text-white/50">
              Welcome back, {merchantName}
            </p>

            <p className="text-white/30 text-sm mt-1">
              {merchantEmail}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-black text-red-400"
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <Card title="Hosted Links" value="24" />
          <Card title="Pending" value="8" />
          <Card title="Completed" value="16" />
          <Card title="Settlement Volume" value="$42.8K" />
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <ActionCard
                title="Create Hosted Link"
                description="Generate new payment links."
              />

              <ActionCard
                title="View Transactions"
                description="Monitor payment activity."
              />

              <ActionCard
                title="Settlement Details"
                description="Manage payout information."
              />

              <ActionCard
                title="Reports"
                description="Review merchant reports."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">
              Supported Payments
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <MethodCard
                title="Card"
                description="Visa / Mastercard"
              />

              <MethodCard
                title="Bank"
                description="Local bank transfer"
              />

              <MethodCard
                title="SWIFT"
                description="International settlement"
              />

              <MethodCard
                title="Crypto"
                description="USDT / blockchain payments"
              />
            </div>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mt-10">
          <h2 className="text-3xl font-black">
            Recent Transactions
          </h2>

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

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.reference}
                    className="border-b border-white/5"
                  >
                    <td className="py-5">
                      {payment.reference}
                    </td>

                    <td>{payment.client}</td>

                    <td>{payment.method}</td>

                    <td>{payment.amount}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          payment.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
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

function ActionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
      <h3 className="text-xl font-black text-emerald-400">
        {title}
      </h3>

      <p className="mt-3 text-white/50">
        {description}
      </p>
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