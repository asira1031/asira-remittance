"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CardCheckoutContent() {
  const searchParams = useSearchParams();

  const amount = searchParams.get("amount") || "0";
  const reference = searchParams.get("reference") || "ASIRA-DEMO";
  const merchant = searchParams.get("merchant") || "Merchant Account";

  return (
    <main style={page}>
      <div style={card}>
        <h1 style={title}>Card Payment</h1>
        <p style={subtitle}>Secure merchant card checkout</p>

        <div style={summary}>
          <Row label="Merchant" value={merchant} />
          <Row label="Reference" value={reference} />
          <Row label="Amount" value={`PHP ${amount}`} />
        </div>

        <label style={label}>Cardholder Name</label>
        <input style={input} placeholder="Juan Dela Cruz" />

        <label style={label}>Card Number</label>
        <input style={input} placeholder="4242 4242 4242 4242" />

        <div style={grid}>
          <div>
            <label style={label}>Expiry</label>
            <input style={input} placeholder="MM/YY" />
          </div>

          <div>
            <label style={label}>CVV</label>
            <input style={input} placeholder="123" />
          </div>
        </div>

        <button style={button}>Pay Now</button>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={row}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function CardCheckoutPage() {
  return (
    <Suspense fallback={<div style={page}>Loading checkout...</div>}>
      <CardCheckoutContent />
    </Suspense>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#050505",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  background: "#111",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 24,
  padding: 32,
};

const title: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
  marginBottom: 8,
};

const subtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.6)",
  marginBottom: 24,
};

const summary: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: 16,
  padding: 16,
  marginBottom: 24,
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 10,
  color: "rgba(255,255,255,0.8)",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  marginBottom: 8,
  color: "rgba(255,255,255,0.7)",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: 18,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "#050505",
  color: "white",
  outline: "none",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const button: React.CSSProperties = {
  width: "100%",
  padding: "15px 18px",
  borderRadius: 14,
  border: "none",
  background: "white",
  color: "black",
  fontWeight: 800,
  cursor: "pointer",
};