"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MerchantRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    business_name: "",
    business_type: "",
    country: "",
    business_address: "",
    website: "",
    contact_person: "",
    email: "",
    phone: "",
    settlement_method: "Bank",
    bank_name: "",
    account_name: "",
    account_number: "",
    swift_bic: "",
    crypto_wallet: "",
    crypto_network: "",
  });

  function updateField(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submitRegistration() {
    setMessage("");

    if (!form.business_name || !form.email || !form.contact_person) {
      setMessage("❌ Please complete business name, contact person, and email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("merchants").insert([
      {
        ...form,
        status: "PENDING_REVIEW",
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage("✅ Merchant registration submitted for admin review.");

    setForm({
      business_name: "",
      business_type: "",
      country: "",
      business_address: "",
      website: "",
      contact_person: "",
      email: "",
      phone: "",
      settlement_method: "Bank",
      bank_name: "",
      account_name: "",
      account_number: "",
      swift_bic: "",
      crypto_wallet: "",
      crypto_network: "",
    });
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-emerald-400 font-bold">
          ← Back to Home
        </Link>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-5xl font-black text-emerald-400">
            Merchant Registration
          </h1>

          <p className="mt-3 text-white/50">
            Apply as an ASIRA merchant to create hosted payment links and receive settlements.
          </p>

          <div className="mt-10">
            <h2 className="text-2xl font-black">Business Information</h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Business / Merchant Name" value={form.business_name} onChange={(v) => updateField("business_name", v)} />
              <Input label="Business Type" value={form.business_type} onChange={(v) => updateField("business_type", v)} />
              <Input label="Country" value={form.country} onChange={(v) => updateField("country", v)} />
              <Input label="Website / Social Page" value={form.website} onChange={(v) => updateField("website", v)} />
              <Input label="Contact Person" value={form.contact_person} onChange={(v) => updateField("contact_person", v)} />
              <Input label="Email" value={form.email} onChange={(v) => updateField("email", v)} />
              <Input label="Phone Number" value={form.phone} onChange={(v) => updateField("phone", v)} />

              <div className="md:col-span-2">
                <Input label="Business Address" value={form.business_address} onChange={(v) => updateField("business_address", v)} />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-black">Settlement Information</h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-white/50">Settlement Method</label>
                <select
                  value={form.settlement_method}
                  onChange={(e) => updateField("settlement_method", e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
                >
                  <option>Card</option>
<option>Bank</option>
<option>SWIFT</option>
<option>Crypto</option>
                </select>
              </div>

              <Input label="Bank Name" value={form.bank_name} onChange={(v) => updateField("bank_name", v)} />
              <Input label="Account Name" value={form.account_name} onChange={(v) => updateField("account_name", v)} />
              <Input label="Account Number / IBAN" value={form.account_number} onChange={(v) => updateField("account_number", v)} />
              <Input label="SWIFT / BIC" value={form.swift_bic} onChange={(v) => updateField("swift_bic", v)} />
              <Input label="Crypto Wallet Address" value={form.crypto_wallet} onChange={(v) => updateField("crypto_wallet", v)} />
              <Input label="Crypto Network" value={form.crypto_network} onChange={(v) => updateField("crypto_network", v)} />
            </div>
          </div>

          {message && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5 text-white/80">
              {message}
            </div>
          )}

          <button
            onClick={submitRegistration}
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-emerald-500 py-5 font-black text-black disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Merchant Registration"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
      />
    </div>
  );
}