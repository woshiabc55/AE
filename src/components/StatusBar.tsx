import { useMemo } from "react";
import { Sparkles, Zap, Power, RotateCcw } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { CLASS_META, SKILLS } from "@/data/skills";

/**
 * StatusBar —— 顶部状态条
 */
export function StatusBar() {
  const { classFilter, activatedIds, batchActivating, batchActivate, resetAll } = useUIStore();

  const stats = useMemo(() => {
    const total = SKILLS.length;
    const active = activatedIds.size;
    const visible = classFilter === "All" ? total : SKILLS.filter((s) => s.className === classFilter).length;
    const cls = CLASS_META.find((c) => c.key === classFilter)!;
    return { total, active, visible, cls };
  }, [classFilter, activatedIds.size]);

  return (
    <header className="relative z-30 flex h-16 items-center gap-4 border-b border-ark-line/60 bg-ark-1/80 px-6 backdrop-blur-md">
      {/* 左侧 LOGO 区域 */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10">
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
              background:
                "linear-gradient(135deg, rgba(94,227,255,0.25), rgba(193,91,255,0.18))",
              border: "1px solid rgba(94,227,255,0.6)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-ark-cyan" />
          </div>
        </div>
        <div>
          <div className="font-display text-[15px] font-bold tracking-[0.18em] text-ark-white">
            RHODES · ISLAND
          </div>
          <div className="font-mono text-[10px] tracking-[0.35em] text-ark-cyan/80">
            SKILL · BATCH · TERMINAL
          </div>
        </div>
      </div>

      {/* 中间：当前职业 */}
      <div className="ml-8 hidden items-center gap-3 border-l border-ark-line/60 pl-6 md:flex">
        <div className="font-mono text-[10px] tracking-widest text-ark-silver/60">CURRENT</div>
        <div
          className="clip-tag flex items-center gap-2 border px-3 py-1.5"
          style={{
            borderColor: stats.cls.color,
            background: `${stats.cls.color}14`,
            color: stats.cls.color,
          }}
        >
          <span
            className="block h-1.5 w-1.5 animate-blink"
            style={{ background: stats.cls.color, boxShadow: `0 0 6px ${stats.cls.color}` }}
          />
          <span className="font-display text-xs font-bold tracking-widest">
            {stats.cls.en}
          </span>
          <span className="text-[10px] text-ark-silver/70">· {stats.cls.cn}</span>
        </div>
      </div>

      {/* 统计 */}
      <div className="ml-auto hidden items-center gap-6 lg:flex">
        <Stat label="DISPLAY" value={`${stats.visible}`} sub={`/ ${stats.total}`} />
        <Stat label="ACTIVE" value={`${stats.active}`} sub="SKILL" color="#5ee3a0" />
        <Stat label="SESSION" value="12:34" sub="UTC+8" />
      </div>

      {/* 批量按钮 */}
      <div className="ml-auto flex items-center gap-2 lg:ml-6">
        <ArkButton
          onClick={() => void batchActivate()}
          disabled={batchActivating}
          icon={<Zap className="h-4 w-4" />}
          label={batchActivating ? "BATCH ACTIVE" : "BATCH ACTIVATE"}
          variant="primary"
        />
        <ArkButton
          onClick={resetAll}
          icon={<RotateCcw className="h-4 w-4" />}
          label="RESET"
          variant="ghost"
        />
        <button
          className="ml-1 flex h-9 w-9 items-center justify-center border border-ark-line/70 text-ark-silver/70 transition hover:border-ark-cyan hover:text-ark-cyan"
          title="POWER"
        >
          <Power className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  sub,
  color = "#5ee3ff",
}: {
  label: string;
  value: string;
  sub: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-end">
      <div className="font-mono text-[9px] tracking-[0.3em] text-ark-silver/60">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="font-display text-xl font-bold leading-none"
          style={{ color }}
        >
          {value}
        </span>
        <span className="font-mono text-[10px] text-ark-silver/50">{sub}</span>
      </div>
    </div>
  );
}

function ArkButton({
  onClick,
  icon,
  label,
  variant,
  disabled,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: "primary" | "ghost";
  disabled?: boolean;
}) {
  const primary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative flex h-9 items-center gap-2 px-4 font-display text-[11px] font-bold tracking-[0.18em] transition",
        "clip-corner-sm disabled:cursor-not-allowed disabled:opacity-50",
        primary
          ? "border border-ark-cyan/80 bg-ark-cyan/10 text-ark-cyan hover:border-ark-cyan hover:bg-ark-cyan/20 hover:shadow-[0_0_18px_rgba(94,227,255,0.45)]"
          : "border border-ark-line/70 text-ark-silver hover:border-ark-cyan/60 hover:text-ark-cyan",
      ].join(" ")}
    >
      {/* 顶部扫光 */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ transition: "transform 0.7s ease" }}
        onTransitionEnd={(e) => {
          (e.target as HTMLElement).style.transform = "translateX(-120%)";
        }}
      />
      <span className="relative">{icon}</span>
      <span className="relative whitespace-nowrap">{label}</span>
    </button>
  );
}
