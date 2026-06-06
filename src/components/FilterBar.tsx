import { useState } from 'react';
import { ChevronDown, X, Search, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { WORK_TYPE_LABELS, type WorkType, type Region } from '../data/types';
import { GAME_IPS } from '../data/ips';
import { useMemo } from 'react';

const ALL_TYPES = Object.keys(WORK_TYPE_LABELS) as WorkType[];
const ALL_REGIONS: Region[] = ['Japan', 'USA', 'China', 'Korea', 'Europe', 'Global'];

export default function FilterBar() {
  const types = useAppStore((s) => s.types);
  const regions = useAppStore((s) => s.regions);
  const ipIds = useAppStore((s) => s.ipIds);
  const yearRange = useAppStore((s) => s.yearRange);
  const query = useAppStore((s) => s.query);
  const setQuery = useAppStore((s) => s.setQuery);
  const toggleType = useAppStore((s) => s.toggleType);
  const toggleRegion = useAppStore((s) => s.toggleRegion);
  const toggleIp = useAppStore((s) => s.toggleIp);
  const setYearRange = useAppStore((s) => s.setYearRange);
  const resetFilters = useAppStore((s) => s.resetFilters);
  const [ipQuery, setIpQuery] = useState('');

  const ipList = useMemo(() => {
    const q = ipQuery.trim().toLowerCase();
    if (!q) return GAME_IPS.slice(0, 30);
    return GAME_IPS.filter((g) =>
      g.name.toLowerCase().includes(q) ||
      g.nameEn.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [ipQuery]);

  const hasFilter = types.length || regions.length || ipIds.length || query || yearRange[0] !== 1985 || yearRange[1] !== 2026;

  return (
    <div className="glass rounded-sm p-4 md:p-5 space-y-4 sticky top-20 z-30">
      <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>// FILTERS</span>
        {hasFilter && (
          <button
            onClick={resetFilters}
            className="ml-auto flex items-center gap-1 text-white/40 hover:text-neon-pink text-[10px] tracking-widest"
          >
            <X className="w-3 h-3" /> RESET
          </button>
        )}
      </div>

      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索作品名 / IP / 标签..."
          className="w-full bg-ink-700/60 border border-white/10 focus:border-neon-cyan/60 focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2 text-sm rounded-sm font-mono placeholder:text-white/30 transition"
        />
      </div>

      {/* 类型 */}
      <div>
        <Label>类型</Label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map((t) => {
            const on = types.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`text-xs px-2.5 py-1 rounded-sm border transition ${
                  on
                    ? 'border-neon-pink bg-neon-pink/10 text-neon-pink shadow-neon-pink'
                    : 'border-white/10 text-white/60 hover:border-neon-cyan/40 hover:text-neon-cyan'
                }`}
              >
                {WORK_TYPE_LABELS[t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 地区 */}
      <div>
        <Label>地区</Label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_REGIONS.map((r) => {
            const on = regions.includes(r);
            return (
              <button
                key={r}
                onClick={() => toggleRegion(r)}
                className={`text-xs px-2.5 py-1 rounded-sm border transition ${
                  on
                    ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-neon-cyan'
                    : 'border-white/10 text-white/60 hover:border-neon-cyan/40 hover:text-neon-cyan'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* IP 下拉 */}
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer text-white/80 text-xs font-mono py-1 list-none">
          <span className="flex items-center gap-2">
            <span>// 选择 IP</span>
            {ipIds.length > 0 && (
              <span className="text-neon-yellow">({ipIds.length})</span>
            )}
          </span>
          <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition" />
        </summary>
        <div className="mt-2 space-y-2">
          <input
            value={ipQuery}
            onChange={(e) => setIpQuery(e.target.value)}
            placeholder="搜索 IP 名..."
            className="w-full bg-ink-700/40 border border-white/10 outline-none px-2.5 py-1.5 text-xs rounded-sm font-mono placeholder:text-white/30"
          />
          <div className="max-h-56 overflow-y-auto pr-1 space-y-1">
            {ipList.map((ip) => {
              const on = ipIds.includes(ip.id);
              return (
                <button
                  key={ip.id}
                  onClick={() => toggleIp(ip.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-xs text-left transition ${
                    on
                      ? 'bg-neon-violet/15 text-neon-violet border border-neon-violet/30'
                      : 'hover:bg-white/5 text-white/70 border border-transparent'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: ip.color }}
                  />
                  <span className="truncate flex-1">{ip.name}</span>
                  <span className="text-[10px] text-white/30 font-mono">{ip.region}</span>
                </button>
              );
            })}
            {ipList.length === 0 && (
              <div className="text-center text-white/30 text-xs py-3">未找到匹配 IP</div>
            )}
          </div>
        </div>
      </details>

      {/* 年份 */}
      <div>
        <Label>年份 {yearRange[0]} - {yearRange[1]}</Label>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            value={yearRange[0]}
            min={1985}
            max={yearRange[1]}
            onChange={(v) => setYearRange([v, yearRange[1]])}
          />
          <NumberInput
            value={yearRange[1]}
            min={yearRange[0]}
            max={2026}
            onChange={(v) => setYearRange([yearRange[0], v])}
          />
        </div>
        <input
          type="range"
          min={1985}
          max={2026}
          value={yearRange[1]}
          onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
          className="w-full mt-2 accent-neon-cyan"
        />
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] text-white/40 font-mono tracking-widest mb-1.5">
      {children}
    </div>
  );
}

function NumberInput({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const v = Number(e.target.value);
        if (!Number.isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
      }}
      className="w-full bg-ink-700/40 border border-white/10 outline-none px-2 py-1.5 text-xs font-mono rounded-sm"
    />
  );
}
