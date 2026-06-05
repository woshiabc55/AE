import { useMemo, useState } from 'react';
import { CATEGORIES, tools, type Category, type Tool } from '../data/tools';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Tag, TagLegend, TAG_KEYS, type TagCategory, TAG_META } from '../components/Tag';

/* ====================================================================
   模块化9 应用 — 9 类目标签体系贯通 Home
   - 9 tag 过滤：替代/补充 5 cat 分类
   - 工具卡片挂 primary tag
   - 智能推断 primary tag（基于 category + tags）
==================================================================== */

// 推断工具的 primary 9-tag（基于 category + tags 启发式）
function inferPrimaryTag(t: Tool): TagCategory {
  const tagStr = t.tags.join(' ').toLowerCase();
  const name = t.name.toLowerCase();
  if (tagStr.match(/color|palette|gradient|rainbow/) || name.includes('gradient') || name.includes('color')) return 'color';
  if (tagStr.match(/\btext\b|type|font|typography|terminal/) || name.includes('font') || name.includes('type')) return 'type';
  if (tagStr.match(/hover|click|drag|swipe|tilt|mouse|keyboard|switch|parallax|paint|toggle/) || t.category === 'interaction') return 'interact';
  if (tagStr.match(/animation|wave|bounce|flip|rain|particle|morph|glow|spin|orbit|pulse|heart/) || t.category === 'animation') return 'motion';
  if (t.category === 'generator') return 'interact';
  if (t.category === 'experiment') return 'motion';
  return 'visual';
}

interface Props {
  forcedCategory?: Category;
}

