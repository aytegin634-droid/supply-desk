"use client";

import { useState, useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";

export default function HoldChip({
  label,
  icon: Icon,
  onConfirm,
  holdMs = 1200,
}: {
  label: string;
  icon?: LucideIcon;
  onConfirm: () => void | Promise<void>;
  holdMs?: number;
}) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startedAt = useRef<number>(0);

  const start = () => {
    setPressing(true);
    startedAt.current = Date.now();
    timerRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt.current) / holdMs);
      setProgress(p);
      if (p >= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPressing(false);
        setProgress(0);
        onConfirm();
      }
    }, 30);
  };

  const cancel = () => {
    setPressing(false);
    setProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return (
    <button
      onMouseDown={start}
      onMouseUp={cancel}
      onMouseLeave={cancel}
      onTouchStart={start}
      onTouchEnd={cancel}
      onTouchCancel={cancel}
      className="relative overflow-hidden text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 select-none transition-colors"
      style={{
        background: pressing ? "var(--color-brick-deep)" : "transparent",
        color: pressing ? "#fff" : "var(--color-brick-deep)",
        border: `1px solid var(--color-brick-deep)`,
        touchAction: "none",
      }}
    >
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: `${progress * 100}%`,
          background: "rgba(255,255,255,0.3)",
        }}
      />
      <span className="relative z-10 flex items-center gap-1.5">
        {Icon && <Icon size={12} />}
        {pressing ? "Удерживайте..." : label}
      </span>
    </button>
  );
}