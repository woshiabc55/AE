import { CATEGORIES, tools } from '../data/tools';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Exhibition() {
  // 展览厅：每个分类作为一个"展厅"
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div>
      {/* HERO — 巨型展览海报 */}
      <section className="border-b-2 border-bone/20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-32 relative">
          <div className="font-mono text-xs text-volt mb-6">// EXHIBITION № 01 / 界面展览</div>
          <h1 className="font-display font-black text-[18vw] md:text-[14vw] leading-[0.82] tracking-tighter">
            <span className="block" style={{ transform: `translateY(${scrollY * 0.15}px)` }}>THE</span>
            <span className="block text-volt italic" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>Living</span>
            <span className="block" style={{ transform: `translateY(${scrollY * 0.45}px)` }}>CRAFT</span>
          </h1>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-bone/80 max-w-4xl">
            <p className="text-sm leading-relaxed">
              28 件由 HTML / CSS / JS 锻造而成的微型艺术品，每一件都拥有自己的展墙。
            </p>
            <p className="text-sm leading-relaxed">
              滚动浏览，随机停顿，挑选你心仪的那一件；点击进入查看完整作品与作者笔记。
            </p>
            <p className="text-sm leading-relaxed font-mono text-bone/60">
              CURATED BY SKILL FORGE.<br/>
              ALWAYS FREE. ALWAYS OPEN.<br/>
              EST. 2026.
            </p>
          </div>
        </div>
        {/* 装饰：右上一个旋转的星形 */}
        <div className="absolute -right-10 -top-10 w-72 h-72 pointer-events-none hidden md:block" style={{ transform: `rotate(${scrollY * 0.1}deg)` }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,5 61,40 98,40 68,62 79,95 50,75 21,95 32,62 2,40 39,40" fill="#f0ff00" />
          </svg>
        </div>
      </section>

      {/* NOW SHOWING — 大尺寸精选 */}
      <section className="border-b-2 border-bone/20 px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle n="00" t="NOW SHOWING" sub="当下展映" />
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {tools.slice(0, 2).map((t, i) => (
              <Link
                key={t.slug}
                to={`/tool/${t.slug}`}
                className={`relative group block ${i === 0 ? 'md:row-span-2' : ''}`}
              >
                <div className={`relative overflow-hidden border-2 border-bone/30 group-hover:border-volt ${i === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/3]'}`}>
                  <t.Preview />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="font-mono text-[10px] text-volt mb-1">FEATURED · {String(i+1).padStart(2,'0')}</div>
                    <div className="font-display font-black text-2xl md:text-3xl">{t.name}</div>
                    <div className="text-xs text-bone/70 mt-1 line-clamp-2">{t.description}</div>
                  </div>
                  <div className="absolute top-2 right-2 font-mono text-[10px] text-bone/60 border border-bone/40 px-2 py-0.5">
                    {CATEGORIES.find(c => c.id === t.category)?.cn}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 五个展厅 — 按分类 */}
      {CATEGORIES.map((cat, idx) => {
        const items = tools.filter(t => t.category === cat.id);
        const palette = [
          { accent: '#f0ff00', bg: '#0a0a0a' },
          { accent: '#ff3da5', bg: '#0a0a0a' },
          { accent: '#00e5ff', bg: '#0a0a0a' },
          { accent: '#f5f1e8', bg: '#0a0a0a' },
          { accent: '#9b5cff', bg: '#0a0a0a' },
        ][idx];
        return (
          <section
            key={cat.id}
            className="border-b-2 border-bone/20 px-6 py-16 relative"
            style={{ background: idx % 2 === 1 ? '#0a0a0a' : '#0d0d0d' }}
          >
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-end justify-between mb-8 border-b-2 border-bone/20 pb-4 flex-wrap gap-4">
                <div>
                  <div className="font-mono text-[10px] text-bone/40 mb-2">ROOM {String(idx+1).padStart(2,'0')} / 05</div>
                  <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-none">
                    <span className="text-bone/30">/</span> <span style={{ color: palette.accent }}>{cat.cn}</span>
                  </h2>
                  <div className="font-display font-black text-2xl md:text-3xl mt-1 tracking-tight">{cat.label.toUpperCase()}</div>
                </div>
                <div className="text-right font-mono text-xs text-bone/60">
                  <div>{items.length} PIECES</div>
                  <div className="mt-1">CURATED GROUP</div>
                </div>
              </div>

              {/* 横向滚动墙 */}
              <div className="overflow-x-auto -mx-6 px-6 pb-4">
                <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                  {items.map((t, i) => (
                    <Link
                      key={t.slug}
                      to={`/tool/${t.slug}`}
                      className="group shrink-0 w-72 md:w-80"
                    >
                      <div className="aspect-[3/4] relative overflow-hidden border-2 border-bone/20 group-hover:border-bone transition-colors">
                        <t.Preview />
                        <div className="absolute top-2 left-2 font-mono text-[10px] bg-ink/80 px-2 py-0.5 border border-bone/30">
                          № {String(i+1).padStart(2,'0')}
                        </div>
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div className="font-display font-black text-lg leading-tight group-hover:text-volt transition-colors">{t.name}</div>
                        <div className="font-mono text-[10px] text-bone/40 shrink-0 mt-1">2026</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CURATOR'S NOTE */}
      <section className="px-6 py-20">
        <div className="max-w-[1000px] mx-auto border-2 border-volt p-8 md:p-12 relative">
          <div className="absolute -top-3 left-6 bg-ink px-3 font-mono text-xs text-volt">// CURATOR'S NOTE</div>
          <p className="font-display text-2xl md:text-4xl font-black leading-snug">
            "在像素与像素之间，总有一些多余的、奢侈的、不必要的努力——
            <span style={{ color: '#f0ff00' }}> 那些才是一个网页的灵魂。</span>"
          </p>
          <div className="mt-6 font-mono text-xs text-bone/60 flex flex-wrap items-center justify-between gap-2">
            <span>— SKILL FORGE 编辑部</span>
            <Link to="/standards" className="text-volt hover:underline">阅读完整策展笔记 →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ n, t, sub }: { n: string; t: string; sub: string }) {
  return (
    <div className="flex items-baseline justify-between border-b-2 border-bone/20 pb-3">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs text-bone/40">{n}</span>
        <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight">{t}</h2>
      </div>
      <div className="font-mono text-xs text-bone/60">{sub}</div>
    </div>
  );
}
