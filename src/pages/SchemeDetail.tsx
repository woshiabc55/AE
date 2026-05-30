import { useParams, Link } from 'react-router-dom';
import { getSchemeById } from '@/data/schemes';
import PromptDisplay from '@/components/PromptDisplay';
import PreviewImage from '@/components/PreviewImage';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>();
  const scheme = getSchemeById(id || '');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!scheme) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="paper-card p-8 text-center">
          <p className="font-mono-cn text-sm text-[#606060]">未找到方案 / SCHEME NOT FOUND</p>
          <Link to="/" className="text-[#1a3a6b] text-xs mt-4 inline-block hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg relative">
      <div className="crop-mark crop-mark-tl" />
      <div className="crop-mark crop-mark-tr" />
      <div className="crop-mark crop-mark-bl" />
      <div className="crop-mark crop-mark-br" />

      <header className="border-b border-[#1a1a1a] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[#606060] hover:text-[#1a1a1a] transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="w-px h-5 bg-[#d0d0d0]" />
            <span className="param-highlight">{scheme.tag}</span>
            <h1 className="text-lg font-black">{scheme.name}</h1>
            <span className="text-sm text-[#606060]">— {scheme.subtitle}</span>
          </div>
          <div className="font-mono-cn text-[10px] text-[#909090]">
            SCHEME_{scheme.id.toUpperCase()} / STRUCTURED VIEW
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="paper-card p-0 sticky top-24 overflow-hidden">
            <div className="border-b border-[#1a1a1a] px-4 py-3">
              <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
                结构导航 / NAV
              </span>
            </div>
            <nav className="py-2">
              {scheme.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-xs flex items-center gap-2
                    transition-all duration-150 cursor-pointer
                    ${
                      activeSection === section.id
                        ? 'bg-[#1a3a6b] text-white'
                        : 'text-[#1a1a1a] hover:bg-[#f0f0f0]'
                    }
                  `}
                >
                  <ChevronRight size={10} className={activeSection === section.id ? 'text-white' : 'text-[#909090]'} />
                  {section.title}
                </button>
              ))}
            </nav>
            <div className="border-t border-[#d0d0d0] px-4 py-3">
              <Link
                to="/"
                className="font-mono-cn text-[10px] text-[#1a3a6b] hover:underline"
              >
                ← 返回总览
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-8">
          <PreviewImage scheme={scheme} />

          <div className="space-y-6">
            {scheme.sections.map((section, i) => (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className="paper-card p-0 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="border-b border-[#1a1a1a] px-5 py-3 flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center border border-[#1a3a6b] text-[10px] font-mono-cn text-[#1a3a6b]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-bold">{section.title}</h3>
                  <span className="font-mono-cn text-[10px] text-[#909090]">
                    /{section.id.toUpperCase()}
                  </span>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm leading-relaxed text-[#1a1a1a]">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <h3 className="font-mono-cn text-xs tracking-wider text-[#1a3a6b] mb-4">
              完整提示词 / FULL PROMPT
            </h3>
            <PromptDisplay scheme={scheme} />
          </div>
        </div>
      </div>

      <footer className="border-t border-[#d0d0d0] mt-16 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-mono-cn text-[10px] text-[#909090]">
          <span>瓷器设计·青花瓷 OFFLINE ARCHIVE PROMPT SYSTEM</span>
          <span>{scheme.tag} / STRUCTURED VIEW</span>
        </div>
      </footer>
    </div>
  );
}
