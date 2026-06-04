"use client";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-black px-8 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Settings
        </h1>

        <p className="mt-2 text-white/50">
          Configure environment, banking APIs, fees, payout limits, security
          controls, and platform operations.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <StatusCard label="Environment" value="UAT" color="text-yellow-400" />
          <StatusCard label="Transfer Controls" value="READY" color="text-blue-400" />
          <StatusCard label="Security Controls" value="ACTIVE" color="text-emerald-400" />
          <StatusCard label="System Mode" value="ACTIVE" color="text-emerald-400" />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-black">
            Platform Configuration
          </h2>

          <div className="space-y-4">
            <ConfigRow
              title="Environment"
              description="Current API mode for banking integrations"
              value="UAT"
              color="text-yellow-400"
            />

            <ConfigRow
              title="Transfer Controls"
              description="Limits, payout routing, and transaction rules"
              value="READY"
              color="text-blue-400"
            />

            <ConfigRow
              title="Security Controls"
              description="API protection and admin access controls"
              value="ACTIVE"
              color="text-emerald-400"
            />

            <ConfigRow
              title="System Mode"
              description="Platform operational readiness"
              value="ACTIVE"
              color="text-emerald-400"
            />

            <ConfigRow
              title="UnionBank API"
              description="Open Banking Integration Layer"
              value="CONNECTED"
              color="text-emerald-400"
            />

            <ConfigRow
              title="Netbank API"
              description="Banking Infrastructure Integration"
              value="CONNECTED"
              color="text-emerald-400"
            />

            <ConfigRow
              title="Zenus Bank API"
              description="ACH, FedWire, SWIFT, USD Accounts & Virtual Banking"
              value="CONNECTED"
              color="text-emerald-400"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-white/50">{label}</p>
      <h2 className={`mt-2 text-2xl font-black ${color}`}>{value}</h2>
    </div>
  );
}

function ConfigRow({
  title,
  description,
  value,
  color,
}: {
  title: string;
  description: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-5">
      <div>
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm text-white/40">{description}</p>
      </div>
      <p className={`font-black ${color}`}>{value}</p>
    </div>
  );
}