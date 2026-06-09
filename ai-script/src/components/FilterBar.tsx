import { useScriptStore } from '../store/useScriptStore';
import { ACTS } from '../data/catalog';
import { Search, Filter, Globe } from 'lucide-react';
import { cn } from '../utils/cn';

// 筛选条
export default function FilterBar() {
  const query = useScriptStore((s) => s.query);
  const setQuery = useScriptStore((s) => s.setQuery);
  const freeOnly = useScriptStore((s) => s.freeOnly);
  const setFreeOnly = useScriptStore((s) => s.setFreeOnly);
  const cnOnly = useScriptStore((s) => s.cnOnly);
  const setCnOnly = useScriptStore((s) => s.setCnOnly);
  const setActiveAct = useScriptStore((s) => s.setActiveAct);

  return (
    <div className="border-y border-gilt-600/40 bg-carbon-800/60 backdrop-blur-sm">
      <div className="max-w-scriptwide mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
        {/* 搜索框 */}
        <div className="flex items-center gap-2 border border-gilt-600/60 px-3 py-1.5 flex-1 min-w-[220px] max-w-md">
          <Search size={14} className="text-gilt-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜工具 / 厂牌 / 标签"
            className="bg-transparent outline-none text-sm text-parchment-100 placeholder:text-gilt-300/40 font-mono w-full"
          />
        </div>

        {/* 幕跳转 */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {ACTS.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                setActiveAct(act.id);
                document.getElementById(`act-${act.id}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="slate text-[10px] text-parchment-100/70 hover:text-clapper-500 px-2 py-1 border border-transparent hover:border-gilt-600/60 transition-colors whitespace-nowrap"
            >
              {act.roman} · {act.title}
            </button>
          ))}
        </div>

        {/* 筛选 */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={cn(
              'slate text-[10px] flex items-center gap-1 px-2 py-1 border transition-colors',
              freeOnly
                ? 'border-clapper-500 text-clapper-500 bg-clapper-500/10'
                : 'border-gilt-600/60 text-parchment-100/70 hover:border-gilt-400'
            )}
          >
            <Filter size={10} />
            FREE
          </button>
          <button
            onClick={() => setCnOnly(!cnOnly)}
            className={cn(
              'slate text-[10px] flex items-center gap-1 px-2 py-1 border transition-colors',
              cnOnly
                ? 'border-clapper-500 text-clapper-500 bg-clapper-500/10'
                : 'border-gilt-600/60 text-parchment-100/70 hover:border-gilt-400'
            )}
          >
            <Globe size={10} />
            中文友好
          </button>
        </div>
      </div>
    </div>
  );
}
