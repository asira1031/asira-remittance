"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createAuditLog } from "@/lib/audit";
export default function AdminTransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("transactions")
    .update({ status })
    .eq("id", id);

  await createAuditLog({
    user_id: user?.id,
    user_email: user?.email,
    action: `TRANSFER_STATUS_UPDATED_TO_${status}`,
    entity_type: "TRANSACTION",
    entity_id: String(id),
    details: `Transfer ASIRA-${id} status changed to ${status}`,
  });

  await loadTransfers();

  if (selectedTx?.id === id) {
    setSelectedTx({ ...selectedTx, status });
  }
}
  useEffect(() => {
    loadTransfers();
  }, []);

  const statusButtons = [
    "UNDER_REVIEW",
    "APPROVED",
    "PROCESSING",
    "SENT_TO_BANK",
    "PAID_OUT",
    "COMPLETED",
    "REJECTED",
  ];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black text-emerald-400">
        Transfer Operations
      </h1>

      <p className="text-white/50 mt-2">
        Monitor local and international remittance transactions.
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
              <th className="p-4 text-left">View</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={11} className="p-8 text-center text-white/40">
                  Loading transfers...
                </td>
              </tr>
            )}

            {!loading && transfers.length === 0 && (
              <tr>
                <td colSpan={11} className="p-8 text-center text-white/40">
                  No transactions found.
                </td>
              </tr>
            )}

            {!loading &&
              transfers.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">ASIRA-{tx.id}</td>
                  <td className="p-4">{tx.sender_name}</td>
                  <td className="p-4">{tx.receiver_name}</td>
                  <td className="p-4">${Number(tx.amount).toLocaleString()}</td>
                  <td className="p-4">{tx.receive_currency || "PHP"}</td>
                  <td className="p-4">{tx.destination_country}</td>
                  <td className="p-4">{tx.receiver_bank_name || "Local Bank"}</td>
                  <td className="p-4">{tx.swift_code || "N/A"}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tx.status === "COMPLETED" || tx.status === "PAID_OUT"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : tx.status === "REJECTED"
                          ? "bg-red-500/20 text-red-400"
                          : tx.status === "PROCESSING"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="p-4">{tx.compliance_status || "UNDER_REVIEW"}</td>

                  <td className="p-4">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-emerald-400">
                  ASIRA-{selectedTx.id}
                </h2>
                <p className="text-white/50 mt-1">
                  Full remittance transaction details
                </p>
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"
              >
                Close
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Info label="Sender" value={selectedTx.sender_name} />
              <Info label="Receiver" value={selectedTx.receiver_name} />
              <Info label="Amount" value={`$${Number(selectedTx.amount).toLocaleString()}`} />
              <Info label="Receive Currency" value={selectedTx.receive_currency || "PHP"} />
              <Info label="Destination Country" value={selectedTx.destination_country} />
              <Info label="Payment Method" value={selectedTx.payment_method} />
              <Info label="Receiver Bank" value={selectedTx.receiver_bank_name || "Local Bank"} />
              <Info label="Receiver Account / IBAN" value={selectedTx.receiver_account_number || "N/A"} />
              <Info label="SWIFT / BIC" value={selectedTx.swift_code || "N/A"} />
              <Info label="Purpose" value={selectedTx.purpose_of_transfer || "N/A"} />
              <Info label="Source of Funds" value={selectedTx.source_of_funds || "N/A"} />
              <Info label="Compliance" value={selectedTx.compliance_status || "UNDER_REVIEW"} />
              <Info label="Current Status" value={selectedTx.status} />
              <Info label="Created At" value={selectedTx.created_at || "N/A"} />
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
              <h3 className="text-lg font-black text-white">
                Status Workflow
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {statusButtons.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedTx.id, status)}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-black hover:opacity-80"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-2 font-bold text-white break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}