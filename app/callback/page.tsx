"use client";

import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    if (code) {
      window.location.href = `/api/bank/token?code=${code}`;
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
      }}
    >
      <h1>Processing UnionBank Authorization...</h1>
    </main>
  );
}