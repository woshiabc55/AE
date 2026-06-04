import { CATEGORIES, tools } from '../data/tools';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Distribution() {
  // 统计
  const total = tools.length;
  const byCat = CATEGORIES.map(c => ({
    ...c,
    count: tools.filter(t => t.category === c.id).length,
  }));
  const byMonth = (() => {
    const map: Record<string, number> = {};
    tools.forEach(t => {
      const m = t.createdAt.slice(0, 7);
      map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  })();
  const tagFreq: Record<string, number> = {};
  tools.forEach(t => t.tags.forEach(tag => { tagFreq[tag] = (tagFreq[tag] || 0) + 1; }));
  const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 12);

  // 动画用 counter
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += Math.max(1, Math.ceil((total - n) * 0.15));
      if (n >= total) { n = total; clearInterval(id); }
      setShown(n);
    }, 30);
    return () => clearInterval(id);
  }, [total]);

  const max = Math.max(...byCat.map(c => c.count), 1);
  const maxMonth = Math.max(...byMonth.map(([, v]) => v), 1);
  const maxTag = Math.max(...topTags.map(([, v]) => v), 1);

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-16 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono text-xs text-volt mb-4">// DISTRIBUTION / 分布</div>
          <h1 className="font-display font-black text-7xl md:text-9xl leading-[0.85] tracking-tighter">
            <span className="block">THE</span>
            <span className="block text-volt">SHAPE</span>
            <span className="block">OF THE FORGE.</span>
          </h1>
          <p className="mt-8 text-bone/70 max-w-2xl text-lg">
            工坊的形态——按分类、按月份、按标签，将 28+ 件工具的轮廓一一展开。
          </p>
        </div>
        <div className="absolute right-6 top-6 font-mono text-[10px] text-bone/40 hidden md:block">
          <div>VISUALIZED AT {new Date().toISOString().slice(0, 10)}</div>
          <div>SET OF {total} ENTRIES</div>
        </div>
      </section>

      {/* BIG COUNTERS */}
      <section className="border-b-2 border-bone/20 grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-bone/20">
        {[
          { l: 'TOTAL TOOLS', v: shown, c: 'text-volt' },
          { l: 'CATEGORIES', v: CATEGORIES.length, c: 'text-pink' },
          { l: 'UNIQUE TAGS', v: Object.keys(tagFreq).length, c: 'text-cyan' },
          { l: 'AVG / CATEGORY', v: Math.round(total / CATEGORIES.length), c: 'text-bone' },
        ].map(s => (
          <div key={s.l} className="p-8">
            <div className={`font-display font-black text-6xl md:text-7xl tabular-nums ${s.c}`}>{s.v}</div>
            <div className="font-mono text-xs text-bone/60 mt-2">{s.l}</div>
          </div>
        ))}
      </section>

      {/* BY CATEGORY */}
      <section className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader index="01" title="BY CATEGORY" sub="按分类分布" />
          <div className="mt-8 space-y-3">
            {byCat.map((c, i) => (
              <Link
                to={`/?cat=${c.id}`}
                key={c.id}
                className="group grid grid-cols-[80px_1fr_60px] md:grid-cols-[140px_1fr_80px] items-center gap-4 hover:bg-bone/5 p-3 -mx-3 transition-colors"
              >
                <div className="font-mono text-sm font-bold">
                  <span className="text-bone/40">0{i+1}</span> <span className="group-hover:text-volt">{c.cn}</span>
                </div>
                <div className="h-10 bg-bone/5 border border-bone/20 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-volt transition-all duration-1000"
                    style={{ width: `${(c.count / max) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 font-mono text-xs text-ink mix-blend-difference">
                    {c.label.toUpperCase()}
                  </div>
                </div>
                <div className="font-display font-black text-3xl md:text-4xl text-right tabular-nums">{c.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BY MONTH */}
      <section className="border-b-2 border-bone/20 px-6 py-12 bg-bone text-ink">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader index="02" title="BY MONTH" sub="按月份新增" light />
          <div className="mt-8 flex items-end gap-2 md:gap-3 h-64">
            {byMonth.map(([m, v]) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">+{v}</div>
                <div
                  className="w-full bg-ink hover:bg-pink transition-colors"
                  style={{ height: `${(v / maxMonth) * 100}%` }}
                />
                <div className="text-[10px] font-mono whitespace-nowrap -rotate-45 md:rotate-0 origin-top-left">
                  {m.slice(5)}/{m.slice(2, 4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TAGS */}
      <section className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader index="03" title="TOP TAGS" sub="最常出现的标签" />
          <div className="mt-8 flex flex-wrap gap-2">
            {topTags.map(([tag, count], i) => {
              const size = 12 + (count / maxTag) * 32;
              const colors = ['text-volt', 'text-pink', 'text-cyan', 'text-bone'];
              return (
                <span
                  key={tag}
                  className={`font-mono px-3 py-1 border-2 border-bone/40 ${colors[i % 4]} hover:bg-bone hover:text-ink transition-colors cursor-default`}
                  style={{ fontSize: `${size}px` }}
                >
                  #{tag} <span className="opacity-50 text-xs">×{count}</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* DISTRIBUTION GRID (visual) */}
      <section className="px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader index="04" title="FIELD MAP" sub="分类下的工具阵列" />
          <div className="mt-8 grid md:grid-cols-5 gap-3">
            {byCat.map(c => (
              <div key={c.id} className="border-2 border-bone/30 p-4 hover:border-volt transition-colors">
                <div className="font-mono text-[10px] text-bone/60">{c.label.toUpperCase()}</div>
                <div className="font-display font-black text-3xl mt-1">{c.cn}</div>
                <div className="grid grid-cols-4 gap-1 mt-4">
                  {Array.from({ length: c.count }).map((_, i) => (
                    <div key={i} className="aspect-square bg-volt" style={{ opacity: 0.3 + (i / c.count) * 0.7 }} />
                  ))}
                  {Array.from({ length: 16 - c.count }).map((_, i) => (
                    <div key={'_' + i} className="aspect-square border border-bone/10" />
                  ))}
                </div>
                <div className="mt-3 font-mono text-[10px] text-bone/60">{c.count} / 16 SLOTS</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ index, title, sub, light }: { index: string; title: string; sub: string; light?: boolean }) {
  return (
    <div className="flex items-baseline justify-between border-b-2 border-current/20 pb-3">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs opacity-60">{index}</span>
        <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight">{title}</h2>
      </div>
      <div className="font-mono text-xs opacity-60">{sub}</div>
    </div>
  );
}
