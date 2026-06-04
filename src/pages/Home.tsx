import { useMemo, useState } from 'react';
import { CATEGORIES, tools, type Category } from '../data/tools';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  forcedCategory?: Category;
}

export default function Home({ forcedCategory }: Props) {
  const [params, setParams] = useSearchParams();
  const initial = (forcedCategory || (params.get('cat') as Category)) || 'all';
  const [active, setActive] = useState<string>(initial);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return tools.filter(t => {
      const matchCat = active === 'all' || t.category === active;
      const matchQ = !q || (t.name + t.description + t.tags.join(' ')).toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [active, q]);

  const setCat = (id: string) => {
    setActive(id);
    if (id === 'all') setParams({});
    else setParams({ cat: id });
  };

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-bone/20 px-6 py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6 font-mono text-xs">
            <span className="w-2 h-2 bg-volt rounded-full animate-pulse" />
            <span className="text-bone/60">A LIVING ARCHIVE / 28 TOOLS / 5 CATEGORIES</span>
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
        <div className="absolute -right-20 top-10 hidden md:block opacity-10 font-display font-black text-[20rem] leading-none text-bone select-none">★</div>
      </section>

      {/* CONTROL BAR */}
      <section className="border-b-2 border-bone/20 sticky top-[72px] z-40 bg-ink/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCat('all')}
              className={`px-3 py-1.5 text-xs font-mono border-2 transition-colors ${active === 'all' ? 'bg-volt text-ink border-volt' : 'border-bone/40 hover:border-bone'}`}
            >全部 / ALL ({tools.length})</button>
            {CATEGORIES.map(c => {
              const count = tools.filter(t => t.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`px-3 py-1.5 text-xs font-mono border-2 transition-colors ${active === c.id ? 'bg-volt text-ink border-volt' : 'border-bone/40 hover:border-bone'}`}
                >{c.cn} / {c.label.toUpperCase()} ({count})</button>
              );
            })}
          </div>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜索工具 / SEARCH…"
            className="bg-transparent border-2 border-bone/40 focus:border-volt focus:outline-none px-3 py-1.5 text-sm font-mono w-full md:w-72"
          />
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="py-32 text-center font-mono text-bone/50">NO TOOLS FOUND / 没有匹配的工具</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(t => <ToolCard key={t.slug} tool={t} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: typeof tools[number] }) {
  const cat = CATEGORIES.find(c => c.id === tool.category)!;
  return (
    <Link
      to={`/tool/${tool.slug}`}
      className="group block border-2 border-bone/20 hover:border-bone bg-ink overflow-hidden focus:outline-none focus:border-volt"
    >
      <div className="aspect-[4/3] relative overflow-hidden border-b-2 border-bone/20">
        <tool.Preview />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <span className="px-2 py-0.5 bg-ink/90 border border-bone/30 text-[10px] font-mono uppercase">{cat.cn}</span>
        </div>
        <div className="absolute top-2 right-2 w-8 h-8 bg-bone text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div className="p-3">
        <div className="font-display font-black text-lg leading-tight">{tool.name}</div>
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
