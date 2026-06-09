// 模板展厅
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowUpDown, Bookmark, ArrowRight } from 'lucide-react';
import { CoverArt, CategoryTag, Badge, Button, SearchInput, EmptyState } from '../components/ui';
import { TemplateService } from '../services/template';
import { CATEGORIES } from '../data/templates.seed';
import type { Template, Category } from '../types';
import { useApp } from '../store/useApp';
import { cn, compactNumber } from '../lib/utils';

type SortKey = 'newest' | 'popular' | 'favorites';

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const cat = (params.get('cat') as Category | 'all' | null) ?? 'all';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [items, setItems] = useState<Template[] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const nav = useNavigate();
  const { favorites, toggleFavorite } = useApp();

  useEffect(() => {
    TemplateService.list({
      category: cat === 'all' ? undefined : (cat as Category),
      search,
      sort,
      tags: tagFilter.length ? tagFilter : undefined,
    }).then(setItems);
  }, [cat, search, sort, tagFilter]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    (items ?? []).forEach((t) => t.tags.forEach((tg) => set.add(tg)));
    return [...set];
  }, [items]);

  return (
    <div className="min-h-screen">
      {/* Hero 头部 */}
      <section className="border-b border-[var(--ink-4)]">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8 pt-12 pb-8">
          <div className="eyebrow eyebrow-amber mb-3">TEMPLATE GALLERY · 模板展厅</div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="display text-5xl lg:text-6xl text-[var(--paper-0)]">挑选一个剧目<br />开始你的下一次调用</h1>
            <SearchInput value={search} onChange={setSearch} placeholder="搜索标题、标签、作者…" />
          </div>
        </div>
      </section>

      {/* 类别 + 排序 */}
      <div className="sticky top-16 z-20 bg-[rgba(11,11,15,0.85)] backdrop-blur-md border-b border-[var(--ink-4)]">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1">
            <CategoryTab label="全部" active={cat === 'all'} onClick={() => setParams({})} />
            {CATEGORIES.map((c) => (
              <CategoryTab
                key={c.key}
                label={c.label}
                active={cat === c.key}
                onClick={() => setParams({ cat: c.key })}
                catClass={c.key}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={cn(
                'h-9 px-3 inline-flex items-center gap-1.5 text-[12px] rounded-[6px] border transition-colors',
                filterOpen
                  ? 'bg-[var(--ink-3)] border-[var(--ink-5)] text-[var(--paper-0)]'
                  : 'border-[var(--ink-4)] text-[var(--paper-2)] hover:border-[var(--ink-5)]'
              )}
            >
              <SlidersHorizontal size={13} /> 筛选 {tagFilter.length > 0 && <span className="ml-1 mono text-[10px] text-[var(--amber-2)]">·{tagFilter.length}</span>}
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 pl-3 pr-8 text-[12px] bg-[var(--ink-3)] border border-[var(--ink-4)] rounded-[6px] text-[var(--paper-1)] cursor-pointer appearance-none"
              >
                <option value="newest" className="bg-[var(--ink-2)]">最新</option>
                <option value="popular" className="bg-[var(--ink-2)]">最热</option>
                <option value="favorites" className="bg-[var(--ink-2)]">收藏最多</option>
              </select>
              <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--paper-3)] pointer-events-none" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[var(--ink-4)] overflow-hidden"
            >
              <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-4 flex flex-wrap items-center gap-2">
                <span className="eyebrow text-[10px] mr-2">TAGS</span>
                {allTags.map((t) => {
                  const on = tagFilter.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => setTagFilter((prev) => (on ? prev.filter((x) => x !== t) : [...prev, t]))}
                      className={cn(
                        'h-7 px-3 text-[11px] rounded-[999px] border transition-colors',
                        on
                          ? 'bg-[rgba(232,177,74,0.12)] border-[var(--amber-2)] text-[var(--amber-1)]'
                          : 'border-[var(--ink-4)] text-[var(--paper-2)] hover:border-[var(--ink-5)]'
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
                {tagFilter.length > 0 && (
                  <button
                    onClick={() => setTagFilter([])}
                    className="ml-2 text-[11px] text-[var(--paper-3)] hover:text-[var(--paper-1)] inline-flex items-center gap-1"
                  >
                    <X size={11} /> 清除
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 列表 */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-8 py-10">
        {items === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] overflow-hidden">
                <div className="h-44 bg-[var(--ink-3)] animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[var(--ink-3)] rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-[var(--ink-3)] rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-[var(--ink-3)] rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="没有找到匹配的剧目"
            hint="尝试调整搜索词、切换类别或清除标签筛选"
            icon={<Search size={24} />}
            action={<Button onClick={() => { setSearch(''); setTagFilter([]); setParams({}); }}>重置筛选</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((t, i) => (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4 }}
                onClick={() => nav(`/gallery/${t.id}`)}
                className="group cursor-pointer rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] overflow-hidden card-hover"
              >
                <div className="relative">
                  <CoverArt seed={t.cover} category={t.category} size="md" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}
                    className={cn(
                      'absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center rounded-[6px] backdrop-blur-sm transition-all',
                      favorites.has(t.id)
                        ? 'bg-[rgba(232,177,74,0.9)] text-[var(--ink-0)]'
                        : 'bg-[rgba(11,11,15,0.6)] text-[var(--paper-1)] hover:bg-[rgba(11,11,15,0.85)]'
                    )}
                    title={favorites.has(t.id) ? '取消收藏' : '收藏'}
                  >
                    <Bookmark size={14} fill={favorites.has(t.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <CategoryTag category={t.category} />
                    <span className="mono text-[10px] text-[var(--paper-3)]">{t.variables.length} 变量</span>
                  </div>
                  <h3 className="display text-[15px] text-[var(--paper-0)] leading-snug group-hover:text-[var(--amber-1)] transition-colors line-clamp-2">
                    {t.title}
                  </h3>
                  <p className="text-[12px] text-[var(--paper-2)] line-clamp-2 leading-relaxed">{t.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-[10px] text-[var(--paper-3)] mono">
                      <span>{compactNumber(t.stats.uses)} 次调用</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--amber-1)] mono opacity-0 group-hover:opacity-100 transition-opacity">
                      打开 <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryTab({ label, active, onClick, catClass }: { label: string; active: boolean; onClick: () => void; catClass?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-9 px-3.5 text-[12px] font-medium tracking-wide whitespace-nowrap rounded-[6px] transition-colors inline-flex items-center gap-2',
        active
          ? 'bg-[var(--ink-3)] text-[var(--paper-0)]'
          : 'text-[var(--paper-2)] hover:text-[var(--paper-0)] hover:bg-[var(--ink-3)]'
      )}
    >
      {catClass && <span className={cn('cat-dot', `cat-${catClass}`)} />}
      {label}
      {active && <span className="w-1 h-1 rounded-full bg-[var(--amber-2)]" />}
    </button>
  );
}
