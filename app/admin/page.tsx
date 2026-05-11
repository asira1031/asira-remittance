"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Transaction = {
  id: number;
  sender_name: string;
  receiver_name: string;
  amount: number;
  destination_country: string;
  status: string;
};

export default function AdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const totalTransactions = transactions.length;

const pendingTransfers = transactions.filter(
  (tx) => tx.status === "PENDING"
).length;

const paidOutTransfers = transactions.filter(
  (tx) => tx.status === "PAID_OUT"
).length;

const totalVolume = transactions.reduce(
  (sum, tx) => sum + Number(tx.amount || 0),
  0
);

  async function loadTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("transactions")
      .update({ status })
      .eq("id", id);

    if (!error) {
      loadTransactions();
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-emerald-400">
            ASIRA ADMIN
          </h1>

          <p className="text-white/50 mt-2">
            Global Remittance Monitoring Dashboard
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-emerald-500 text-black font-bold">
          LIVE SYSTEM
        </div>
      </div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-white/50 text-sm">Total Transactions</p>
    <h2 className="text-3xl font-black text-emerald-400 mt-2">
      {totalTransactions}
    </h2>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-white/50 text-sm">Pending</p>
    <h2 className="text-3xl font-black text-yellow-300 mt-2">
      {pendingTransfers}
    </h2>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-white/50 text-sm">Paid Out</p>
    <h2 className="text-3xl font-black text-purple-300 mt-2">
      {paidOutTransfers}
    </h2>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-white/50 text-sm">Total Volume</p>
    <h2 className="text-3xl font-black text-emerald-400 mt-2">
      ${totalVolume.toLocaleString()}
    </h2>
  </div>
</div>
      <div className="rounded-3xl border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Sender</th>
              <th className="p-4">Receiver</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Country</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="p-4">#{tx.id}</td>

                <td className="p-4">{tx.sender_name}</td>

                <td className="p-4">{tx.receiver_name}</td>

                <td className="p-4 text-emerald-400 font-bold">
                  ${tx.amount}
                </td>

                <td className="p-4">{tx.destination_country}</td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                    {tx.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateStatus(tx.id, "APPROVED")}
                      className="px-3 py-2 rounded-xl bg-emerald-500 text-black text-sm font-bold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(tx.id, "PROCESSING")}
                      className="px-3 py-2 rounded-xl bg-blue-500 text-white text-sm font-bold"
                    >
                      Processing
                    </button>

                    <button
                      onClick={() => updateStatus(tx.id, "PAID_OUT")}
                      className="px-3 py-2 rounded-xl bg-purple-500 text-white text-sm font-bold"
                    >
                      Paid
                    </button>

                    <button
                      onClick={() => updateStatus(tx.id, "REJECTED")}
                      className="px-3 py-2 rounded-xl bg-red-500 text-white text-sm font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}