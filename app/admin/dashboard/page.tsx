"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Transfer = {
  id: string;
  amount: number;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, amount, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransfers(data);
      }

      setLoading(false);
    }

    loadMetrics();
  }, []);

  const totalTransfers = transfers.length;

  const totalVolume = transfers.reduce((sum, transfer) => {
    return sum + Number(transfer.amount || 0);
  }, 0);

  const today = new Date().toDateString();

  const transfersToday = transfers.filter((transfer) => {
    return new Date(transfer.created_at).toDateString() === today;
  }).length;

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-emerald-400">
              Asira Control Center
            </h1>

            <p className="text-white/50 mt-3">
              Unified fintech operations dashboard with live Supabase metrics.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4">
            <p className="text-sm text-white/50">System Status</p>
            <h2 className="text-2xl font-black text-emerald-400">
              ONLINE
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Total Volume</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-2">
              ${loading ? "..." : totalVolume.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Total Transfers</p>
            <h2 className="text-3xl font-black text-blue-400 mt-2">
              {loading ? "..." : totalTransfers}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Transfers Today</p>
            <h2 className="text-3xl font-black text-yellow-400 mt-2">
              {loading ? "..." : transfersToday}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Compliance Alerts</p>
            <h2 className="text-3xl font-black text-red-400 mt-2">0</h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">Live Data Status</h2>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
            Supabase live transaction metrics connected.
          </div>
        </div>
      </div>
    </main>
  );
}