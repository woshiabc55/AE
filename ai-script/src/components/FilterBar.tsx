import { useScriptStore } from '../store/useScriptStore';
import { ACTS } from '../data/catalog';
import { Search, Filter, Globe, Film } from 'lucide-react';
import { cn } from '../utils/cn';

// 筛选条 + Reel 入口
export default function FilterBar() {
  const query = useScriptStore((s) => s.query);
  const setQuery = useScriptStore((s) => s.setQuery);
  const freeOnly = useScriptStore((s) => s.freeOnly);
  const setFreeOnly = useScriptStore((s) => s.setFreeOnly);
  const cnOnly = useScriptStore((s) => s.cnOnly);
  const setCnOnly = useScriptStore((s) => s.setCnOnly);
  const setActiveAct = useScriptStore((s) => s.setActiveAct);
  const reelCount = useScriptStore((s) => s.reel.length);
  const toggleReelOpen = useScriptStore((s) => s.toggleReelOpen);

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
                document
                  .getElementById(`act-${act.id}`)
                  ?.scrollIntoView({ behavior: 'smooth' });
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

      {/* 第二行：Reel 入口 */}
      <div className="max-w-scriptwide mx-auto px-6 pb-3 -mt-1">
        <button
          onClick={toggleReelOpen}
          className={cn(
            'group w-full sm:w-auto flex items-center justify-between gap-3 px-3 py-2 border transition-colors',
            reelCount > 0
              ? 'border-clapper-500/60 bg-clapper-500/5 hover:bg-clapper-500/10'
              : 'border-gilt-600/40 bg-carbon-900/40 hover:border-clapper-500/60'
          )}
        >
          <div className="flex items-center gap-2">
            <Film
              size={14}
              className={cn(
                'transition-colors',
                reelCount > 0
                  ? 'text-clapper-500'
                  : 'text-gilt-300 group-hover:text-clapper-500'
              )}
            />
            <span className="slate text-[11px] text-parchment-100">
              MY REEL · 我的片集合
            </span>
            <span
              className={cn(
                'slate text-[9px] px-1.5 py-0.5 border',
                reelCount > 0
                  ? 'border-clapper-500 text-clapper-500'
                  : 'border-gilt-600/60 text-gilt-300'
              )}
            >
              {reelCount.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="slate text-[9px] text-gilt-300/70 hidden sm:inline">
            {reelCount > 0
              ? '点击查看 / 跳转 / 编辑标注'
              : '把喜欢的场次装进卷盘 →'}
          </span>
        </button>
      </div>
    </div>
  );
}
