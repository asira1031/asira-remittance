"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/client/dashboard", label: "Dashboard" },
  { href: "/client/payments", label: "Merchant Gateway" },
  { href: "/client/transfers", label: "Settlements" },
  { href: "/track", label: "Track Payment" },
  { href: "/kyc", label: "KYC Documents" },
  { href: "/client/api-keys", label: "API Keys" },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function checkClientAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");
      setAuthorized(true);
      setLoading(false);
    }

    checkClientAccess();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking client access...
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-72 min-h-screen border-r border-white/10 bg-white/5 p-6 hidden md:block">
        <h2 className="text-2xl font-black text-emerald-400">
          ASIRA
        </h2>

        <p className="text-white/40 text-xs mt-1">
          Business Portal
        </p>

        <nav className="space-y-2 mt-8">
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

        <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-xs text-white/40">
            Logged in as
          </p>

          <p className="text-sm font-bold break-words mt-1">
            {email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-4 rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-white"
        >
          Logout
        </button>
      </aside>

      <section className="flex-1">
        {children}
      </section>
    </div>
  );
}