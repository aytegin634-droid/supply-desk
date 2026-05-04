"use client";

import { useState, useEffect } from "react";
import { updateCompanyNameAction } from "./actions";
import { Pencil, Check, X, AlertCircle, CheckCircle2 } from "lucide-react";

export default function CompanyForm({ initialName }: { initialName: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setDraft(initialName), [initialName]);

  const submit = async () => {
    if (!draft.trim() || draft.trim() === initialName || loading) return;
    setLoading(true);
    setError("");
    const result = await updateCompanyNameAction(draft);
    if (result.ok) {
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 2500);
    } else {
      setError(result.reason || "Не удалось сохранить");
    }
    setLoading(false);
  };

  const cancel = () => {
    setDraft(initialName);
    setEditing(false);
    setError("");
  };

  return (
    <section className="rounded-2xl p-5 bg-paper border border-rule">
      <div className="text-xs uppercase tracking-wider text-ink-soft font-mono font-bold mb-1">
        Профиль компании
      </div>
      <div className="text-xs mb-3 text-ink-soft">
        Название отображается на странице входа и в шапке системы
      </div>

      {success && (
        <div className="text-xs px-3 py-2 rounded-lg flex items-center gap-2 mb-3"
          style={{ background: "#e0ebd8", color: "var(--color-sage-deep)" }}>
          <CheckCircle2 size={12} /> Название обновлено
        </div>
      )}

      {error && (
        <div className="text-xs px-3 py-2 rounded-lg flex items-center gap-2 mb-3"
          style={{ background: "#fbe8df", color: "var(--color-brick-deep)" }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Название компании"
            autoFocus
            className="w-full px-3 py-2.5 rounded-xl text-sm bg-cream outline-none border border-rule"
          />
          <div className="flex gap-2">
            <button
              onClick={cancel}
              disabled={loading}
              className="flex-1 py-2 rounded-full text-sm border border-rule flex items-center justify-center gap-1.5"
            >
              <X size={13} /> Отмена
            </button>
            <button
              onClick={submit}
              disabled={!draft.trim() || draft.trim() === initialName || loading}
              className="flex-1 py-2 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              style={{
                background: !draft.trim() || draft.trim() === initialName || loading
                  ? "var(--color-rule)"
                  : "var(--color-brick)",
                opacity: !draft.trim() || draft.trim() === initialName || loading ? 0.5 : 1,
              }}
            >
              <Check size={13} /> {loading ? "..." : "Сохранить"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl flex-wrap bg-cream border border-rule-soft">
          <div className="text-base font-display font-semibold flex-1 min-w-0">
            {initialName || "—"}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 bg-rule-soft hover:bg-rule transition-colors"
          >
            <Pencil size={12} /> Изменить
          </button>
        </div>
      )}
    </section>
  );
}