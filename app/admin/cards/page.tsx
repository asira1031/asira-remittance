"use client";

const cards = [
  {
    id: 1,
    cardholder: "Juan Dela Cruz",
    card: "**** **** **** 3459",
    type: "VISA",
    country: "Philippines",
    amount: 1000,
    status: "PROCESSING",
  },
  {
    id: 2,
    cardholder: "Larry Quirante",
    card: "**** **** **** 8821",
    type: "MASTERCARD",
    country: "Korea",
    amount: 2500,
    status: "APPROVED",
  },
  {
    id: 3,
    cardholder: "Aaron Lee",
    card: "**** **** **** 1148",
    type: "VISA",
    country: "Japan",
    amount: 5000,
    status: "COMPLETED",
  },
];

export default function AdminCardsPage() {
  function statusColor(status: string) {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-400";

      case "PROCESSING":
        return "text-blue-400";

      case "APPROVED":
        return "text-yellow-400";

      default:
        return "text-white";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Cards
        </h1>

        <p className="text-white/50 mt-2">
          Live card funding and settlement operations monitoring.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">
              Pending Card Requests
            </p>

            <h2 className="text-3xl font-black text-yellow-400 mt-2">
              1
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">
              Processing Cards
            </p>

            <h2 className="text-3xl font-black text-blue-400 mt-2">
              1
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">
              Completed Settlements
            </p>

            <h2 className="text-3xl font-black text-emerald-400 mt-2">
              1
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-5">
            Card Operations Queue
          </h2>

          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-white/10 bg-black/40 p-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <p className="text-white/40 text-xs">
                      Cardholder
                    </p>

                    <p className="font-bold">
                      {card.cardholder}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs">
                      Card Number
                    </p>

                    <p className="font-bold">{card.card}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs">
                      Card Type
                    </p>

                    <p className="font-bold">{card.type}</p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs">
                      Country
                    </p>

                    <p className="font-bold">
                      {card.country}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/40 text-xs">
                      Amount
                    </p>

                    <p className="font-black text-emerald-400">
                      $
                      {card.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-black ${statusColor(
                        card.status
                      )}`}
                    >
                      {card.status}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-5 flex-wrap">
                  <button className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold">
                    Processing
                  </button>

                  <button className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold">
                    Approve
                  </button>

                  <button className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold">
                    Complete
                  </button>

                  <button className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}