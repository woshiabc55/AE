import { useMemo } from 'react';
import { WORKS } from '../data/works';
import { GAME_IPS } from '../data/ips';
import { WORK_TYPE_LABELS, type WorkType } from '../data/types';
import { BarChart3, TrendingUp, Globe2, Layers } from 'lucide-react';

const COLORS = ['#ff2d95', '#00f0ff', '#9d4edd', '#ffd60a', '#39ff14', '#ff6b6b', '#4ecdc4', '#a78bfa', '#f97316', '#06b6d4'];

export default function Dashboard() {
  // 类型分布
  const typeData = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of WORKS) m.set(w.type, (m.get(w.type) || 0) + 1);
    return Array.from(m.entries())
      .map(([t, n]) => ({ label: WORK_TYPE_LABELS[t as WorkType], value: n, color: COLORS[Object.keys(WORK_TYPE_LABELS).indexOf(t) % COLORS.length] }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // 地区分布
  const regionData = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of WORKS) m.set(w.region, (m.get(w.region) || 0) + 1);
    return Array.from(m.entries())
      .map(([r, n]) => ({ label: r, value: n }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // 年份趋势
  const yearData = useMemo(() => {
    const m = new Map<number, number>();
    for (const w of WORKS) m.set(w.year, (m.get(w.year) || 0) + 1);
    const arr = Array.from(m.entries()).map(([y, n]) => ({ year: y, n })).sort((a, b) => a.year - b.year);
    // 按 5 年分桶
    const buckets: { year: number; n: number }[] = [];
    const step = 5;
    for (let y = 1985; y <= 2026; y += step) {
      const n = arr.filter((a) => a.year >= y && a.year < y + step).reduce((s, a) => s + a.n, 0);
      buckets.push({ year: y, n });
    }
    return buckets;
  }, []);

  // Top 10 IP
  const topIps = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of WORKS) m.set(w.ipId, (m.get(w.ipId) || 0) + 1);
    return Array.from(m.entries())
      .map(([id, n]) => ({ id, name: GAME_IPS.find((g) => g.id === id)?.name || id, value: n }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, []);

  const maxYear = Math.max(...yearData.map((d) => d.n));
  const maxType = typeData[0]?.value || 1;
  const maxRegion = regionData[0]?.value || 1;
  const maxIp = topIps[0]?.value || 1;

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>// DATA_DASHBOARD</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-neon">
          数据看板
        </h1>
        <p className="text-white/50 mt-2">从多维度俯瞰游戏 IP 衍生作品生态。</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* 类型分布 */}
        <ChartCard title="类型分布" icon={<Layers className="w-4 h-4" />}>
          <div className="space-y-2.5">
            {typeData.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <div className="text-xs text-white/70 w-24 shrink-0">{d.label}</div>
                <div className="flex-1 h-6 bg-white/5 rounded-sm overflow-hidden relative">
                  <div
                    className="h-full rounded-sm flex items-center justify-end px-2"
                    style={{
                      width: `${(d.value / maxType) * 100}%`,
                      background: `linear-gradient(90deg, ${d.color}55, ${d.color}cc)`,
                    }}
                  >
                    <span className="text-[10px] font-mono font-bold text-white drop-shadow">
                      {d.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* 地区分布 */}
        <ChartCard title="地区分布" icon={<Globe2 className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-3">
            {regionData.map((d, i) => {
              const pct = (d.value / maxRegion) * 100;
              return (
                <div
                  key={d.label}
                  className="p-3 bg-white/5 border border-white/10 rounded-sm hover:border-neon-cyan/40 transition"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="text-xs text-white/60 font-mono">// 0{i + 1}</div>
                    <div className="text-[10px] text-white/30 font-mono">{pct.toFixed(0)}%</div>
                  </div>
                  <div className="mt-1 font-semibold text-white/90">{d.label}</div>
                  <div className="font-display text-2xl font-black text-neon-cyan mt-1">
                    {d.value}
                  </div>
                  <div className="mt-2 h-1 bg-white/5 rounded overflow-hidden">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* 年份趋势 */}
        <ChartCard title="年份趋势 (5 年桶)" icon={<TrendingUp className="w-4 h-4" />} wide>
          <div className="flex items-end gap-1 h-48 pt-4">
            {yearData.map((d) => {
              const h = (d.n / maxYear) * 100;
              return (
                <div key={d.year} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="text-[9px] font-mono text-neon-cyan opacity-0 group-hover:opacity-100 transition mb-1">
                    {d.n}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-neon-pink to-neon-cyan rounded-t-sm hover:from-neon-yellow hover:to-neon-pink transition-all"
                    style={{ height: `${Math.max(2, h)}%` }}
                  />
                  <div className="mt-1 text-[9px] text-white/40 font-mono -rotate-45 origin-top-left whitespace-nowrap">
                    {d.year}
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Top 10 IP */}
        <ChartCard title="衍生数量 Top 10 IP" icon={<TrendingUp className="w-4 h-4" />} wide>
          <div className="space-y-1.5">
            {topIps.map((d, i) => {
              const pct = (d.value / maxIp) * 100;
              return (
                <div key={d.id} className="flex items-center gap-3 group">
                  <div className="text-[10px] text-white/30 font-mono w-5 text-right">#{i + 1}</div>
                  <div className="text-xs text-white/80 w-32 truncate group-hover:text-neon-cyan transition">{d.name}</div>
                  <div className="flex-1 h-5 bg-white/5 rounded-sm overflow-hidden relative">
                    <div
                      className="h-full rounded-sm flex items-center px-2 text-[10px] font-mono font-bold text-white"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}55, ${COLORS[i % COLORS.length]})`,
                      }}
                    >
                      {d.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* 数据摘要 */}
      <div className="mt-8 card-neon p-5">
        <div className="text-[10px] text-white/40 font-mono mb-2">// DATA_SUMMARY</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <SummaryItem label="总衍生作品" value={WORKS.length.toLocaleString()} accent="text-neon-cyan" />
          <SummaryItem label="覆盖 IP" value={GAME_IPS.length.toLocaleString()} accent="text-neon-pink" />
          <SummaryItem label="类型" value={typeData.length.toString()} accent="text-neon-violet" />
          <SummaryItem label="地区" value={regionData.length.toString()} accent="text-neon-yellow" />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children, wide = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`card-neon p-5 ${wide ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-4">
        {icon}
        <span>// {title.toUpperCase()}</span>
      </div>
      {children}
    </div>
  );
}

function SummaryItem({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div className="text-[10px] text-white/40 font-mono tracking-widest">{label}</div>
      <div className={`font-display text-2xl font-black ${accent}`}>{value}</div>
    </div>
  );
}
