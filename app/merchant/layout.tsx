"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/merchant/dashboard", label: "Dashboard" },
  { href: "/merchant/payments", label: "Payment Links" },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [merchantName, setMerchantName] = useState("Merchant");
  const [merchantEmail, setMerchantEmail] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const email = localStorage.getItem("merchant_email");
      if (!email) {
        router.replace("/merchant-login");
        return;
      }
      setMerchantEmail(email);
      setMerchantName(localStorage.getItem("merchant_name") || "Merchant");
      setChecking(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  function logout() {
    localStorage.removeItem("merchant_email");
    localStorage.removeItem("merchant_id");
    localStorage.removeItem("merchant_name");
    router.replace("/merchant-login");
  }

  if (checking) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center text-white">
        <p className="text-sm text-white/45">Checking merchant access…</p>
      </main>
    );
  }

  return (
    <div className="app-shell min-h-screen text-white md:flex">
      <aside className="border-b border-white/[0.08] bg-[#08130f]/95 p-5 md:sticky md:top-0 md:h-screen md:w-72 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between md:block">
          <Link href="/merchant/dashboard" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#62e6a7] font-black text-[#07100d]">A</span>
            <span>
              <span className="block text-sm font-bold tracking-[0.16em]">ASIRA</span>
              <span className="block text-[9px] uppercase tracking-[0.18em] text-white/35">Merchant portal</span>
            </span>
          </Link>
          <button onClick={logout} className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-300 md:hidden">
            Logout
          </button>
        </div>

        <div className="mt-6 hidden rounded-2xl border border-white/[0.08] bg-black/20 p-4 md:block">
          <p className="text-xs text-white/35">Signed in as</p>
          <p className="mt-1 font-semibold">{merchantName}</p>
          <p className="mt-1 break-all text-xs text-white/35">{merchantEmail}</p>
        </div>

        <nav className="mt-5 flex gap-2 md:mt-6 md:block md:space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                  active
                    ? "bg-[#62e6a7] text-[#07100d]"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-8 hidden w-full rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm font-semibold text-red-300 md:block"
        >
          Merchant logout
        </button>
      </aside>

      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
