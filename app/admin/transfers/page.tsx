"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminTransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTransfers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTransfers(data);
    }

    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await supabase
      .from("transactions")
      .update({ status })
      .eq("id", id);

    loadTransfers();
  }

  useEffect(() => {
    loadTransfers();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black text-emerald-400">
        International Transfers
      </h1>

      <p className="text-white/50 mt-2">
        Monitor and manage all remittance transactions.
      </p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-white/10 text-white/70">
            <tr>
              <th className="p-4 text-left">Reference</th>
              <th className="p-4 text-left">Sender</th>
              <th className="p-4 text-left">Receiver</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Currency</th>
              <th className="p-4 text-left">Country</th>
              <th className="p-4 text-left">Bank</th>
              <th className="p-4 text-left">SWIFT</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Compliance</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={11}
                  className="p-8 text-center text-white/40"
                >
                  Loading transfers...
                </td>
              </tr>
            )}

            {!loading && transfers.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="p-8 text-center text-white/40"
                >
                  No transactions found.
                </td>
              </tr>
            )}

            {!loading &&
              transfers.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t border-white/10"
                >
                  <td className="p-4">
                    ASIRA-{tx.id}
                  </td>

                  <td className="p-4">
                    {tx.sender_name}
                  </td>

                  <td className="p-4">
                    {tx.receiver_name}
                  </td>

                  <td className="p-4">
                    $
                    {Number(tx.amount).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {tx.receive_currency}
                  </td>

                  <td className="p-4">
                    {tx.destination_country}
                  </td>

                  <td className="p-4">
                    {tx.receiver_bank_name}
                  </td>

                  <td className="p-4">
                    {tx.swift_code}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tx.status === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : tx.status === "REJECTED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {tx.compliance_status}
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() =>
                        updateStatus(tx.id, "APPROVED")
                      }
                      className="px-3 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(tx.id, "REJECTED")
                      }
                      className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-bold"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}