"use client";

import { useState } from "react";
import {
  archiveBranchAction,
  restoreBranchAction,
} from "./actions";
import { Plus, MapPin, AlertCircle, FileEdit, Trash2 } from "lucide-react";
import NewBranchForm from "./new-branch-form";
import HoldChip from "@/components/HoldChip";

type Branch = {
  id: string;
  name: string;
  address: string | null;
  archived_at: string | null;
};

export default function BranchesSection({
  branches,
  openCounts,
}: {
  branches: Branch[];
  openCounts: Record<string, number>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const active = branches.filter((b) => !b.archived_at);
  const archived = branches.filter((b) => b.archived_at);

  const archive = async (id: string) => {
    setError("");
    const result = await archiveBranchAction(id);
    if (!result.ok) setError(result.reason || "Не удалось архивировать");
  };

  const restore = async (id: string) => {
    setError("");
    const result = await restoreBranchAction(id);
    if (!result.ok) setError(result.reason || "Не удалось восстановить");
  };

  return (
    <section className="rounded-2xl p-5 bg-paper border border-rule">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-soft font-mono font-bold">
            Филиалы
          </div>
          <div className="text-xs mt-0.5 text-ink-soft">
            {active.length} активных · архив отвяжет филиал от сотрудников
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 transition-colors"
          style={{
            background: showForm ? "var(--color-ink)" : "var(--color-rule-soft)",
            color: showForm ? "var(--color-paper)" : "var(--color-ink)",
          }}
        >
          <Plus size={12} /> {showForm ? "Отмена" : "Новый филиал"}
        </button>
      </div>

      {showForm && (
        <NewBranchForm onDone={() => setShowForm(false)} />
      )}

      {error && (
        <div className="text-xs px-3 py-2 rounded-lg flex items-center gap-2 mb-3"
          style={{ background: "#fbe8df", color: "var(--color-brick-deep)" }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {/* Активные */}
      <div className="flex flex-col gap-2 mt-3">
        {active.length === 0 ? (
          <div className="rounded-xl p-6 text-center text-sm bg-cream border border-dashed border-rule text-ink-soft italic">
            Нет активных филиалов. Создайте первый.
          </div>
        ) : (
          active.map((b) => {
            const blocking = openCounts[b.id] || 0;
            return (
              <div
                key={b.id}
                className="flex items-center gap-3 p-3 rounded-xl flex-wrap bg-cream border border-rule-soft"
              >
                <MapPin size={14} className="text-ink-soft flex-none" />
                <div className="flex-1 min-w-[150px]">
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-xs truncate text-ink-soft">
                    {b.address || "—"}
                  </div>
                </div>
                {blocking > 0 ? (
                  <div className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    style={{ background: "#fbe8df", color: "var(--color-brick-deep)" }}>
                    <AlertCircle size={11} /> {blocking} активных
                  </div>
                ) : (
                  <HoldChip
                    label="Архивировать"
                    icon={Trash2}
                    onConfirm={() => archive(b.id)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Архив */}
      {archived.length > 0 && (
        <details className="mt-4">
          <summary className="text-xs cursor-pointer flex items-center gap-2 text-ink-soft font-mono font-bold">
            <FileEdit size={11} /> Архив филиалов ({archived.length})
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            {archived.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 p-3 rounded-xl flex-wrap bg-rule-soft border border-dashed border-rule"
              >
                <MapPin size={14} className="text-ink-soft opacity-50 flex-none" />
                <div className="flex-1 min-w-[150px] opacity-60">
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-xs truncate text-ink-soft">
                    {b.address || "—"} · в архиве
                  </div>
                </div>
                <button
                  onClick={() => restore(b.id)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold text-white"
                  style={{ background: "var(--color-sage)" }}
                >
                  Восстановить
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}