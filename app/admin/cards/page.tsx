"use client";

import { useState } from "react";

const initialCards = [
  {
    id: 1,
    cardholder: "Juan Dela Cruz",
    card: "**** **** **** 3459",
    type: "VISA",
    country: "Philippines",
    amount: 1000,
    currency: "USD",
    status: "PROCESSING",
    linkedTransfer: "ASIRA-101",
  },
  {
    id: 2,
    cardholder: "Lauro Quirante",
    card: "**** **** **** 8821",
    type: "MASTERCARD",
    country: "Korea",
    amount: 2500,
    currency: "USD",
    status: "APPROVED",
    linkedTransfer: "ASIRA-102",
  },
  {
    id: 3,
    cardholder: "Aaron Lee",
    card: "**** **** **** 1148",
    type: "VISA",
    country: "Japan",
    amount: 5000,
    currency: "USD",
    status: "COMPLETED",
    linkedTransfer: "ASIRA-103",
  },
];

export default function AdminCardsPage() {
  const [cards, setCards] = useState(initialCards);
  const [search, setSearch] = useState("");

  function updateStatus(id: number, status: string) {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, status } : card
      )
    );
  }

  function statusColor(status: string) {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/20 text-emerald-400";
      case "APPROVED":
        return "bg-yellow-500/20 text-yellow-300";
      case "PROCESSING":
        return "bg-blue-500/20 text-blue-300";
      case "REJECTED":
        return "bg-red-500/20 text-red-400";
      case "FROZEN":
        return "bg-purple-500/20 text-purple-300";
      default:
        return "bg-white/10 text-white";
    }
  }

  const filteredCards = cards.filter((card) =>
    `${card.cardholder} ${card.country} ${card.type} ${card.status} ${card.linkedTransfer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pendingCount = cards.filter(
    (card) => card.status === "PROCESSING"
  ).length;

  const approvedCount = cards.filter(
    (card) => card.status === "APPROVED"
  ).length;

  const completedCount = cards.filter(
    (card) => card.status === "COMPLETED"
  ).length;

  const totalVolume = cards.reduce(
    (sum, card) => sum + card.amount,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black text-emerald-400">
              Card Operations
            </h1>

            <p className="text-white/50 mt-2">
              Manage virtual card funding, settlement, and cardholder operations.
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cardholder, country, status..."
            className="w-full md:w-96 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <SummaryCard
            label="Processing"
            value={pendingCount}
            tone="text-blue-400"
          />

          <SummaryCard
            label="Approved"
            value={approvedCount}
            tone="text-yellow-300"
          />

          <SummaryCard
            label="Completed"
            value={completedCount}
            tone="text-emerald-400"
          />

          <SummaryCard
            label="Total Card Volume"
            value={`$${totalVolume.toLocaleString()}`}
            tone="text-white"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500/30 via-zinc-900 to-black border border-white/10 p-6 min-h-48">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-white/50">
                      ASIRA VIRTUAL CARD
                    </p>

                    <h2 className="text-xl font-black mt-2">
                      {card.type}
                    </h2>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${statusColor(
                      card.status
                    )}`}
                  >
                    {card.status}
                  </span>
                </div>

                <p className="text-2xl font-black tracking-widest mt-10">
                  {card.card}
                </p>

                <div className="flex justify-between mt-8 text-sm">
                  <div>
                    <p className="text-white/40 text-xs">
                      Cardholder
                    </p>
                    <p className="font-bold">
                      {card.cardholder}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-white/40 text-xs">
                      Balance
                    </p>
                    <p className="font-black text-emerald-400">
                      {card.currency}{" "}
                      {card.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <Info label="Country" value={card.country} />
                <Info label="Linked Transfer" value={card.linkedTransfer} />
                <Info label="Card Type" value={card.type} />
                <Info label="Status" value={card.status} />
              </div>

              <div className="flex gap-2 mt-5 flex-wrap">
                <button
                  onClick={() => updateStatus(card.id, "PROCESSING")}
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold"
                >
                  Processing
                </button>

                <button
                  onClick={() => updateStatus(card.id, "APPROVED")}
                  className="px-4 py-2 rounded-xl bg-yellow-500 text-black text-xs font-bold"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(card.id, "COMPLETED")}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                >
                  Complete
                </button>

                <button
                  onClick={() => updateStatus(card.id, "FROZEN")}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold"
                >
                  Freeze
                </button>

                <button
                  onClick={() => updateStatus(card.id, "REJECTED")}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/40">
            No card operations found.
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: any;
  tone: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-white/50 text-sm">{label}</p>
      <h2 className={`text-3xl font-black mt-2 ${tone}`}>
        {value}
      </h2>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-white/40 text-xs">{label}</p>
      <p className="font-bold mt-1">{value}</p>
    </div>
  );
}