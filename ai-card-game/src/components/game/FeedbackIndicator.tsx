import { useGameStore } from "@/store/useGameStore";
import { director } from "@/systems/historyEngine";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import type { FeedbackKind } from "@/types";

const KIND_META: Record<
  FeedbackKind,
  { label: string; icon: typeof TrendingUp; color: string }
> = {
  reinforcing: { label: "正反馈", icon: TrendingUp, color: "text-gold-300" },
  balancing: { label: "负反馈", icon: TrendingDown, color: "text-vermillion-400" },
  delayed: { label: "延迟反馈", icon: Clock, color: "text-bronze-400" },
};

/** 反馈回路指示 — 活跃正/负/延迟回路可视化与告警 */
export function FeedbackIndicator() {
  const { ctx } = useGameStore();
  const loops = ctx?.feedback.list() ?? [];
  const directive = director.currentDirective();

  if (loops.length === 0) return null;

  return (
    <div className="chronicle-frame p-3">
      <div className="mb-2 flex items-center justify-between border-b border-gold-500/20 pb-1">
        <span className="gilt-title font-serif text-xs uppercase tracking-widest">
          反馈结构
        </span>
        {directive && (
          <span className="font-mono text-[9px] text-gold-500/60">
            张力 {directive.tensionTarget} · {directive.pacing}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {loops.map((loop) => {
          const meta = KIND_META[loop.kind];
          const Icon = meta.icon;
          return (
            <span
              key={loop.id}
              className={`inline-flex items-center gap-1 border border-gold-500/20 bg-ink-900/60 px-2 py-1 font-mono text-[9px] ${meta.color}`}
              title={loop.description ?? loop.id}
            >
              <Icon size={10} />
              {loop.id.replace(/_/g, " ")}
            </span>
          );
        })}
      </div>
    </div>
  );
}
