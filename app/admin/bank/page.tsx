"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PayoutAccount = {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  country: string;
  currency: string;
  payout_rail: string;
  status: string;
  daily_limit: number;
  priority: number;
  is_primary: boolean;
  created_at: string;
};

export default function AdminBankPage() {
  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [currency, setCurrency] = useState("PHP");
  const [payoutRail, setPayoutRail] = useState("INSTAPAY");
  const [dailyLimit, setDailyLimit] = useState("");

  async function loadAccounts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("payout_accounts")
      .select("*")
      .order("priority", { ascending: true });

    if (!error && data) {
      setAccounts(data);
    }

    setLoading(false);
  }

  async function addAccount() {
    const { error } = await supabase.from("payout_accounts").insert([
      {
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        country,
        currency,
        payout_rail: payoutRail,
        status: "ACTIVE",
        daily_limit: Number(dailyLimit || 0),
        priority: accounts.length + 1,
        is_primary: accounts.length === 0,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setBankName("");
    setAccountName("");
    setAccountNumber("");
    setDailyLimit("");

    loadAccounts();
  }

  async function updateStatus(id: number, status: string) {
    await supabase.from("payout_accounts").update({ status }).eq("id", id);
    loadAccounts();
  }

  async function setPrimary(id: number) {
    await supabase
      .from("payout_accounts")
      .update({ is_primary: false });

    await supabase
      .from("payout_accounts")
      .update({ is_primary: true })
      .eq("id", id);

    loadAccounts();
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  const activeAccounts = accounts.filter((a) => a.status === "ACTIVE").length;
  const primaryAccount = accounts.find((a) => a.is_primary);
  const totalDailyLimit = accounts.reduce(
    (sum, account) => sum + Number(account.daily_limit || 0),
    0
  );

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Bank & Payout Routing
        </h1>

        <p className="text-white/50 mt-2">
          Manage multi-bank payout accounts, payout rails, routing priority, and partner settlement accounts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <Metric label="Total Accounts" value={accounts.length} color="text-blue-400" />
          <Metric label="Active Accounts" value={activeAccounts} color="text-emerald-400" />
          <Metric label="Primary Bank" value={primaryAccount?.bank_name || "None"} color="text-yellow-300" />
          <Metric label="Total Daily Limit" value={`${totalDailyLimit.toLocaleString()}`} color="text-purple-300" />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-5">
            Add Payout Account
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="Bank Name" value={bankName} setValue={setBankName} />
            <Input label="Account Name" value={accountName} setValue={setAccountName} />
            <Input label="Account Number" value={accountNumber} setValue={setAccountNumber} />
            <Input label="Daily Limit" value={dailyLimit} setValue={setDailyLimit} />

            <Select
              label="Country"
              value={country}
              setValue={setCountry}
              options={["Philippines", "Hong Kong", "Singapore", "Japan", "United Kingdom", "United States"]}
            />

            <Select
              label="Currency"
              value={currency}
              setValue={setCurrency}
              options={["PHP", "USD", "EUR", "GBP", "HKD", "SGD", "JPY"]}
            />

            <Select
              label="Payout Rail"
              value={payoutRail}
              setValue={setPayoutRail}
              options={["INSTAPAY", "PESONET", "SWIFT", "ACH", "SEPA", "CARD_SETTLEMENT", "BANK_API"]}
            />

            <div className="flex items-end">
              <button
                onClick={addAccount}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-black text-black"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-5">
            Connected Payout Accounts
          </h2>

          <div className="space-y-4">
            {loading && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
                Loading payout accounts...
              </div>
            )}

            {!loading && accounts.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center text-white/40">
                No payout accounts added yet.
              </div>
            )}

            {accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-2xl border border-white/10 bg-black/40 p-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <Info label="Bank" value={account.bank_name} />
                  <Info label="Account Name" value={account.account_name} />
                  <Info label="Account No." value={maskAccount(account.account_number)} />
                  <Info label="Country" value={account.country} />
                  <Info label="Currency" value={account.currency} />
                  <Info label="Rail" value={account.payout_rail} />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge value={account.status} />
                    {account.is_primary && <Badge value="PRIMARY ROUTE" />}
                    <Badge value={`LIMIT ${Number(account.daily_limit || 0).toLocaleString()}`} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPrimary(account.id)}
                      className="rounded-xl bg-yellow-500 px-4 py-2 text-xs font-black text-black"
                    >
                      Set Primary
                    </button>

                    <button
                      onClick={() => updateStatus(account.id, "ACTIVE")}
                      className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-black"
                    >
                      Active
                    </button>

                    <button
                      onClick={() => updateStatus(account.id, "PAUSED")}
                      className="rounded-xl bg-blue-500 px-4 py-2 text-xs font-black text-white"
                    >
                      Pause
                    </button>

                    <button
                      onClick={() => updateStatus(account.id, "DISABLED")}
                      className="rounded-xl bg-red-500 px-4 py-2 text-xs font-black text-white"
                    >
                      Disable
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, color }: { label: string; value: any; color: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-white/50 text-sm">{label}</p>
      <h2 className={`text-2xl font-black mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/50">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="font-bold break-words">{value || "N/A"}</p>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
      {value}
    </span>
  );
}

function maskAccount(accountNumber: string) {
  if (!accountNumber) return "N/A";

  const last4 = accountNumber.slice(-4);
  return `****${last4}`;
}