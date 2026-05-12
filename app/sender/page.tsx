"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Transfer = {
  id: string;
  sender_name: string;
  receiver_name: string;
  amount: number;
  destination_country: string;
  created_at: string;
};

export default function SenderDashboard() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransfers() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransfers(data);
      }

      setLoading(false);
    }

    loadTransfers();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-emerald-400">
              Sender Dashboard
            </h1>
            <p className="text-white/50 mt-2">
              Manage transfers, bank connection, and payout tracking.
            </p>
          </div>

          <Link
            href="/remit"
            className="rounded-2xl bg-emerald-500 px-6 py-3 font-bold text-black"
          >
            New Transfer
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Bank Status</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">
              Connected
            </h2>
            <p className="text-white/40 text-sm mt-2">
              UnionBank sandbox OAuth active.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Total Transfers</p>
            <h2 className="text-2xl font-black mt-2">{transfers.length}</h2>
            <p className="text-white/40 text-sm mt-2">
              Total transfer records.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Current Status</p>
            <h2 className="text-2xl font-black text-yellow-400 mt-2">
              Ready
            </h2>
            <p className="text-white/40 text-sm mt-2">
              Ready to create transfer request.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">Recent Transfers</h2>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
              Loading transfers...
            </div>
          ) : transfers.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
              No transfer history yet.
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {transfer.sender_name} → {transfer.receiver_name}
                    </p>
                    <p className="text-sm text-white/40">
                      {transfer.destination_country || "No country"} •{" "}
                      {new Date(transfer.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-emerald-400">
                      ${Number(transfer.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-yellow-400">PENDING</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}