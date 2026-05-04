"use client";

import { useState } from "react";
import { loginAction } from "./actions";
import { AlertCircle, Check, Loader } from "lucide-react";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!login || !password || loading) return;
    setError("");
    setLoading(true);
    const result = await loginAction({ login, password });
    if (result && !result.ok) {
      setError(result.reason || "Не удалось войти");
      setLoading(false);
    }
    // на успехе — Server Action redirect'нет, loading сбрасывать не нужно
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-ink-soft font-mono">
            Supply Desk
          </div>
          <h1 className="text-3xl mt-1 font-display font-semibold tracking-tight">
            Чайхана «Жибек Жолу»
          </h1>
          <div className="text-sm mt-2 text-ink-soft">
            Войдите в систему заявок и закупок
          </div>
        </div>

        <div className="rounded-3xl p-6 flex flex-col gap-4 bg-paper border border-rule">
          <div>
            <div className="text-xs uppercase tracking-wider mb-1 text-ink-soft">
              Логин
            </div>
            <input
              type="text"
              value={login}
              onChange={(e) => { setLogin(e.target.value); setError(""); }}
              onKeyDown={onKey}
              placeholder="например: admin"
              autoComplete="username"
              autoFocus
              className="w-full px-3 py-3 rounded-xl text-sm bg-cream outline-none"
              style={{ border: `1px solid ${error ? "var(--color-brick)" : "var(--color-rule)"}` }}
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-1 text-ink-soft">
              Пароль
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={onKey}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-3 py-3 rounded-xl text-sm bg-cream outline-none"
              style={{ border: `1px solid ${error ? "var(--color-brick)" : "var(--color-rule)"}` }}
            />
          </div>
          {error && (
            <div className="text-xs px-3 py-2 rounded-lg flex items-center gap-2"
              style={{ background: "#fbe8df", color: "var(--color-brick-deep)" }}>
              <AlertCircle size={12} /> {error}
            </div>
          )}
          <button
            onClick={submit}
            disabled={!login || !password || loading}
            className="w-full py-3 rounded-full text-sm font-semibold flex items-center gap-2 justify-center text-white transition-colors"
            style={{
              background: (!login || !password || loading) ? "var(--color-rule)" : "var(--color-brick)",
              opacity: (!login || !password || loading) ? 0.5 : 1,
            }}
          >
            {loading ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
            {loading ? "Вход..." : "Войти"}
          </button>
        </div>

        <div className="text-xs text-center text-ink-soft opacity-60">
          Нет доступа? Обратитесь к администратору.
        </div>
      </div>
    </div>
  );
}