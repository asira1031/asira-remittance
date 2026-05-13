"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

const links = [
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.log(error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/50">Checking admin access...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 min-h-screen border-r border-white/10 bg-white/5 p-6 hidden md:block">
        <h2 className="text-2xl font-black text-emerald-400 mb-8">
          ASIRA
        </h2>

        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl px-4 py-3 text-white/70 hover:bg-emerald-500 hover:text-black font-bold transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="flex-1">{children}</section>
    </div>
  );
}