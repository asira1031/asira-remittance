"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MerchantLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleMerchantLogin() {
    setMessage("");

    if (!email) {
      setMessage("❌ Please enter your merchant email.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .eq("email", email)
      .eq("status", "APPROVED")
      .maybeSingle();

    setLoading(false);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    if (!data) {
      setMessage("❌ Merchant account not approved or not found.");
      return;
    }

    localStorage.setItem("merchant_email", data.email);
    localStorage.setItem("merchant_id", data.id);
    localStorage.setItem("merchant_name", data.business_name);

    router.push("/merchant/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <Link href="/" className="text-emerald-400 font-bold">
          ← Back to Home
        </Link>

        <h1 className="mt-8 text-4xl font-black text-emerald-400">
          Merchant Login
        </h1>

        <p className="mt-2 text-white/50">
          Access your approved ASIRA merchant dashboard.
        </p>

        <label className="mt-8 block text-sm text-white/50">
          Merchant Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="merchant@email.com"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
        />

        {message && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4 text-white/70">
            {message}
          </div>
        )}

        <button
          onClick={handleMerchantLogin}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-emerald-500 py-4 font-black text-black disabled:opacity-50"
        >
          {loading ? "Checking..." : "Login as Merchant"}
        </button>

        <Link
          href="/merchant-register"
          className="mt-5 block text-center text-sm font-bold text-emerald-400"
        >
          Register as Merchant
        </Link>
      </div>
    </main>
  );
}