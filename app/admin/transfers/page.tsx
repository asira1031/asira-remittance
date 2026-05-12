"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Transfer = {
  id: string;
  sender_name: string;
  receiver_name: string;
  amount: number;
  destination_country: string;
  created_at: string;
  status: string;
};

export default function AdminTransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransfers();
  }, []);

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

  async function updateStatus(id: string, status: string) {
    await supabase
      .from("transactions")
      .update({ status })
      .eq("id", id);

    loadTransfers();
  }

  function statusColor(status: string) {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-400";

      case "PROCESSING":
        return "text-blue-400";

      case "FAILED":
        return "text-red-400";

      case "REJECTED":
        return "text-red-500";

      case "APPROVED":
        return "text-yellow-400";

      default:
        return "text-yellow-300";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Transfers
        </h1>

        <p className="text-white/50 mt-2">
          Live transfer monitoring and payout status management.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-black">Transfer Queue</h2>

            <span className="text-emerald-400 font-bold">
              {transfers.length} Records
            </span>
          </div>

          {loading ? (
            <p className="text-white/40">Loading transfers...</p>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-white/40 text-xs">Sender</p>
                      <p className="font-bold">
                        {transfer.sender_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">Receiver</p>
                      <p className="font-bold">
                        {transfer.receiver_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">
                        Destination
                      </p>

                      <p className="font-bold">
                        {transfer.destination_country}
                      </p>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs">Amount</p>

                      <p className="font-black text-emerald-400">
                        $
                        {Number(
                          transfer.amount
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-black ${statusColor(
                          transfer.status || "PENDING"
                        )}`}
                      >
                        {transfer.status || "PENDING"}
                      </p>

                      <p className="text-white/30 text-xs">
                        {new Date(
                          transfer.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <button
                      onClick={() =>
                        updateStatus(
                          transfer.id,
                          "PROCESSING"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold"
                    >
                      Processing
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          transfer.id,
                          "APPROVED"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          transfer.id,
                          "COMPLETED"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          transfer.id,
                          "FAILED"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold"
                    >
                      Fail
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          transfer.id,
                          "REJECTED"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-red-700 text-white font-bold"
                    >
                      Reject
                    </button>
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