"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Snapshot = {
  generatedAt: string;
  mode: string;
  summary: { requestsPerMinute: number; successRate: number; failureRate: number; p95LatencyMs: number; availability: number };
  networks: Array<{ name: string; status: string; share: number; requests: number; successRate: number; p95LatencyMs: number }>;
  series: Array<{ time: string; visa: number; mastercard: number }>;
  errors: Array<{ code: string; label: string; count: number; share: number }>;
  transactions: Array<{ id: string; network: string; endpoint: string; status: string; latencyMs: number; code: string; timestamp: string }>;
};

const ranges = ["2 hours", "6 hours", "24 hours"];

export default function NetworkTrafficPage() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [range, setRange] = useState("2 hours");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/observability/card-networks", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load network telemetry");
      setData(await response.json());
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Telemetry unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = window.setInterval(load, 10_000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, load]);

  const chart = useMemo(() => {
    if (!data) return { visa: "", mastercard: "", max: 1 };
    const max = Math.max(...data.series.flatMap((point) => [point.visa, point.mastercard]));
    const points = (key: "visa" | "mastercard") => data.series.map((point, index) => {
      const x = (index / (data.series.length - 1)) * 100;
      const y = 92 - (point[key] / max) * 78;
      return `${x},${y}`;
    }).join(" ");
    return { visa: points("visa"), mastercard: points("mastercard"), max };
  }, [data]);

  return (
    <main className="min-h-screen px-5 py-7 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">Card network observability</p>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">Demo telemetry</span>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Visa & Mastercard traffic</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">Live health, request throughput, response latency, errors, and transaction outcomes across Asira&apos;s card rails.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-xl border border-white/10 bg-[#0b1713] px-4 py-2.5 text-sm outline-none">
              {ranges.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button onClick={() => setAutoRefresh((value) => !value)} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${autoRefresh ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-white/50"}`}>
              <span className={`mr-2 inline-block h-2 w-2 rounded-full ${autoRefresh ? "animate-pulse bg-emerald-400" : "bg-white/30"}`} />{autoRefresh ? "Live · 10s" : "Paused"}
            </button>
            <button onClick={load} className="rounded-xl bg-[#62e6a7] px-4 py-2.5 text-sm font-black text-[#07100d]">Refresh</button>
          </div>
        </header>

        {error && <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Metric label="Requests / min" value={loading ? "—" : data?.summary.requestsPerMinute.toLocaleString()} detail="Current throughput" tone="emerald" />
          <Metric label="Success rate" value={loading ? "—" : `${data?.summary.successRate}%`} detail={`${data?.summary.failureRate}% failed`} tone="emerald" />
          <Metric label="P95 latency" value={loading ? "—" : `${data?.summary.p95LatencyMs} ms`} detail="Across all endpoints" tone="blue" />
          <Metric label="Availability" value={loading ? "—" : `${data?.summary.availability}%`} detail="Network uptime" tone="emerald" />
          <Metric label="Network health" value={loading ? "—" : "Operational"} detail="2 of 2 rails online" tone="emerald" />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
          <div className="glass-panel overflow-hidden rounded-3xl p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h2 className="text-xl font-black">Request volume</h2><p className="mt-1 text-xs text-white/40">5-minute buckets · selected range: {range}</p></div>
              <div className="flex gap-4 text-xs font-semibold"><Legend color="#62e6a7" label="Visa" /><Legend color="#63a7ff" label="Mastercard" /></div>
            </div>
            <div className="mt-7 h-72 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-label="Visa and Mastercard request volume line chart">
                {[18, 42, 66, 90].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,.08)" strokeWidth=".25" />)}
                <polyline points={chart.visa} fill="none" stroke="#62e6a7" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                <polyline points={chart.mastercard} fill="none" stroke="#63a7ff" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5 sm:p-7">
            <h2 className="text-xl font-black">Network distribution</h2>
            <p className="mt-1 text-xs text-white/40">Last 24-hour request share</p>
            <div className="mt-7 space-y-6">
              {data?.networks.map((network) => (
                <div key={network.name}>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-3"><NetworkMark name={network.name} /><div><p className="font-black">{network.name}</p><p className="text-xs text-emerald-300">● {network.status}</p></div></div><p className="text-2xl font-black">{network.share}%</p></div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full ${network.name === "Visa" ? "bg-[#62e6a7]" : "bg-[#63a7ff]"}`} style={{ width: `${network.share}%` }} /></div>
                  <div className="mt-3 grid grid-cols-3 text-xs"><Small label="Requests" value={network.requests.toLocaleString()} /><Small label="Success" value={`${network.successRate}%`} /><Small label="P95" value={`${network.p95LatencyMs} ms`} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.65fr]">
          <div className="glass-panel rounded-3xl p-5 sm:p-7">
            <h2 className="text-xl font-black">Top API errors</h2><p className="mt-1 text-xs text-white/40">Grouped by response code</p>
            <div className="mt-6 space-y-5">{data?.errors.map((item) => <div key={item.code}><div className="flex justify-between text-sm"><span><b className="mr-2 text-red-300">{item.code}</b>{item.label}</span><span className="font-bold">{item.count}</span></div><div className="mt-2 h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-red-400/70" style={{ width: `${item.share}%` }} /></div></div>)}</div>
          </div>
          <div className="glass-panel overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between p-5 sm:p-7"><div><h2 className="text-xl font-black">Live transaction stream</h2><p className="mt-1 text-xs text-white/40">No cardholder or full PAN data is exposed</p></div><p className="text-xs text-white/35">Updated {data ? new Date(data.generatedAt).toLocaleTimeString() : "—"}</p></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-y border-white/[0.07] bg-black/20 text-[10px] uppercase tracking-widest text-white/35"><tr><th className="px-6 py-3">Reference</th><th>Network</th><th>Endpoint</th><th>Status</th><th>Latency</th><th>Code</th></tr></thead><tbody>{data?.transactions.map((tx) => <tr key={tx.id} className="border-b border-white/[0.06]"><td className="px-6 py-4 font-mono text-xs">{tx.id}</td><td><span className="font-bold">{tx.network}</span></td><td className="font-mono text-xs text-white/55">{tx.endpoint}</td><td><Status value={tx.status} /></td><td>{tx.latencyMs} ms</td><td className={tx.code === "200" ? "text-emerald-300" : "text-red-300"}>{tx.code}</td></tr>)}</tbody></table></div>
          </div>
        </section>
        <p className="mt-5 text-center text-[11px] text-white/25">Simulation mode · Replace the observability route&apos;s data source with processor or gateway telemetry before production use.</p>
      </div>
    </main>
  );
}

function Metric({ label, value, detail, tone }: { label: string; value?: string | number; detail: string; tone: string }) { return <div className="premium-card rounded-2xl p-5"><p className="text-xs font-semibold text-white/40">{label}</p><p className={`mt-3 text-2xl font-black ${tone === "blue" ? "text-blue-300" : "text-emerald-300"}`}>{value}</p><p className="mt-2 text-[11px] text-white/30">{detail}</p></div>; }
function Legend({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: color }} />{label}</span>; }
function NetworkMark({ name }: { name: string }) { return <span className={`flex h-10 w-14 items-center justify-center rounded-lg text-[11px] font-black italic ${name === "Visa" ? "bg-[#142e70] text-white" : "bg-[#252525] text-white"}`}>{name === "Visa" ? "VISA" : "MC"}</span>; }
function Small({ label, value }: { label: string; value: string }) { return <div><p className="text-white/30">{label}</p><p className="mt-1 font-bold text-white/75">{value}</p></div>; }
function Status({ value }: { value: string }) { const ok = value === "Approved"; const waiting = value === "Processing"; return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${ok ? "bg-emerald-400/10 text-emerald-300" : waiting ? "bg-blue-400/10 text-blue-300" : "bg-red-400/10 text-red-300"}`}>{value}</span>; }
