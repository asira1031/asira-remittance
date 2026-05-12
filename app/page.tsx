"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-black text-emerald-400">
            ASIRA
          </h1>

          <div className="flex items-center gap-8 text-sm font-medium text-white">
            <a href="/" className="hover:text-emerald-400 transition">
              Home
            </a>

            <a
              href="/client/dashboard"
              className="hover:text-emerald-400 transition"
            >
              Services
            </a>

            <a
              href="/admin/bank"
              className="hover:text-emerald-400 transition"
            >
              Partners
            </a>

            <a
              href="/client/transfers"
              className="hover:text-emerald-400 transition"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-20 items-center">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-emerald-400 text-sm">
            Global Digital Remittance
          </div>

          <h1 className="mt-10 text-7xl font-black leading-tight">
            ASIRA
            <br />
            <span className="text-emerald-400">
              GLOBAL REMIT
            </span>
          </h1>

          <p className="mt-10 text-xl leading-10 text-white/70 max-w-2xl">
            Fast international remittance platform with crypto-powered
            liquidity, secure payouts, partner integrations, and
            real-time transaction processing.
          </p>

          <div className="flex gap-4 mt-10">
            <a
              href="/remit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-black hover:opacity-90 transition"
            >
              Start Transfer
            </a>

            <a
              href="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-8 py-4 font-bold text-white hover:border-emerald-400 hover:text-emerald-400 transition"
            >
              Admin Portal
            </a>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="rounded-[40px] border border-emerald-500/20 bg-white/[0.03] p-8 shadow-2xl shadow-emerald-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/40 text-sm">
                Available Liquidity
              </p>

              <h2 className="text-6xl font-black mt-2">
                $12.8M
              </h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-2xl">
              A
            </div>
          </div>

          <div className="mt-10 space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/40 text-sm">
                Today's Transfers
              </p>

              <h3 className="text-5xl font-black text-emerald-400 mt-4">
                1,248
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/40 text-sm">
                Active Partners
              </p>

              <h3 className="text-5xl font-black text-emerald-400 mt-4">
                82
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/40 text-sm">
                Countries Supported
              </p>

              <h3 className="text-5xl font-black text-emerald-400 mt-4">
                34
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/40 text-sm">
                Processing Volume
              </p>

              <h3 className="text-5xl font-black text-emerald-400 mt-4">
                $48.2M
              </h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}