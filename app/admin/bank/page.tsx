"use client";

export default function AdminBankPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-emerald-400">
          Admin Bank
        </h1>

        <p className="text-white/50 mt-2">
          Monitor banking APIs, OAuth connections, transfer rails, and financial network status.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">UnionBank OAuth</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">
              CONNECTED
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Sandbox Environment</p>
            <h2 className="text-2xl font-black text-yellow-400 mt-2">
              ACTIVE
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">Transfer Rails</p>
            <h2 className="text-2xl font-black text-blue-400 mt-2">
              ONLINE
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/50 text-sm">API Health</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-2">
              HEALTHY
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">
            Connected Banking Services
          </h2>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">UnionBank API</p>
                <p className="text-white/40 text-sm">
                  OAuth2 Banking Integration
                </p>
              </div>

              <div className="text-right">
                <p className="text-emerald-400 font-black">CONNECTED</p>
                <p className="text-white/30 text-xs">
                  Sandbox Environment
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">SWIFT Network</p>
                <p className="text-white/40 text-sm">
                  International Transfer Routing
                </p>
              </div>

              <div className="text-right">
                <p className="text-yellow-400 font-black">READY</p>
                <p className="text-white/30 text-xs">
                  Pending Integration
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Card Processing</p>
                <p className="text-white/40 text-sm">
                  Visa / Mastercard Settlement Rails
                </p>
              </div>

              <div className="text-right">
                <p className="text-yellow-400 font-black">READY</p>
                <p className="text-white/30 text-xs">
                  Pending Gateway Connection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}