import { useState, useMemo } from 'react';
import { designDB, type DesignConcept } from '@/data/designDB';
import { Search, Filter, ChevronRight, Tag, Database, X } from 'lucide-react';

const categories = [
  { id: 'all', label: '全部', icon: '◉' },
  { id: 'qinghua-patterns', label: '青花瓷纹饰', icon: '🏺' },
  { id: 'fractal-geometry', label: '分形几何', icon: '◇' },
  { id: 'offline-archive', label: '离线档案美学', icon: '📁' },
  { id: 'color-systems', label: '色彩系统', icon: '🎨' },
  { id: 'composition', label: '构图法则', icon: '📐' },
  { id: 'typography', label: '文字排版', icon: 'T' },
  { id: 'decorative', label: '装饰元素', icon: '✦' },
  { id: 'textures', label: '质感纹理', icon: '▦' },
  { id: 'cultural', label: '文化符号', icon: '☯' },
  { id: 'technical', label: '技术框架', icon: '⚙' },
];

export default function DesignDatabase() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<DesignConcept | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = designDB;
    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (tagFilter) {
      result = result.filter((c) => c.tags.includes(tagFilter));
    }
    return result;
  }, [categoryFilter, searchQuery, tagFilter]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    designDB.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    designDB.forEach((c) => {
      stats[c.category] = (stats[c.category] || 0) + 1;
    });
    return stats;
  }, []);

  const getRelatedConcepts = (concept: DesignConcept): DesignConcept[] => {
    return concept.relatedIds
      .map((id) => designDB.find((c) => c.id === id))
      .filter(Boolean) as DesignConcept[];
  };

  return (
    <div className="min-h-screen grid-bg relative">
      <div className="crop-mark crop-mark-tl" />
      <div className="crop-mark crop-mark-tr" />
      <div className="crop-mark crop-mark-bl" />
      <div className="crop-mark crop-mark-br" />

      <header className="border-b border-[#1a1a1a] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-[#606060] hover:text-[#1a1a1a] transition-colors text-sm font-mono-cn">
              ← 首页
            </a>
            <div className="w-px h-5 bg-[#d0d0d0]" />
            <Database size={16} className="text-[#1a3a6b]" />
            <h1 className="text-lg font-black">设计概念数据库</h1>
            <span className="font-mono-cn text-[10px] text-[#909090] border border-[#d0d0d0] px-2 py-0.5">
              {designDB.length} ENTRIES
            </span>
          </div>
          <div className="font-mono-cn text-[10px] text-[#909090]">
            10分类 · 200条 · 全局设计概念
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-black">设计概念</span>
          <span className="text-2xl font-black qblue-accent">数据库</span>
          <span className="font-mono-cn text-xs text-[#909090]">DESIGN CONCEPT DATABASE</span>
        </div>

        <div className="paper-card p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#909090]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索概念名称、描述、标签..."
                className="w-full pl-8 pr-3 py-2 text-xs font-mono-cn border border-[#d0d0d0] bg-white focus:border-[#1a3a6b] outline-none"
              />
            </div>
            {tagFilter && (
              <button
                onClick={() => setTagFilter(null)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn bg-[#1a3a6b] text-white cursor-pointer"
              >
                <Tag size={8} />
                {tagFilter}
                <X size={8} />
              </button>
            )}
            <span className="font-mono-cn text-[10px] text-[#909090]">
              显示 {filtered.length} / {designDB.length}
            </span>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="w-48 shrink-0">
            <div className="paper-card p-0 sticky top-24 overflow-hidden">
              <div className="border-b border-[#1a1a1a] px-3 py-2">
                <span className="font-mono-cn text-[10px] text-[#606060] flex items-center gap-1">
                  <Filter size={10} />
                  分类筛选
                </span>
              </div>
              <nav className="py-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategoryFilter(cat.id); setTagFilter(null); }}
                    className={`w-full text-left px-3 py-2 text-[11px] flex items-center justify-between transition-all cursor-pointer ${
                      categoryFilter === cat.id ? 'bg-[#1a3a6b] text-white' : 'text-[#1a1a1a] hover:bg-[#f0f0f0]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-[10px]">{cat.icon}</span>
                      {cat.label}
                    </span>
                    {cat.id !== 'all' && (
                      <span className={`font-mono-cn text-[9px] ${categoryFilter === cat.id ? 'text-[#a8c8e8]' : 'text-[#909090]'}`}>
                        {categoryStats[cat.id] || 0}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {selectedConcept ? (
              <div className="paper-card corner-bracket p-0 overflow-hidden mb-6">
                <div className="border-b border-[#1a3a6b] bg-[#1a3a6b] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-white text-[#1a3a6b] text-xs font-mono-cn font-bold">
                      {selectedConcept.id}
                    </span>
                    <div>
                      <h2 className="text-white font-bold">{selectedConcept.name}</h2>
                      <span className="font-mono-cn text-[10px] text-[#a8c8e8]">{selectedConcept.nameEn}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConcept(null)}
                    className="text-white hover:text-[#a8c8e8] cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-mono-cn text-[10px] text-[#909090]">分类</span>
                      <p className="mt-0.5">{categories.find((c) => c.id === selectedConcept.category)?.label} / {selectedConcept.subcategory}</p>
                    </div>
                    <div>
                      <span className="font-mono-cn text-[10px] text-[#909090]">来源</span>
                      <p className="mt-0.5">{selectedConcept.source}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-mono-cn text-[10px] text-[#1a3a6b] font-medium">描述</span>
                    <p className="text-sm leading-relaxed mt-1">{selectedConcept.description}</p>
                  </div>
                  <div>
                    <span className="font-mono-cn text-[10px] text-[#1a3a6b] font-medium">标签</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedConcept.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setTagFilter(tag)}
                          className="param-highlight cursor-pointer hover:bg-[#1a3a6b] hover:text-white transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedConcept.params.length > 0 && (
                    <div>
                      <span className="font-mono-cn text-[10px] text-[#1a3a6b] font-medium">参数</span>
                      <div className="mt-1 space-y-1">
                        {selectedConcept.params.map((p) => (
                          <div key={p.key} className="flex items-center gap-2 text-xs">
                            <span className="font-mono-cn text-[#606060] w-20">{p.label}</span>
                            <span className="param-highlight text-[9px]">{p.type}</span>
                            <span className="font-mono-cn">{p.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedConcept.relatedIds.length > 0 && (
                    <div>
                      <span className="font-mono-cn text-[10px] text-[#1a3a6b] font-medium">关联概念</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {getRelatedConcepts(selectedConcept).map((rel) => (
                          <button
                            key={rel.id}
                            onClick={() => setSelectedConcept(rel)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#d0d0d0] hover:border-[#1a3a6b] hover:text-[#1a3a6b] transition-all cursor-pointer"
                          >
                            <span className="text-[8px] text-[#909090]">#{rel.id}</span>
                            {rel.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept)}
                  className={`paper-card p-0 overflow-hidden text-left transition-all cursor-pointer hover:shadow-lg ${
                    selectedConcept?.id === concept.id ? 'ring-1 ring-[#1a3a6b]' : ''
                  }`}
                >
                  <div className="px-3 py-2.5 flex items-start gap-2">
                    <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-[#1a3a6b] text-[9px] font-mono-cn text-[#1a3a6b]">
                      {concept.id}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{concept.name}</span>
                        <span className="text-[8px] font-mono-cn text-[#909090] truncate">{concept.nameEn}</span>
                      </div>
                      <p className="text-[10px] text-[#606060] mt-0.5 line-clamp-2 leading-relaxed">
                        {concept.description.slice(0, 60)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {concept.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[8px] font-mono-cn px-1 py-0.5 bg-[#f0f0f0] text-[#606060]">
                            {tag}
                          </span>
                        ))}
                        {concept.tags.length > 3 && (
                          <span className="text-[8px] font-mono-cn text-[#909090]">+{concept.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Database size={32} className="mx-auto text-[#d0d0d0] mb-3" />
                <p className="font-mono-cn text-xs text-[#909090]">无匹配结果</p>
                <button
                  onClick={() => { setCategoryFilter('all'); setSearchQuery(''); setTagFilter(null); }}
                  className="mt-2 text-[10px] font-mono-cn text-[#1a3a6b] hover:underline cursor-pointer"
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-[#d0d0d0] mt-16 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-mono-cn text-[10px] text-[#909090]">
          <span>瓷器设计·青花瓷 DESIGN CONCEPT DATABASE</span>
          <span>{designDB.length} entries · 10 categories</span>
        </div>
      </footer>
    </div>
  );
}
