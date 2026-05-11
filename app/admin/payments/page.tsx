"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PaymentIntent = {
  id: number;
  transaction_id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentIntent[]>([]);

  async function loadPayments() {
    const { data, error } = await supabase
      .from("payment_intents")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setPayments(data);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-emerald-400">
            ASIRA PAYMENTS
          </h1>

          <p className="text-white/50 mt-2">
            Payment Gateway Monitoring Dashboard
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-emerald-500 text-black font-bold">
          PAYMENT ENGINE
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Transaction</th>
              <th className="p-4">Reference</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Currency</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="p-4">#{payment.id}</td>

                <td className="p-4">
                  TX-{payment.transaction_id}
                </td>

                <td className="p-4 text-emerald-400 font-bold">
                  {payment.reference}
                </td>

                <td className="p-4">
                  ${payment.amount}
                </td>

                <td className="p-4">
                  {payment.currency}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}