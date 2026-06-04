"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ALLOWED_EMAILS = [
  "jans103174@gmail.com",
  "cvr0168@gmail.com",
  "edrosaaronold@gmail.com",
];

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!ALLOWED_EMAILS.includes(cleanEmail)) {
      setError("Unauthorized email address");
      return;
    }

    localStorage.setItem("admin_logged_in", "yes");
    localStorage.setItem("admin_email", cleanEmail);

    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-black text-emerald-400">
          Admin Login
        </h1>

        <p className="text-white/50 mt-2">
          Authorized administrators only
        </p>

        <input
          type="email"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-6 rounded-xl bg-black border border-white/10 px-4 py-3 outline-none"
        />

        {error && (
          <div className="mt-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-emerald-500 text-black font-bold py-3 rounded-xl"
        >
          Login
        </button>

        <div className="mt-6 text-xs text-white/40">
          Authorized Emails:
          <br />
          • jans103174@gmail.com
          <br />
          • cvr0168@gmail.com
          <br />
          • edrosaaronold@gmail.com
        </div>
      </div>
    </main>
  );
}