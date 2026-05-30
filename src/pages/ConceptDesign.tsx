import { conceptSections } from '@/data/concept';
import { useState } from 'react';
import { ChevronRight, Tag } from 'lucide-react';

export default function ConceptDesign() {
  const [activeId, setActiveId] = useState<string | null>(null);

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
            <h1 className="text-lg font-black">提示词概念设计</h1>
            <span className="font-mono-cn text-[10px] text-[#909090] border border-[#d0d0d0] px-2 py-0.5">
              CONCEPT DESIGN v1.0
            </span>
          </div>
          <div className="font-mono-cn text-[10px] text-[#909090]">
            7层架构 · 双策略分化 · 模块化可扩展
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="paper-card p-0 sticky top-24 overflow-hidden">
            <div className="border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
                概念导航 / CONCEPTS
              </span>
            </div>
            <nav className="py-2">
              {conceptSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveId(section.id);
                    document.getElementById(`concept-${section.id}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-xs flex items-center gap-2
                    transition-all duration-150 cursor-pointer
                    ${activeId === section.id ? 'bg-[#1a3a6b] text-white' : 'text-[#1a1a1a] hover:bg-[#f0f0f0]'}
                  `}
                >
                  <ChevronRight size={10} className={activeId === section.id ? 'text-white' : 'text-[#909090]'} />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-black">概念设计</span>
            <span className="text-3xl font-black qblue-accent">框架</span>
          </div>
          <p className="text-sm text-[#606060] max-w-3xl leading-relaxed">
            本系统的提示词构建基于7层递进法，每一层都是独立可替换的模块。
            方案A与方案B在风格层和构图层产生关键分化，形成「保存者」与「考古者」的双重性对话。
          </p>

          <div className="grid grid-cols-7 gap-2 my-6">
            {["本体", "纹饰", "风格", "构图", "浮动", "文字", "装饰"].map((label, i) => (
              <div key={label} className="paper-card p-3 text-center">
                <div className="w-6 h-6 mx-auto mb-2 flex items-center justify-center border border-[#1a3a6b] text-[10px] font-mono-cn text-[#1a3a6b]">
                  {i + 1}
                </div>
                <span className="text-[11px] font-bold">{label}</span>
                <span className="block text-[9px] text-[#909090] font-mono-cn mt-0.5">L{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 my-8">
            <div className="w-2 h-2 rounded-full bg-[#1a3a6b]" />
            <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
              详细论述 / DETAILED DISCOURSE
            </span>
          </div>

          {conceptSections.map((section, i) => (
            <div
              key={section.id}
              id={`concept-${section.id}`}
              className="paper-card corner-bracket p-0 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="border-b border-[#1a1a1a] px-5 py-3 flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center border border-[#1a3a6b] text-[10px] font-mono-cn text-[#1a3a6b]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-sm font-bold">{section.title}</h3>
                  <span className="font-mono-cn text-[10px] text-[#909090]">{section.subtitle}</span>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm leading-[1.9] text-[#1a1a1a]">{section.content}</p>
              </div>
              <div className="border-t border-dashed border-[#d0d0d0] px-5 py-3 flex items-center gap-2 flex-wrap">
                <Tag size={10} className="text-[#909090]" />
                {section.tags.map((tag) => (
                  <span key={tag} className="param-highlight">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-[#d0d0d0] mt-16 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-mono-cn text-[10px] text-[#909090]">
          <span>瓷器设计·青花瓷 CONCEPT DESIGN SYSTEM</span>
          <span>7-LAYER ARCHITECTURE</span>
        </div>
      </footer>
    </div>
  );
}
