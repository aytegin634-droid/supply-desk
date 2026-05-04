"use client";

import { useState } from "react";
import { createBranchAction } from "./actions";
import { Check, AlertCircle } from "lucide-react";

export default function NewBranchForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    setError("");
    const result = await createBranchAction({ name, address });
    if (result.ok) {
      setName("");
      setAddress("");
      onDone();
    } else {
      setError(result.reason || "Не удалось создать");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-xl p-3 mb-3 flex flex-col gap-2 bg-cream border border-rule">
      {error && (
        <div className="text-xs px-3 py-2 rounded-lg flex items-center gap-2"
          style={{ background: "#fbe8df", color: "var(--color-brick-deep)" }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder="Название филиала (например: на Чуй)"
        autoFocus
        className="w-full px-3 py-2 rounded-lg text-sm bg-paper outline-none border border-rule"
      />
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder="Адрес (опционально)"
        className="w-full px-3 py-2 rounded-lg text-sm bg-paper outline-none border border-rule"
      />
      <button
        onClick={submit}
        disabled={!name.trim() || loading}
        className="w-full py-2 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-1.5"
        style={{
          background: !name.trim() || loading ? "var(--color-rule)" : "var(--color-brick)",
          opacity: !name.trim() || loading ? 0.5 : 1,
        }}
      >
        <Check size={13} /> {loading ? "Создаю..." : "Создать филиал"}
      </button>
    </div>
  );
}