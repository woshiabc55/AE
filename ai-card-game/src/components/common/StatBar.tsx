import { cn } from "@/lib/utils";

interface StatBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
}

/** 数值条 — 编年史风格的状态条 */
export function StatBar({ value, max, color = "bg-gold-300", label }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-wider text-parchment-300/60">
          {label}
        </span>
      )}
      <div className="stat-bar">
        <span className={color} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right font-mono text-[10px] text-parchment-200/80">
        {Math.round(value)}
      </span>
    </div>
  );
}
