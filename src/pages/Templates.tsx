import { usePromptStore } from '@/store/usePromptStore';
import { presetTemplates } from '@/data/presets';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Search, Palette, PenTool, Code2, Music,
  ArrowRight, Tag,
} from 'lucide-react';
import { useState } from 'react';

const categoryIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>> = {
  '绘画': Palette,
  '写作': PenTool,
  '编程': Code2,
  '音乐': Music,
};

const categories = ['全部', ...new Set(presetTemplates.map((t) => t.category))];

export default function Templates() {
  const { loadTemplate } = usePromptStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const filtered = presetTemplates.filter((t) => {
    const matchesCategory = activeCategory === '全部' || t.category === activeCategory;
    const matchesSearch = !searchQuery ||
      t.name.includes(searchQuery) ||
      t.description.includes(searchQuery) ||
      t.tags.some((tag) => tag.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    loadTemplate(templateId);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]" style={{
      backgroundImage: `
        radial-gradient(ellipse at 20% 0%, rgba(0,255,213,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(255,107,53,0.04) 0%, transparent 50%),
        radial-gradient(circle at 1px 1px, #1a1a2e 1px, transparent 0)
      `,
      backgroundSize: '100% 100%, 100% 100%, 24px 24px',
    }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ffd5]/10 border border-[#00ffd5]/20 mb-4">
            <Sparkles size={12} className="text-[#00ffd5]" />
            <span className="text-[10px] text-[#00ffd5] tracking-wider uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              模板库
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#e0e0f0] mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            提示词模板
          </h1>
          <p className="text-sm text-[#6a6a8a]">选择预设模板，快速开始创作</p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4a6a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索模板..."
              className="w-full bg-[#0d0d18] border border-[#1a1a2e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#c0c0d0] placeholder-[#4a4a6a] focus:outline-none focus:border-[#00ffd5]/50 focus:shadow-[0_0_12px_rgba(0,255,213,0.15)] transition-all"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-[#00ffd5]/15 text-[#00ffd5] border border-[#00ffd5]/30 shadow-[0_0_10px_rgba(0,255,213,0.15)]'
                      : 'bg-[#0d0d18] text-[#6a6a8a] border border-[#1a1a2e] hover:border-[#2a2a4e] hover:text-[#c0c0d0]'
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#4a4a6a]">没有找到匹配的模板</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((template) => {
              const Icon = categoryIcons[template.category] || Sparkles;
              return (
                <div
                  key={template.id}
                  className="group relative bg-[#0d0d18] border border-[#1a1a2e] rounded-2xl overflow-hidden hover:border-[#00ffd5]/30 hover:shadow-[0_0_20px_rgba(0,255,213,0.08)] transition-all duration-300"
                >
                  <div
                    className="h-32 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${getTemplateGradient(template.id)})`,
                    }}
                  >
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
                      backgroundSize: '16px 16px',
                    }} />
                    <Icon size={40} className="text-white/60 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#e0e0f0] mb-1">{template.name}</h3>
                    <p className="text-xs text-[#6a6a8a] mb-3 line-clamp-2">{template.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#12121f] text-[9px] text-[#6a6a8a]">
                          <Tag size={8} />{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#4a4a6a]">{template.blocks.length} 个模块</span>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00ffd5]/10 text-[#00ffd5] text-xs font-medium border border-[#00ffd5]/20 hover:bg-[#00ffd5]/20 hover:shadow-[0_0_10px_rgba(0,255,213,0.2)] transition-all"
                      >
                        使用 <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getTemplateGradient(id: string): string {
  const gradients: Record<string, string> = {
    'tpl-cyber-portrait': '#0a2a3a, #1a0a2a',
    'tpl-fantasy-landscape': '#0a2a1a, #1a1a3a',
    'tpl-anime-character': '#2a1a3a, #1a2a3a',
    'tpl-dark-architecture': '#1a0a0a, #0a1a2a',
    'tpl-cute-animal': '#2a1a2a, #1a2a1a',
  };
  return gradients[id] || '#0a1a2a, #1a0a2a';
}
