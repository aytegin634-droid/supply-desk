"use client";

import { useState } from "react";
import { changePasswordAction } from "./actions";
import { AlertCircle, Check, CheckCircle2 } from "lucide-react";

export default function ProfileForm() {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = oldPwd.length > 0 && newPwd.length >= 6 && newPwd === confirmPwd;
  const mismatch = newPwd.length > 0 && confirmPwd.length > 0 && newPwd !== confirmPwd;

  const submit = async () => {
    if (!valid || loading) return;
    setError("");
    setSuccess(false);
    setLoading(true);

    const result = await changePasswordAction({
      currentPassword: oldPwd,
      newPassword: newPwd,
    });

    if (result.ok) {
      setSuccess(true);
      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } else {
      setError(result.reason || "Не удалось сменить пароль");
    }
    setLoading(false);
  };

  return (
    <section className="rounded-2xl p-5 bg-paper border border-rule">
      <div className="mb-3">
        <div className="text-xs uppercase tracking-wider text-ink-soft font-mono font-bold">
          Сменить пароль
        </div>
        <div className="text-xs mt-0.5 text-ink-soft">
          Введите текущий пароль и новый — минимум 6 символов
        </div>
      </div>

      {success && (
        <div className="text-xs px-3 py-2 rounded-lg flex items-center gap-2 mb-3"
          style={{ background: "#e0ebd8", color: "var(--color-sage-deep)" }}>
          <CheckCircle2 size={12} /> Пароль изменён
        </div>
      )}

      {error && (
        <div className="text-xs px-3 py-2 rounded-lg flex items-center gap-2 mb-3"
          style={{ background: "#fbe8df", color: "var(--color-brick-deep)" }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Input
          label="Текущий пароль"
          value={oldPwd}
          onChange={setOldPwd}
          placeholder="••••••••"
        />
        <Input
          label="Новый пароль"
          value={newPwd}
          onChange={setNewPwd}
          placeholder="минимум 6 символов"
        />
        <Input
          label="Повторите новый"
          value={confirmPwd}
          onChange={setConfirmPwd}
          placeholder="введите ещё раз"
          error={mismatch}
          errorText="Пароли не совпадают"
        />
        <button
          onClick={submit}
          disabled={!valid || loading}
          className="w-full py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 justify-center text-white transition-colors"
          style={{
            background: !valid || loading ? "var(--color-rule)" : "var(--color-brick)",
            opacity: !valid || loading ? 0.5 : 1,
          }}
        >
          <Check size={14} />
          {loading ? "Сохранение..." : "Сменить пароль"}
        </button>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  errorText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  errorText?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider mb-1 text-ink-soft">
        {label}
      </div>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-cream outline-none"
        style={{
          border: `1px solid ${error ? "var(--color-brick)" : "var(--color-rule)"}`,
        }}
      />
      {error && errorText && (
        <div className="text-xs mt-1" style={{ color: "var(--color-brick-deep)" }}>
          {errorText}
        </div>
      )}
    </div>
  );
}