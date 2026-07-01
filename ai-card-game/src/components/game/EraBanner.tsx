import { useGameStore } from "@/store/useGameStore";
import { ERA_ORDER, ERA_LABELS, SEASON_LABELS, SEASON_ORDER } from "@/types";
import { cn } from "@/lib/utils";

/** 季节配色 */
const SEASON_COLORS: Record<string, string> = {
  spring: "text-green-400",
  summer: "text-vermillion-400",
  autumn: "text-gold-300",
  winter: "text-blue-300",
};

/** 时代横幅 — 顶部鎏金卷轴显示当前时代/季节/回合/文明熵 */
export function EraBanner() {
  const { era, eraLabel, turn, factions } = useGameStore();
  const ctx = useGameStore((s) => s.ctx);
  const season = ctx?.world.season ?? "spring";
  const player = factions.find((f) => f.isPlayer);
  const entropy = player?.entropy ?? 0;
  const eraIdx = ERA_ORDER.indexOf(era);
  const seasonIdx = SEASON_ORDER.indexOf(season);

  return (
    <header className="chronicle-frame relative mb-4 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="gilt-title font-serif text-2xl">编年史</h1>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500/70">
            Chronicle
          </span>
        </div>
        <div className="flex items-center gap-6">
          {/* 时代进度卷轴 */}
          <div className="flex items-center gap-1.5">
            {ERA_ORDER.map((e, i) => (
              <span
                key={e}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-wider transition-colors",
                  i < eraIdx && "text-gold-500/40",
                  i === eraIdx && "text-gold-200 underline decoration-gold-300 decoration-2 underline-offset-4",
                  i > eraIdx && "text-parchment-300/25"
                )}
              >
                {ERA_LABELS[e]}
              </span>
            ))}
          </div>
          {/* 季节指示 */}
          <div className="flex items-center gap-1.5 border-l border-gold-500/30 pl-6">
            {SEASON_ORDER.map((s, i) => (
              <span
                key={s}
                className={cn(
                  "font-serif text-sm transition-colors",
                  i === seasonIdx ? SEASON_COLORS[s] : "text-parchment-300/20"
                )}
              >
                {SEASON_LABELS[s]}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 border-l border-gold-500/30 pl-6">
            <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-300/60">
              回合
            </span>
            <span className="gilt-title font-serif text-xl">{turn}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-300/60">
              文明熵
            </span>
            <span className="font-mono text-sm text-bronze-400">{entropy}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
