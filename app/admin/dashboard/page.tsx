"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Transfer = {
  id: number;
  sender_name: string;
  receiver_name: string;
  amount: number;
  receive_currency: string;
  destination_country: string;
  payment_method: string;
  status: string;
  compliance_status: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [bankConnected, setBankConnected] = useState(false);
const [bankProvider, setBankProvider] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransfers(data);
      }

      setLoading(false);
      const bankRes = await fetch("/api/bank/status");
const bankData = await bankRes.json();

if (bankData.connected) {
  setBankConnected(true);
  setBankProvider(bankData.provider);
}
    }

    loadMetrics();
  }, []);

  const totalTransfers = transfers.length;

  const totalVolume = transfers.reduce(
    (sum, transfer) => sum + Number(transfer.amount || 0),
    0
  );

  const totalFees = totalVolume * 0.005;

  const today = new Date().toDateString();

  const transfersToday = transfers.filter(
    (transfer) =>
      new Date(transfer.created_at).toDateString() === today
  ).length;

  const pendingTransfers = transfers.filter(
    (transfer) =>
      transfer.status === "PENDING" ||
      transfer.status === "UNDER_REVIEW" ||
      transfer.status === "PROCESSING"
  ).length;

  const completedTransfers = transfers.filter(
    (transfer) =>
      transfer.status === "COMPLETED" ||
      transfer.status === "PAID_OUT"
  ).length;

  const rejectedTransfers = transfers.filter(
    (transfer) => transfer.status === "REJECTED"
  ).length;

  const complianceAlerts = transfers.filter(
    (transfer) =>
      transfer.compliance_status === "FLAGGED" ||
      Number(transfer.amount || 0) >= 10000
  ).length;

  const recentTransfers = transfers.slice(0, 5);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h1 className="text-5xl font-black text-emerald-400">
              Asira Control Center
            </h1>

            <p className="text-white/50 mt-3">
              Unified admin command center for transfers, cards, compliance,
              payouts, and settlement operations.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4">
            <p className="text-sm text-white/50">
              System Status
            </p>

            <h2 className="text-2xl font-black text-emerald-400">
              ONLINE
            </h2>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">
                Bank Connection
              </p>

              <h2 className="text-3xl font-black text-emerald-400 mt-2">
                {bankConnected ? "CONNECTED" : "DISCONNECTED"}
              </h2>

              <p className="text-white/50 mt-2">
                Provider: {bankProvider || "N/A"}
              </p>
            </div>

            <div className="text-5xl">
              🏦
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-5">
          <MetricCard
            label="Pending Operations"
            value={loading ? "..." : pendingTransfers}
            color="text-yellow-300"
          />

          <MetricCard
            label="Completed"
            value={loading ? "..." : completedTransfers}
            color="text-emerald-400"
          />

          <MetricCard
            label="Rejected"
            value={loading ? "..." : rejectedTransfers}
            color="text-red-400"
          />

          <MetricCard
            label="Compliance Alerts"
            value={loading ? "..." : complianceAlerts}
            color="text-red-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-black">
                Recent Transfers
              </h2>

              <Link
                href="/admin/transfers"
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-black"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/50">
                  <tr>
                    <th className="py-3 text-left">Ref</th>
                    <th className="py-3 text-left">Sender</th>
                    <th className="py-3 text-left">Receiver</th>
                    <th className="py-3 text-left">Amount</th>
                    <th className="py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTransfers.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-t border-white/10"
                    >
                      <td className="py-4">ASIRA-{tx.id}</td>
                      <td className="py-4">{tx.sender_name || "N/A"}</td>
                      <td className="py-4">{tx.receiver_name || "N/A"}</td>
                      <td className="py-4">
                        ${Number(tx.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <StatusBadge status={tx.status || "PENDING"} />
                      </td>
                    </tr>
                  ))}

                  {!loading && recentTransfers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-white/40"
                      >
                        No recent transfers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              Operations Center
            </h2>

            <div className="mt-5 space-y-3">
              <QuickLink
                href="/admin/transfers"
                title="Transfer Operations"
                subtitle="Approve, process, and complete transfers"
              />

              <QuickLink
                href="/admin/cards"
                title="Card Operations"
                subtitle="Monitor card funding and settlements"
              />

              <QuickLink
                href="/admin/compliance"
                title="Compliance Review"
                subtitle="KYC, AML, and flagged transactions"
              />

              <QuickLink
                href="/admin/payouts"
                title="Payout Queue"
                subtitle="Local and international payout control"
              />

              <QuickLink
                href="/admin/swift"
                title="SWIFT Queue"
                subtitle="International banking message workflow"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: any;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-white/50 text-sm">{label}</p>
      <h2 className={`text-3xl font-black mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "COMPLETED" || status === "PAID_OUT"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "REJECTED"
      ? "bg-red-500/20 text-red-400"
      : status === "PROCESSING"
      ? "bg-blue-500/20 text-blue-300"
      : "bg-yellow-500/20 text-yellow-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${color}`}>
      {status}
    </span>
  );
}

function QuickLink({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-white/10 bg-black/40 p-4 hover:bg-white/10"
    >
      <p className="font-black text-white">{title}</p>
      <p className="text-sm text-white/40 mt-1">{subtitle}</p>
    </Link>
  );
}