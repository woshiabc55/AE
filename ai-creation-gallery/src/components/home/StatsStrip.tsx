import { stats } from "@/data/meta";
import { useCountUp } from "@/hooks/useCountUp";

function Stat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const { value: v, ref } = useCountUp(value);
  return (
    <div className="glass relative overflow-hidden rounded-2xl px-5 py-4">
      <span
        ref={ref}
        className="block font-display text-3xl font-black text-white sm:text-4xl"
      >
        {v}
        <span className="text-magenta">{suffix}</span>
      </span>
      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
      <span className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-magenta/10 blur-2xl" />
    </div>
  );
}

export default function StatsStrip() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:max-w-2xl md:grid-cols-4">
      <Stat value={stats.total} label="馆藏作品" suffix="+" />
      <Stat value={stats.authors} label="创作者" />
      <Stat value={stats.tags} label="风格标签" />
      <Stat value={stats.recent} label="近 30 天新增" />
    </div>
  );
}
