"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Merchant = {
  id: string;
  business_name: string;
  business_type: string | null;
  country: string | null;
  business_address: string | null;
  website: string | null;
  contact_person: string | null;
  email: string;
  phone: string | null;
  settlement_method: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  swift_bic: string | null;
  crypto_wallet: string | null;
  crypto_network: string | null;
  status: string;
  created_at: string;
};

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMerchants() {
    setLoading(true);

    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setMerchants(data || []);
    setLoading(false);
  }

  async function updateMerchantStatus(id: string, status: string) {
    const { error } = await supabase
      .from("merchants")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadMerchants();
  }

  useEffect(() => {
    loadMerchants();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-emerald-400">
          Merchant Applications
        </h1>

        <p className="mt-3 text-white/50">
          Review, approve, or reject merchant registration requests.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-black">Applications</h2>

          {loading && (
            <p className="mt-8 text-white/50">Loading merchants...</p>
          )}

          {!loading && merchants.length === 0 && (
            <p className="mt-8 text-white/50">
              No merchant applications yet.
            </p>
          )}

          <div className="mt-8 space-y-6">
            {merchants.map((merchant) => (
              <div
                key={merchant.id}
                className="rounded-3xl border border-white/10 bg-black/40 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-emerald-400">
                      {merchant.business_name}
                    </h3>

                    <p className="mt-2 text-white/50">
                      {merchant.business_type || "Business type not provided"} •{" "}
                      {merchant.country || "Country not provided"}
                    </p>

                    <p className="mt-2 text-white/60">
                      Contact: {merchant.contact_person || "N/A"} —{" "}
                      {merchant.email}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-xs font-black ${
                      merchant.status === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : merchant.status === "REJECTED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {merchant.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <Info label="Website" value={merchant.website} />
                  <Info label="Phone" value={merchant.phone} />
                  <Info label="Address" value={merchant.business_address} />

                  <Info label="Settlement" value={merchant.settlement_method} />
                  <Info label="Bank" value={merchant.bank_name} />
                  <Info label="Account Name" value={merchant.account_name} />

                  <Info label="Account / IBAN" value={merchant.account_number} />
                  <Info label="SWIFT / BIC" value={merchant.swift_bic} />
                  <Info
                    label="Crypto"
                    value={
                      merchant.crypto_wallet
                        ? `${merchant.crypto_wallet} (${merchant.crypto_network || "Network N/A"})`
                        : null
                    }
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => updateMerchantStatus(merchant.id, "APPROVED")}
                    className="rounded-2xl bg-emerald-500 px-5 py-3 font-black text-black"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateMerchantStatus(merchant.id, "REJECTED")}
                    className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      updateMerchantStatus(merchant.id, "PENDING_REVIEW")
                    }
                    className="rounded-2xl border border-white/10 px-5 py-3 font-black text-white"
                  >
                    Mark Pending
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-white/40">{label}</p>
      <p className="mt-1 break-words font-bold text-white/80">
        {value || "N/A"}
      </p>
    </div>
  );
}