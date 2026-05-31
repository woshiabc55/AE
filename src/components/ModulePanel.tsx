import { usePromptStore } from '@/store/usePromptStore';
import { presetModules } from '@/data/presets';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types';
import type { ModuleCategory } from '@/types';
import {
  User, Cat, Mountain, Building, Palette, Monitor, Camera, Sparkles,
  Trees, Building2, Cloud, Smile, CloudRain, Sword, Sun, Grid3x3,
  Diamond, Type, ChevronDown, ChevronRight, Plus, Search,
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>> = {
  User, Cat, Mountain, Building, Palette, Monitor, Camera, Sparkles,
  Trees, Building2, Cloud, Smile, CloudRain, Sword, Sun, Grid3x3,
  Diamond, Type,
};

const categories: (ModuleCategory | 'all')[] = ['all', 'subject', 'style', 'scene', 'mood', 'technique', 'custom'];

export default function ModulePanel() {
  const { moduleFilter, setModuleFilter, addBlock } = usePromptStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['subject', 'style']));

  const filteredModules = presetModules.filter((m) => {
    const matchesCategory = moduleFilter === 'all' || m.category === moduleFilter;
    const matchesSearch = !searchQuery || m.name.includes(searchQuery) || m.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const groupedModules: Record<string, typeof filteredModules> = {};
  for (const mod of filteredModules) {
    if (!groupedModules[mod.category]) groupedModules[mod.category] = [];
    groupedModules[mod.category].push(mod);
  }

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-[#1a1a2e] bg-[#0d0d18] flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-[#1a1a2e]">
        <h2 className="text-sm font-semibold text-[#00ffd5] tracking-wider uppercase mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          概念模块
        </h2>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a4a6a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索模块..."
            className="w-full bg-[#12121f] border border-[#1a1a2e] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#c0c0d0] placeholder-[#4a4a6a] focus:outline-none focus:border-[#00ffd5]/50 focus:shadow-[0_0_8px_rgba(0,255,213,0.15)] transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 p-2 border-b border-[#1a1a2e]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setModuleFilter(cat)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              moduleFilter === cat
                ? 'bg-[#00ffd5]/20 text-[#00ffd5] shadow-[0_0_6px_rgba(0,255,213,0.2)]'
                : 'bg-[#12121f] text-[#6a6a8a] hover:text-[#c0c0d0] hover:bg-[#1a1a2e]'
            }`}
          >
            {cat === 'all' ? '全部' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {Object.entries(groupedModules).map(([cat, modules]) => (
          <div key={cat}>
            <button
              onClick={() => toggleCat(cat)}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[#8a8aaa] hover:text-[#c0c0d0] transition-colors"
            >
              {expandedCats.has(cat) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat as ModuleCategory] }}
              />
              {CATEGORY_LABELS[cat as ModuleCategory]}
              <span className="ml-auto text-[10px] text-[#4a4a6a]">{modules.length}</span>
            </button>
            {expandedCats.has(cat) && (
              <div className="space-y-1 ml-2">
                {modules.map((mod) => {
                  const IconComp = iconMap[mod.icon];
                  return (
                    <div
                      key={mod.id}
                      className="group flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#12121f] border border-[#1a1a2e] hover:border-[#00ffd5]/30 cursor-grab active:cursor-grabbing transition-all hover:shadow-[0_0_10px_rgba(0,255,213,0.1)]"
                      onClick={() => addBlock(mod.id)}
                    >
                      {IconComp && (
                        <IconComp
                          size={14}
                          className="flex-shrink-0"
                          color={mod.color}
                        />
                      )}
                      <span className="text-[11px] text-[#c0c0d0] flex-1 truncate">{mod.name}</span>
                      <Plus
                        size={12}
                        className="text-[#4a4a6a] group-hover:text-[#00ffd5] transition-colors flex-shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
