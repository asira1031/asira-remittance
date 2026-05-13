"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    router.push("/admin/dashboard");
  }

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    alert("Account created successfully! Please login.");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-black text-emerald-400">
          ASIRA LOGIN
        </h1>

        <p className="text-white/50 mt-2 mb-8">
          Admin secure access
        </p>

        <label className="block text-sm text-white/50 mb-2">
          Email
        </label>

        <input
          type="email"
          className="w-full mb-5 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm text-white/50 mb-2">
          Password
        </label>

        <input
          type="password"
          className="w-full mb-6 rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-2xl bg-emerald-500 text-black font-bold py-4"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="w-full rounded-2xl border border-white/10 bg-white/5 text-white font-bold py-4 mt-4"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}