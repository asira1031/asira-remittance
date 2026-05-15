"use client";

import Link from "next/link";

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
            <Link
              href="/"
              className="hover:text-emerald-400 transition"
            >
              Home
            </Link>

            <Link
              href="#services"
              className="hover:text-emerald-400 transition"
            >
              Services
            </Link>

            <Link
              href="#partners"
              className="hover:text-emerald-400 transition"
            >
              Partners
            </Link>

            <Link
              href="#contact"
              className="hover:text-emerald-400 transition"
            >
              Contact
            </Link>

            <Link
              href="/admin"
              className="hover:text-emerald-400 transition"
            >
              Admin Login
            </Link>
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
            <Link
              href="/remit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-black hover:opacity-90 transition"
            >
              Start Transfer
            </Link>
<Link
  href="/merchant-register"
  className="inline-flex items-center justify-center rounded-2xl border border-emerald-500/40 px-8 py-4 font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition"
>
  Register as Merchant
</Link>
            <Link
  href="/merchant-login"
  className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-8 py-4 font-bold text-white hover:border-emerald-400 hover:text-emerald-400 transition"
>
  Merchant Portal
</Link>
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
            <StatCard
              title="Today's Transfers"
              value="1,248"
            />

            <StatCard
              title="Active Partners"
              value="82"
            />

            <StatCard
              title="Countries Supported"
              value="34"
            />

            <StatCard
              title="Processing Volume"
              value="$48.2M"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="max-w-7xl mx-auto px-8 py-20"
      >
        <h2 className="text-5xl font-black text-emerald-400">
          Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <ServiceCard
            title="Global Remittance"
            description="Fast international transfer processing with secure payout systems."
          />

          <ServiceCard
            title="Merchant Gateway"
            description="Hosted payment links for bank, card, international, and crypto settlement."
          />

          <ServiceCard
            title="Enterprise Settlement"
            description="Corporate liquidity routing and partner payout infrastructure."
          />
        </div>
      </section>

      {/* PARTNERS */}
      <section
        id="partners"
        className="max-w-7xl mx-auto px-8 py-20"
      >
        <h2 className="text-5xl font-black text-emerald-400">
          Partners
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <PartnerCard name="Digital Banking" />
          <PartnerCard name="Global Settlement" />
          <PartnerCard name="Crypto Liquidity" />
          <PartnerCard name="Merchant Solutions" />
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="max-w-7xl mx-auto px-8 py-20"
      >
        <h2 className="text-5xl font-black text-emerald-400">
          Contact
        </h2>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 max-w-3xl">
          <p className="text-white/70 text-lg leading-9">
            ASIRA Global Remit provides secure international
            remittance and merchant settlement infrastructure
            for global partners, financial institutions, and
            enterprise clients.
          </p>

          <div className="mt-8 space-y-3 text-white/50">
            <p>Email: support@asiraglobalremit.com</p>
            <p>Global Operations & Settlement Support</p>
            <p>24/7 Transaction Monitoring</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-white/40 text-sm">
        {title}
      </p>

      <h3 className="text-5xl font-black text-emerald-400 mt-4">
        {value}
      </h3>
    </div>
  );
}

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
      <h3 className="text-2xl font-black text-white">
        {title}
      </h3>

      <p className="mt-5 text-white/60 leading-8">
        {description}
      </p>
    </div>
  );
}

function PartnerCard({
  name,
}: {
  name: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 flex items-center justify-center text-center text-xl font-bold text-white/70">
      {name}
    </div>
  );
}