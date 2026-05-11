
import StatsCard from "@/components/StatsCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-widest text-emerald-400">
          ASIRA
        </h1>

        <div className="flex gap-6 text-sm text-white/70">
          <button>Home</button>
          <button>Services</button>
          <button>Partners</button>
          <button>Contact</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm mb-6">
            Global Digital Remittance
          </div>

          <h1 className="text-6xl font-black leading-tight">
            ASIRA
            <span className="block text-emerald-400">
              GLOBAL REMIT
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/60 leading-8">
            Fast international remittance platform with crypto-powered liquidity,
            secure payouts, partner integrations, and real-time transaction
            processing.
          </p>

          <div className="flex gap-4 mt-10">
            <button className="px-6 py-4 rounded-2xl bg-emerald-500 text-black font-bold hover:scale-105 transition">
              Start Transfer
            </button>

            <button className="px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/5 transition">
              Admin Portal
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="rounded-3xl border border-emerald-500/20 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-500/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-white/50 text-sm">
                Available Liquidity
              </p>

              <h2 className="text-4xl font-bold mt-2">
                $12.8M
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black">
              A
            </div>
          </div>

          <div className="grid gap-4">
            <StatsCard
              title="Today's Transfers"
              value="1,248"
            />

            <StatsCard
              title="Active Partners"
              value="82"
            />

            <StatsCard
              title="Countries Supported"
              value="34"
            />

            <StatsCard
              title="Processing Volume"
              value="$48.2M"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

