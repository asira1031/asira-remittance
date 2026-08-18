export const dynamic = "force-dynamic";

type Network = "Visa" | "Mastercard";
type Status = "Approved" | "Declined" | "Processing" | "Reversed";

const endpoints = [
  "/v1/payments/authorize",
  "/v1/payments/capture",
  "/v1/payments/refund",
  "/v1/3ds/authenticate",
];

function seeded(seed: number) {
  const x = Math.sin(seed * 999.91) * 10000;
  return x - Math.floor(x);
}

function buildSeries(bucket: number) {
  return Array.from({ length: 24 }, (_, index) => {
    const seed = bucket - (23 - index);
    return {
      time: new Date(seed * 5 * 60_000).toISOString(),
      visa: Math.round(620 + seeded(seed) * 210),
      mastercard: Math.round(430 + seeded(seed + 41) * 190),
    };
  });
}

function buildTransactions(now: number) {
  return Array.from({ length: 8 }, (_, index) => {
    const seed = Math.floor(now / 12_000) - index;
    const network: Network = seeded(seed) > 0.43 ? "Visa" : "Mastercard";
    const statusRoll = seeded(seed + 19);
    const status: Status = statusRoll > 0.12
      ? "Approved"
      : statusRoll > 0.055
        ? "Declined"
        : statusRoll > 0.025
          ? "Processing"
          : "Reversed";

    return {
      id: `AGR-${String(Math.floor(seeded(seed + 3) * 999999)).padStart(6, "0")}`,
      network,
      endpoint: endpoints[Math.floor(seeded(seed + 7) * endpoints.length)],
      status,
      latencyMs: Math.round(145 + seeded(seed + 11) * 510),
      code: status === "Approved" ? "200" : status === "Processing" ? "202" : status === "Reversed" ? "409" : seeded(seed + 5) > 0.5 ? "402" : "422",
      timestamp: new Date(now - index * 12_000).toISOString(),
    };
  });
}

export async function GET() {
  const now = Date.now();
  const tick = Math.floor(now / 10_000);
  const requestsPerMinute = Math.round(205 + seeded(tick) * 46);
  const successRate = 98.2 + seeded(tick + 2) * 1.25;

  return Response.json(
    {
      generatedAt: new Date(now).toISOString(),
      mode: "simulation",
      summary: {
        requestsPerMinute,
        successRate: Number(successRate.toFixed(2)),
        failureRate: Number((100 - successRate).toFixed(2)),
        p95LatencyMs: Math.round(390 + seeded(tick + 4) * 86),
        availability: 99.99,
      },
      networks: [
        { name: "Visa", status: "Operational", share: 58, requests: 28640, successRate: 99.18, p95LatencyMs: 412 },
        { name: "Mastercard", status: "Operational", share: 42, requests: 20742, successRate: 98.87, p95LatencyMs: 438 },
      ],
      series: buildSeries(Math.floor(now / (5 * 60_000))),
      errors: [
        { code: "402", label: "Issuer declined", count: 231, share: 48 },
        { code: "422", label: "Invalid request", count: 124, share: 26 },
        { code: "504", label: "Gateway timeout", count: 76, share: 16 },
        { code: "409", label: "Duplicate / reversed", count: 48, share: 10 },
      ],
      transactions: buildTransactions(now),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
