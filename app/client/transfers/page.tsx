"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: string;
  sender_name: string;
  receiver_name: string;
  amount: number;
  destination_country: string;
  payment_method: string;
  status: string;
  created_at: string;
};

export default function ClientTransfersPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, sender_name, receiver_name, amount, destination_country, payment_method, status, created_at"
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }

    setLoading(false);
  }

  function statusColor(status: string) {
    if (status === "COMPLETED") return "text-emerald-400";
    if (status === "PROCESSING") return "text-blue-400";
    if (status === "APPROVED") return "text-yellow-400";
    if (status === "FAILED" || status === "REJECTED") return "text-red-400";
    return "text-yellow-300";
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-emerald-400">
              My Transfers
            </h1>

            <p className="text-white/50 mt-2">
              Live remittance history and payout status from Supabase.
            </p>
          </div>

          <Link
            href="/remit"
            className="rounded-2xl bg-emerald-500 px-6 py-3 font-bold text-black"
          >
            New Transfer
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">Transaction History</h2>
            <span className="text-emerald-400 font-bold">
              {transactions.length} Records
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
              No transfers yet.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-5"
                >
                  <div className="grid md:grid-cols-7 gap-4 items-center">
                    <div>
                      <p className="text-white/40 text-xs">Sender</p>
                      <h3 className="font-bold">{tx.sender_name}</h3>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">Receiver</p>
                      <h3 className="font-bold">{tx.receiver_name}</h3>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">Destination</p>
                      <h3 className="font-bold">
                        {tx.destination_country || "N/A"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">Method</p>
                      <h3 className="font-bold text-blue-400">
                        {tx.payment_method || "BANK"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">Amount</p>
                      <h3 className="font-bold text-emerald-400">
                        ${Number(tx.amount).toLocaleString()}
                      </h3>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">Created</p>
                      <h3 className="text-xs text-white/50">
                        {new Date(tx.created_at).toLocaleString()}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-sm font-bold ${statusColor(
                          tx.status || "PENDING"
                        )}`}
                      >
                        {tx.status || "PENDING"}
                      </span>

                      <div className="flex gap-2 mt-3">
                        <Link
                          href={`/track?id=${tx.id}`}
                          className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-bold text-black"
                        >
                          Track
                        </Link>

                        <Link
                          href={`/receipt/${tx.id}`}
                          className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-black"
                        >
                          Receipt
                        </Link>
                      </div>
                    </div>
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