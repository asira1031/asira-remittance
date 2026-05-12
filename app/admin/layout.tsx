import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/transfers", label: "Transfers" },
  { href: "/admin/payouts", label: "Payouts" },
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