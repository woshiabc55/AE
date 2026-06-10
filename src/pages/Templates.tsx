import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { templatesApi } from '@/api/templates';
import { categories } from '@/mock/categories';
import type { Template, CategoryId } from '@/types';
import TemplateCard from '@/components/TemplateCard';

export default function Templates() {
  const [params, setParams] = useSearchParams();
  const initialCategory = (params.get('category') as CategoryId) || null;
  const [all, setAll] = useState<Template[]>([]);
  const [q, setQ] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(initialCategory);
  const [sort, setSort] = useState<'hot' | 'rating' | 'new'>('hot');

  useEffect(() => {
    templatesApi.list().then(setAll);
  }, []);

  useEffect(() => {
    if (activeCategory) {
      params.set('category', activeCategory);
    } else {
      params.delete('category');
    }
    setParams(params, { replace: true });
  }, [activeCategory]);

  const filtered = useMemo(() => {
    let result = all;
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(lower))
      );
    }
    result = [...result];
    if (sort === 'hot') result.sort((a, b) => b.usageCount - a.usageCount);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'new') result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return result;
  }, [all, q, activeCategory, sort]);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500/70">
            · 模板广场
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-cream-50 sm:text-5xl">
            {activeCategory
              ? categories.find((c) => c.id === activeCategory)?.name || '模板广场'
              : '全部模板'}
          </h1>
          <p className="mt-2 text-sm text-cream-200/50">
            共 {filtered.length} 个模板 · 按使用量排序
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-200/30" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索标题、标签..."
              className="input-base w-64 pl-9 pr-8"
            />
            {q && (
              <button onClick={() => setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-cream-200/30 hover:text-cream-100">
                <X size={12} />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="input-base w-32 cursor-pointer"
          >
            <option value="hot">最热门</option>
            <option value="rating">最高分</option>
            <option value="new">最新</option>
          </select>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 text-xs font-medium transition-all ${
            activeCategory === null
              ? 'bg-gold-500 text-ink-900'
              : 'border border-ink-500 text-cream-200/60 hover:border-gold-500 hover:text-gold-500'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-gold-500 text-ink-900'
                : 'border border-ink-500 text-cream-200/60 hover:border-gold-500 hover:text-gold-500'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="font-display text-2xl text-cream-200/40">没有匹配的模板</p>
            <p className="mt-2 text-sm text-cream-200/30">试试调整筛选条件</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t, i) => (
            <TemplateCard key={t.id} template={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
