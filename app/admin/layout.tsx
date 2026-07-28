"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/transfers", label: "Transfers" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/merchant", label: "Merchant" },
  { href: "/admin/merchants", label: "Merchants" },
  { href: "/admin/swift", label: "SWIFT" },
  { href: "/admin/cards", label: "Cards" },
  { href: "/admin/bank", label: "Bank" },
  { href: "/admin/compliance", label: "Compliance" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [checking, setChecking] = useState(!isLoginPage);
  const [authorized, setAuthorized] = useState(isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      const timer = window.setTimeout(() => {
        setAuthorized(true);
        setChecking(false);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(async () => {
      const localAdmin = localStorage.getItem("admin_logged_in") === "yes";
      if (localAdmin) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setAuthorized(true);
      } else {
        router.replace("/admin/login");
      }
      setChecking(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isLoginPage, router]);

  async function logout() {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_email");
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (isLoginPage) return children;

  if (checking) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center text-white">
        <p className="text-sm text-white/45">Checking admin access…</p>
      </main>
    );
  }

  if (!authorized) return null;

  return (
    <div className="app-shell min-h-screen text-white md:flex">
      <aside className="border-b border-white/[0.08] bg-[#08130f]/95 p-5 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r">
        <div className="flex items-center justify-between md:block">
          <Link href="/admin" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#62e6a7] font-black text-[#07100d]">A</span>
            <span>
              <span className="block text-sm font-bold tracking-[0.16em]">ASIRA</span>
              <span className="block text-[9px] uppercase tracking-[0.18em] text-white/35">Admin console</span>
            </span>
          </Link>
          <button onClick={logout} className="rounded-xl border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-300 md:hidden">
            Logout
          </button>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 md:mt-8 md:block md:space-y-1 md:overflow-visible">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block shrink-0 rounded-xl px-4 py-3 text-sm font-semibold ${
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
          className="mt-8 hidden w-full rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-400/10 md:block"
        >
          Admin logout
        </button>
      </aside>

      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
