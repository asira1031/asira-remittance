import Link from "next/link";

const rails = [
  { name: "QR Ph", detail: "Scan-to-pay", icon: "▦" },
  { name: "Tap to Pay", detail: "NFC contactless", icon: ")))" },
  { name: "SoftPOS", detail: "Phone as terminal", icon: "◇" },
  { name: "Global Rails", detail: "Bank, card & SWIFT", icon: "↗" },
];

const benefits = [
  {
    number: "01",
    title: "One intelligent checkout",
    copy: "Give customers a familiar, focused way to pay across local and international rails.",
  },
  {
    number: "02",
    title: "Made for movement",
    copy: "Track every transfer from initiation through settlement with clear status visibility.",
  },
  {
    number: "03",
    title: "Built with trust",
    copy: "Provider-verified payment states and compliance-ready transaction records.",
  },
];

export default function HomePage() {
  return (
    <main className="app-shell overflow-hidden text-white">
      <header className="relative z-20 border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Brand />

          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <Link href="#solutions" className="hover:text-white">Solutions</Link>
            <Link href="#payments" className="hover:text-white">Payments</Link>
            <Link href="#security" className="hover:text-white">Security</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/merchant-login"
              className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/remit"
              className="rounded-full bg-[#62e6a7] px-5 py-2.5 text-sm font-bold text-[#07100d] shadow-[0_8px_28px_rgba(98,230,167,0.18)] hover:bg-[#7aefb7]"
            >
              Send money
            </Link>
          </div>
        </div>
      </header>

      <section className="noise relative">
        <div className="absolute -left-40 top-20 h-[34rem] w-[34rem] rounded-full bg-emerald-400/[0.06] blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pb-28">
          <div className="relative z-10">
            <p className="eyebrow">Borderless money, thoughtfully built</p>
            <h1 className="mt-7 max-w-3xl text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[5.6rem]">
              Move money with
              <span className="block bg-gradient-to-r from-[#62e6a7] via-[#a7f2cf] to-[#d7bb78] bg-clip-text text-transparent">
                quiet confidence.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              Global remittance and modern merchant payments in one secure,
              beautifully simple platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/remit"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-[#07100d] hover:bg-[#eaf4ef]"
              >
                Start a transfer <span aria-hidden>↗</span>
              </Link>
              <Link
                href="/merchant-register"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.035] px-7 py-4 font-semibold text-white/80 hover:border-white/25 hover:bg-white/[0.07]"
              >
                Become a merchant
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-white/38">
              <span>✓ Secure checkout</span>
              <span>✓ Real-time tracking</span>
              <span>✓ Multi-rail settlement</span>
            </div>
          </div>

          <PaymentPreview />
        </div>
      </section>

      <section id="payments" className="border-y border-white/[0.07] bg-black/10">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Ways to pay
          </p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
            {rails.map((rail) => (
              <div key={rail.name} className="bg-[#09130f] p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-sm text-[#62e6a7]">
                    {rail.icon}
                  </span>
                  <div>
                    <p className="font-semibold">{rail.name}</p>
                    <p className="mt-0.5 text-xs text-white/38">{rail.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Designed around people</p>
            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Complex rails. A remarkably simple experience.
            </h2>
          </div>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {benefits.map((benefit) => (
              <article key={benefit.number} className="grid gap-5 py-8 sm:grid-cols-[4rem_1fr]">
                <span className="font-mono text-xs text-[#d7bb78]">{benefit.number}</span>
                <div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-3 max-w-xl leading-7 text-white/45">{benefit.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#62e6a7]/[0.08] blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">ASIRA for business</p>
              <h2 className="mt-6 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Accept more ways to pay. Manage everything in one place.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-white/48">
                Create payment links, monitor transactions, and prepare for
                QR Ph, contactless NFC, and SoftPOS acceptance.
              </p>
            </div>
            <Link
              href="/merchant-register"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#62e6a7]/30 bg-[#62e6a7]/10 px-7 py-4 font-semibold text-[#8ef0c1] hover:bg-[#62e6a7]/15"
            >
              Open merchant account
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Brand compact />
          <p>Secure global operations &amp; transaction monitoring</p>
          <p>© 2026 ASIRA Global Remit</p>
        </div>
      </footer>
    </main>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className={`${compact ? "h-8 w-8" : "h-9 w-9"} flex items-center justify-center rounded-xl bg-[#62e6a7] font-black text-[#07100d]`}>
        A
      </span>
      <span>
        <span className="block text-sm font-bold tracking-[0.18em] text-white">ASIRA</span>
        {!compact && <span className="block text-[9px] uppercase tracking-[0.2em] text-white/35">Global Remit</span>}
      </span>
    </Link>
  );
}

function PaymentPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-[#62e6a7]/10 to-[#d7bb78]/5 blur-2xl" />
      <div className="glass-panel relative rounded-[2rem] p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">Send preview</p>
            <p className="mt-2 font-semibold">Manila → Singapore</p>
          </div>
          <span className="rounded-full border border-[#62e6a7]/20 bg-[#62e6a7]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7becb7]">
            Protected
          </span>
        </div>

        <div className="py-8 text-center">
          <p className="text-sm text-white/38">Your recipient gets</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">S$ 2,418.32</p>
          <p className="mt-3 text-sm text-[#62e6a7]">1 PHP = 0.0237 SGD</p>
        </div>

        <div className="premium-card rounded-2xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/42">You send</span>
            <span className="font-semibold">₱102,000.00</span>
          </div>
          <div className="my-4 h-px bg-white/[0.07]" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/42">Transfer fee</span>
            <span className="font-semibold">₱510.00</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#62e6a7] p-4 text-[#07100d]">
          <div>
            <p className="text-xs font-semibold opacity-60">Estimated arrival</p>
            <p className="mt-1 font-bold">Within minutes</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-xl">→</span>
        </div>
      </div>
    </div>
  );
}
