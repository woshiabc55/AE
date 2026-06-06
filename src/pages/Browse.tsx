import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import WorkCard, { WorkListRow } from '../components/WorkCard';
import WorkDetailDrawer from '../components/WorkDetailDrawer';
import { useAppStore } from '../store/useAppStore';
import { applyFilters } from '../utils/filter';
import { WORKS } from '../data/works';
import type { WorkType } from '../data/types';

const PAGE_SIZE = 60;

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const filters = useAppStore();
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const sort = useAppStore((s) => s.sort);
  const sortDesc = useAppStore((s) => s.sortDesc);
  const setSort = useAppStore((s) => s.setSort);
  const resetFilters = useAppStore((s) => s.resetFilters);
  const toggleType = useAppStore((s) => s.toggleType);
  const toggleIp = useAppStore((s) => s.toggleIp);
  const setQuery = useAppStore((s) => s.setQuery);

  // 初始化时从 URL 参数设置筛选
  useEffect(() => {
    const typeParam = params.get('type');
    const ipParam = params.get('ip');
    const qParam = params.get('q');
    if (typeParam) {
      toggleType(typeParam as WorkType);
      params.delete('type');
    }
    if (ipParam) {
      toggleIp(ipParam);
      params.delete('ip');
    }
    if (qParam) {
      setQuery(qParam);
      params.delete('q');
    }
    if (typeParam || ipParam || qParam) setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => applyFilters(WORKS, {
    query: filters.query,
    types: filters.types,
    regions: filters.regions,
    ipIds: filters.ipIds,
    yearRange: filters.yearRange,
    tags: filters.tags,
    view: filters.view,
    sort: filters.sort,
    sortDesc: filters.sortDesc,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [WORKS, filters.query, filters.types, filters.regions, filters.ipIds, filters.yearRange, filters.tags, filters.sort, filters.sortDesc]);

  // 虚拟滚动
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filters.query, filters.types, filters.regions, filters.ipIds, filters.yearRange, filters.tags, sort, sortDesc]);

  const list = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="relative">
      <div className="container py-10">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* 筛选 */}
          <aside className="hidden lg:block">
            <FilterBar />
          </aside>

          {/* 主区 */}
          <main>
            <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>// BROWSE</span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-cyan">
                  浏览资料库
                </h1>
                <p className="text-sm text-white/50 mt-1">
                  找到 <span className="text-neon-cyan font-mono font-bold">{filtered.length.toLocaleString()}</span> 款衍生作品
                </p>
              </div>

              <div className="flex items-center gap-2">
                <SortButton current={sort} desc={sortDesc} k="popularity" label="热度" onClick={setSort} />
                <SortButton current={sort} desc={sortDesc} k="year" label="年份" onClick={setSort} />
                <SortButton current={sort} desc={sortDesc} k="title" label="名称" onClick={setSort} />
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ViewSwitch view={view} setView={setView} />
                <button
                  onClick={resetFilters}
                  className="lg:hidden text-xs text-white/50 hover:text-neon-pink border border-white/10 hover:border-neon-pink px-2.5 py-1.5 rounded-sm"
                >
                  重置
                </button>
              </div>
            </div>

            {/* 移动端筛选按钮 */}
            <MobileFilters />

            {/* 列表 */}
            {list.length === 0 ? (
              <div className="card-neon p-12 text-center">
                <div className="text-6xl mb-4 opacity-20">∅</div>
                <p className="text-white/50">没有匹配的作品，试试调整筛选条件</p>
                <button onClick={resetFilters} className="btn-neon btn-pink mt-4 mx-auto text-xs">
                  重置筛选
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {list.map((w) => (
                  <WorkCard key={w.id} work={w} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {list.map((w) => (
                  <WorkListRow key={w.id} work={w} />
                ))}
              </div>
            )}

            {/* 加载更多 */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="btn-neon"
                >
                  加载更多（还有 {(filtered.length - visibleCount).toLocaleString()} 条）
                </button>
                <p className="mt-2 text-[10px] text-white/30 font-mono">
                  已显示 {visibleCount.toLocaleString()} / {filtered.length.toLocaleString()}
                </p>
              </div>
            )}
            {!hasMore && list.length > 0 && (
              <div className="mt-8 text-center text-white/30 text-xs font-mono">
                // END_OF_DATASET //
              </div>
            )}
          </main>
        </div>
      </div>

      <WorkDetailDrawer />
    </div>
  );
}

function SortButton({ current, desc, k, label, onClick }: { current: string; desc: boolean; k: 'popularity' | 'year' | 'title'; label: string; onClick: (k: 'popularity' | 'year' | 'title') => void }) {
  const active = current === k;
  return (
    <button
      onClick={() => onClick(k)}
      className={`text-xs px-2.5 py-1.5 rounded-sm border flex items-center gap-1 transition ${
        active
          ? 'border-neon-cyan/60 text-neon-cyan bg-neon-cyan/10'
          : 'border-white/10 text-white/60 hover:border-neon-cyan/40'
      }`}
    >
      {label}
      {active && (desc ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
    </button>
  );
}

function ViewSwitch({ view, setView }: { view: 'grid' | 'list'; setView: (v: 'grid' | 'list') => void }) {
  return (
    <div className="flex border border-white/10 rounded-sm overflow-hidden">
      <button
        onClick={() => setView('grid')}
        className={`p-1.5 ${view === 'grid' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-white/50 hover:text-white'}`}
        title="网格视图"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setView('list')}
        className={`p-1.5 ${view === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-white/50 hover:text-white'}`}
        title="列表视图"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

function MobileFilters() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-neon w-full justify-center"
      >
        筛选 / Filters {open ? '×' : '↓'}
      </button>
      {open && <div className="mt-3"><FilterBar /></div>}
    </div>
  );
}
