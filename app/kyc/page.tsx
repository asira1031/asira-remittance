"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function KycPage() {
  const [fullName, setFullName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) {
      setMessage("❌ Please select a file");
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("kyc-documents")
      .upload(fileName, file);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage("✅ KYC document uploaded successfully");
    setFullName("");
    setFile(null);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-black text-emerald-400">
          KYC VERIFICATION
        </h1>

        <p className="text-white/50 mt-2">
          Upload your identity document for verification.
        </p>

        <label className="block text-sm text-white/50 mt-8 mb-2">
          Full Name
        </label>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none"
        />

        <label className="block text-sm text-white/50 mt-5 mb-2">
          Upload ID / Passport
        </label>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3"
        />

        <button
          onClick={handleUpload}
          className="w-full mt-8 rounded-2xl bg-emerald-500 text-black font-bold py-4"
        >
          Upload KYC Document
        </button>

        {message && (
          <p className="mt-4 text-center text-white/70">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}