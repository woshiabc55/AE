import { useUIStore } from "@/store/ui";
import { CLASS_META } from "@/data/skills";
import { SKILLS } from "@/data/skills";
import { useMemo } from "react";

/**
 * FilterBar —— 职业筛选条
 */
export function FilterBar() {
  const { classFilter, setFilter } = useUIStore();
  const counts = useMemo(() => {
    const m: Record<string, number> = { All: SKILLS.length };
    for (const s of SKILLS) m[s.className] = (m[s.className] || 0) + 1;
    return m;
  }, []);

  return (
    <div className="relative z-20 flex h-14 items-center gap-2 overflow-x-auto border-b border-ark-line/60 bg-ark-1/60 px-6 backdrop-blur-sm">
      <span className="font-mono mr-2 text-[10px] tracking-[0.3em] text-ark-silver/60">FILTER ▸</span>
      {CLASS_META.map((c) => {
        const active = classFilter === c.key;
        return (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={[
              "group relative flex h-9 shrink-0 items-center gap-2 px-3.5 font-display text-[11px] font-bold tracking-[0.18em] transition",
              "clip-corner-sm",
              active
                ? "border text-ark-white"
                : "border border-ark-line/60 text-ark-silver/70 hover:border-ark-cyan/60 hover:text-ark-cyan",
            ].join(" ")}
            style={
              active
                ? {
                    borderColor: c.color,
                    background: `${c.color}1c`,
                    boxShadow: `0 0 0 1px ${c.color}55, 0 0 16px ${c.color}40`,
                  }
                : undefined
            }
          >
            <span
              className="h-1.5 w-1.5"
              style={{
                background: c.color,
                boxShadow: active ? `0 0 8px ${c.color}` : "none",
              }}
            />
            <span>{c.en}</span>
            <span
              className={[
                "ml-1 font-mono text-[10px] tabular-nums",
                active ? "text-ark-white/80" : "text-ark-silver/40",
              ].join(" ")}
            >
              {String(counts[c.key] || 0).padStart(2, "0")}
            </span>
            {/* 悬停扫光 */}
            {!active && (
              <span
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
              >
                <span className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
            )}
          </button>
        );
      })}

      <div className="ml-auto hidden items-center gap-3 md:flex">
        <span className="font-mono text-[10px] tracking-widest text-ark-silver/50">
          ◂ 24 SKILLS · 8 CLASSES · LIVE FEED ▸
        </span>
      </div>
    </div>
  );
}