export default function Home({ forcedCategory }: Props) {
  const [params, setParams] = useSearchParams();
  const initial = (forcedCategory || (params.get('cat') as Category)) || 'all';
  const [active, setActive] = useState<string>(initial);
  const [activeTag, setActiveTag] = useState<TagCategory | 'all'>('all');
  const [q, setQ] = useState('');

  // 工具按 primary tag 索引
  const tagCounts = useMemo(() => {
    const m: Record<TagCategory, number> = { visual: 0, motion: 0, type: 0, color: 0, layout: 0, interact: 0, perf: 0, a11y: 0, compat: 0 };
    tools.forEach(t => { m[inferPrimaryTag(t)]++; });
    return m;
  }, []);

  const filtered = useMemo(() => {
    return tools.filter(t => {
      const matchCat = active === 'all' || t.category === active;
      const matchTag = activeTag === 'all' || inferPrimaryTag(t) === activeTag;
      const matchQ = !q || (t.name + t.description + t.tags.join(' ')).toLowerCase().includes(q.toLowerCase());
      return matchCat && matchTag && matchQ;
    });
  }, [active, activeTag, q]);

  const setCat = (id: string) => {
    setActive(id);
    if (id === 'all') setParams({});
    else setParams({ cat: id });
  };

  return (
    <div>
      {/* HERO - 3x3 母格 (hero 占 2, stat 卡占 1) */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <div className="flex items-center gap-3 mb-6 font-mono text-xs">
              <span className="w-2 h-2 bg-volt rounded-full animate-pulse" />
              <span className="text-bone/60">A LIVING ARCHIVE / {tools.length} TOOLS / 9 TAGS</span>
            </div>
            <h1 className="font-display font-black text-[14vw] md:text-[10vw] leading-[0.85] tracking-tighter">
              <span className="block">SKILL</span>
              <span className="block relative">
                <span className="relative z-10">FORGE.</span>
                <span className="absolute -bottom-2 left-0 w-3/5 h-6 md:h-10 bg-volt -z-0" />
              </span>
            </h1>
            <div className="mt-10 grid md:grid-cols-2 gap-6 md:gap-12 max-w-4xl">
              <p className="text-lg md:text-xl leading-relaxed text-bone/80">
                一个汇集了 <span className="text-volt font-bold">{tools.length}+</span> 个独立 HTML/CSS/JS 技能工具的创意工坊。
                每一格都是一个可独立运行的小型实验，复制即可使用。
              </p>
              <p className="text-sm text-bone/60 leading-relaxed font-mono">
                BROWSE THE GRID. HOVER THE CARDS. CLICK INTO A TOOL.
                COPY THE CODE. BUILD SOMETHING IMPOSSIBLE.
              </p>
            </div>
          </div>

          {/* 9 标签概览卡 — hero 第 3 列 */}
          <aside className="border-2 border-bone/30 p-4 bg-bone/5 h-fit">
            <div className="font-mono text-[10px] text-bone/60 mb-3 flex items-center gap-2">
              <span className="text-volt">▣</span> 9 TAGS / 模块化9
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {TAG_KEYS.map(k => {
                const m = TAG_META[k];
                return (
                  <button
                    key={k}
                    onClick={() => setActiveTag(activeTag === k ? 'all' : k)}
                    className={`group border-2 p-2 text-left transition-all ${
                      activeTag === k ? 'border-volt bg-volt/5' : 'border-bone/20 hover:border-bone/50'
                    }`}
                  >
                    <div className="font-display font-black text-xl leading-none" style={{ color: m.hex }}>{m.id}</div>
                    <div className="font-mono text-[9px] text-bone/70 mt-0.5">{m.cn}</div>
                    <div className="font-mono text-[10px] text-bone/40 mt-0.5">{tagCounts[k]}</div>
                  </button>
                );
              })}
            </div>
            {activeTag !== 'all' && (
              <button
                onClick={() => setActiveTag('all')}
                className="mt-2 w-full font-mono text-[10px] text-bone/60 hover:text-volt flex items-center justify-center gap-1"
              >
                <X size={10} /> 清除标签过滤
              </button>
            )}
          </aside>
        </div>
        <div className="absolute -right-20 top-10 hidden md:block opacity-10 font-display font-black text-[20rem] leading-none text-bone select-none pointer-events-none">★</div>
      </section>

      {/* CONTROL BAR - 5 cat + 搜索 */}
      <section className="border-b-2 border-bone/20 sticky top-[104px] z-40 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCat('all')}
              className={`px-3 py-1.5 text-xs font-mono border-2 transition-colors ${active === 'all' ? 'bg-bone text-ink border-bone' : 'border-bone/30 hover:border-bone/60'}`}
            >全部 / ALL ({tools.length})</button>
            {CATEGORIES.map(c => {
              const count = tools.filter(t => t.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`px-3 py-1.5 text-xs font-mono border-2 transition-colors ${active === c.id ? 'bg-bone text-ink border-bone' : 'border-bone/30 hover:border-bone/60'}`}
                >{c.cn} / {c.label.toUpperCase()} ({count})</button>
              );
            })}
          </div>
          <div className="relative w-full md:w-72">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone/40" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="搜索工具 / SEARCH…"
              className="bg-transparent border-2 border-bone/30 focus:border-volt focus:outline-none pl-8 pr-3 py-1.5 text-sm font-mono w-full"
            />
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        {/* 当前过滤状态条 */}
        <div className="mb-6 flex items-center gap-2 flex-wrap font-mono text-xs">
          <span className="text-bone/40">▸</span>
          <span className="text-bone/60">SHOWING</span>
          <span className="text-volt font-bold">{filtered.length}</span>
          <span className="text-bone/40">/</span>
          <span className="text-bone/60">{tools.length}</span>
          {active !== 'all' && (
            <>
              <span className="text-bone/30">·</span>
              <span className="text-bone/40">CAT</span>
              <span className="text-bone">{active.toUpperCase()}</span>
            </>
          )}
          {activeTag !== 'all' && (
            <Tag cat={activeTag} size="xs" variant="solid" showId />
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-32 text-center font-mono text-bone/50">NO TOOLS FOUND / 没有匹配的工具</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 stagger">
            {filtered.map(t => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </section>

      {/* LEGEND — 9 tag 色板底注 */}
      <section className="border-t-2 border-bone/20 bg-bone/5">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="font-mono text-[10px] text-bone/60 mb-3">▸ TAG LEGEND / 9 类目色板 — 见 [codex]→F</div>
          <TagLegend size="sm" />
        </div>
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const cat = CATEGORIES.find(c => c.id === tool.category)!;
  const primaryTag = inferPrimaryTag(tool);
  return (
    <Link
      to={`/tool/${tool.slug}`}
      className="group block border-2 border-bone/20 hover:border-bone bg-ink overflow-hidden focus:outline-none focus:border-volt hover-lift"
    >
      <div className="aspect-[4/3] relative overflow-hidden border-b-2 border-bone/20">
        <tool.Preview />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-ink/90 border border-bone/30 text-[10px] font-mono uppercase">{cat.cn}</span>
          <Tag cat={primaryTag} size="xs" variant="dot" showId />
        </div>
        <div className="absolute top-2 right-2 w-8 h-8 bg-bone text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="font-display font-black text-lg leading-tight">{tool.name}</div>
          <Tag cat={primaryTag} size="xs" variant="ghost" />
        </div>
        <div className="text-xs text-bone/60 mt-1 line-clamp-2">{tool.description}</div>
        <div className="flex flex-wrap gap-1 mt-2">
          {tool.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 bg-bone/10 text-bone/70">#{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
