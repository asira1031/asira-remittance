"use client";

import { useState } from "react";
import Link from "next/link";

type Payment = {
  reference: string;
  client: string;
  email: string;
  method: string;
  amount: string;
  status: string;
  url: string;
};

export default function MerchantPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Card");
  const [hostedLink, setHostedLink] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);

  function generateHostedLink() {
    if (!customerName || !customerEmail || !amount) {
      alert("Please complete customer name, email, and amount.");
      return;
    }

    const reference = `ASIRA-${Date.now()}`;
    const url = `${window.location.origin}/checkout/${reference}`;

    const newPayment: Payment = {
      reference,
      client: customerName,
      email: customerEmail,
      method,
      amount: `$${Number(amount).toLocaleString()}`,
      status: "PENDING",
      url,
    };

    setPayments([newPayment, ...payments]);
    setHostedLink(url);

    setCustomerName("");
    setCustomerEmail("");
    setAmount("");

    alert("Hosted payment link generated.");
  }

  async function copyHostedLink() {
    if (!hostedLink) return;
    await navigator.clipboard.writeText(hostedLink);
    alert("Hosted link copied.");
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-emerald-400">
          Merchant Portal
        </h1>

        <p className="mt-3 text-white/50">
          Hosted checkout gateway and merchant settlement dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <Card title="Hosted Links" value={String(payments.length)} />
          <Card
            title="Pending Payments"
            value={String(payments.filter((p) => p.status === "PENDING").length)}
          />
          <Card title="Completed" value="0" />
          <Card title="Settlement Volume" value="$0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">Create Payment</h2>

            <p className="mt-3 text-white/50">
              Generate hosted payment links for clients.
            </p>

            <div className="space-y-4 mt-8">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none"
              />

              <input
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Customer Email"
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none"
              />

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none"
              />

              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-2xl bg-black/40 border border-white/10 px-5 py-4 outline-none"
              >
                <option>Card</option>
                <option>Bank</option>
                <option>SWIFT</option>
                <option>Crypto</option>
              </select>

              <button
                onClick={generateHostedLink}
                className="w-full rounded-2xl bg-emerald-500 py-4 font-black text-black"
              >
                Generate Hosted Link
              </button>
            </div>

            {hostedLink && (
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="text-sm text-white/50">Generated Hosted Link</p>

                <p className="mt-2 break-all text-emerald-400 font-bold">
                  {hostedLink}
                </p>

                <button
                  onClick={copyHostedLink}
                  className="mt-4 rounded-xl bg-emerald-500 px-5 py-3 font-black text-black"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-black">Payment Methods</h2>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <MethodCard title="Card" description="Visa / Mastercard checkout" />
              <MethodCard title="Bank" description="Local bank transfer" />
              <MethodCard title="SWIFT" description="International wire settlement" />
              <MethodCard title="Crypto" description="USDT / digital asset payments" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black">Payment History</h2>

            <Link
              href="/admin/reports"
              className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-black"
            >
              View Reports
            </Link>
          </div>

          <div className="overflow-x-auto mt-8">
            <table className="w-full text-left">
              <thead className="text-white/40 border-b border-white/10">
                <tr>
                  <th className="pb-4">Reference</th>
                  <th className="pb-4">Client</th>
                  <th className="pb-4">Method</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Link</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.reference} className="border-b border-white/5">
                    <td className="py-5">{payment.reference}</td>
                    <td>{payment.client}</td>
                    <td>{payment.method}</td>
                    <td>{payment.amount}</td>
                    <td>
                      <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400 text-xs font-bold">
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={payment.url.replace(window.location.origin, "")}
                        className="text-emerald-400 font-bold"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}

                {payments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-white/40">
                      No hosted payment links yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-white/40 text-sm">{title}</p>
      <h3 className="text-4xl font-black text-emerald-400 mt-3">{value}</h3>
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
      <h3 className="text-2xl font-black text-emerald-400">{title}</h3>
      <p className="mt-3 text-white/50">{description}</p>
    </div>
  );
}