import { useState } from 'react';
import { schemes } from '@/data/schemes';
import SchemeCard from '@/components/SchemeCard';
import PromptDisplay from '@/components/PromptDisplay';
import PreviewImage from '@/components/PreviewImage';
import ComparePanel from '@/components/ComparePanel';
import { Link } from 'react-router-dom';
import { Layers, Eye, GitCompare, Lightbulb, Rocket, Wrench, Database, Grid3x3 } from 'lucide-react';

type ViewMode = 'cards' | 'prompt-a' | 'prompt-b' | 'compare';

export default function Home() {
  const [view, setView] = useState<ViewMode>('cards');
  const [schemeA, schemeB] = schemes;

  const tabs: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
    { key: 'cards', label: '总览', icon: <Layers size={14} /> },
    { key: 'prompt-a', label: '方案 A 提示词', icon: <Eye size={14} /> },
    { key: 'prompt-b', label: '方案 B 提示词', icon: <Eye size={14} /> },
    { key: 'compare', label: '对比', icon: <GitCompare size={14} /> },
  ];

  return (
    <div className="min-h-screen grid-bg relative">
      <div className="crop-mark crop-mark-tl" />
      <div className="crop-mark crop-mark-tr" />
      <div className="crop-mark crop-mark-bl" />
      <div className="crop-mark crop-mark-br" />

      <header className="border-b border-[#1a1a1a] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-[#1a3a6b] rotate-45" />
              <h1 className="text-xl font-black tracking-tight">
                瓷器设计<span className="qblue-accent">·</span>青花瓷
              </h1>
            </div>
            <span className="font-mono-cn text-[10px] text-[#909090] border border-[#d0d0d0] px-2 py-0.5">
              OFFLINE ARCHIVE PROMPT SYSTEM v2.4
            </span>
          </div>
          <div className="font-mono-cn text-[10px] text-[#909090] flex items-center gap-4">
            <span>DATE: 2026-05-30</span>
            <span>STATUS: 已归档</span>
            <Link
              to="/concept"
              className="text-[#1a3a6b] hover:underline inline-flex items-center gap-1"
            >
              <Lightbulb size={10} />
              概念设计
            </Link>
            <Link
              to="/launch"
              className="text-[#1a3a6b] hover:underline inline-flex items-center gap-1"
            >
              <Rocket size={10} />
              上线方案
            </Link>
            <Link
              to="/nim"
              className="text-[#1a3a6b] hover:underline inline-flex items-center gap-1"
            >
              <Wrench size={10} />
              Skill-Nim
            </Link>
            <Link
              to="/db"
              className="text-[#1a3a6b] hover:underline inline-flex items-center gap-1"
            >
              <Database size={10} />
              数据库
            </Link>
            <Link
              to="/components"
              className="text-[#1a3a6b] hover:underline inline-flex items-center gap-1"
            >
              <Grid3x3 size={10} />
              组件库
            </Link>
            <Link
              to="/scheme/a"
              className="text-[#1a3a6b] hover:underline"
            >
              详情A
            </Link>
            <Link
              to="/scheme/b"
              className="text-[#1a3a6b] hover:underline"
            >
              详情B
            </Link>
          </div>
        </div>
      </header>

      <nav className="border-b border-[#d0d0d0] bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`
                inline-flex items-center gap-2 px-4 py-3 text-xs font-mono-cn
                border-b-2 transition-all duration-200 cursor-pointer
                ${
                  view === tab.key
                    ? 'border-[#1a3a6b] text-[#1a3a6b] bg-white'
                    : 'border-transparent text-[#606060] hover:text-[#1a1a1a] hover:bg-white/50'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'cards' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-black">瓷器设计</span>
              <span className="text-3xl font-black qblue-accent">青花瓷</span>
            </div>
            <p className="text-sm text-[#606060] max-w-2xl leading-relaxed">
              两套完整的AI图像生成结构化提示词方案，以Mandelbox分形立方体×青花瓷纹饰为核心主体，
              采用离线档案美学风格。方案A侧重经典结构化展板式呈现，方案B侧重编辑式解构与数字故障美学。
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <SchemeCard scheme={schemeA} index={0} />
              <SchemeCard scheme={schemeB} index={1} />
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#1a3a6b]" />
                <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
                  预览图 / PREVIEW IMAGES
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PreviewImage scheme={schemeA} />
                <PreviewImage scheme={schemeB} />
              </div>
            </div>
          </div>
        )}

        {view === 'prompt-a' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="param-highlight">{schemeA.tag}</span>
              <h2 className="text-xl font-black">{schemeA.name}</h2>
              <span className="text-sm text-[#606060]">— {schemeA.subtitle}</span>
            </div>
            <PromptDisplay scheme={schemeA} />
          </div>
        )}

        {view === 'prompt-b' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="param-highlight">{schemeB.tag}</span>
              <h2 className="text-xl font-black">{schemeB.name}</h2>
              <span className="text-sm text-[#606060]">— {schemeB.subtitle}</span>
            </div>
            <PromptDisplay scheme={schemeB} />
          </div>
        )}

        {view === 'compare' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black">方案对比</span>
              <span className="font-mono-cn text-xs text-[#909090]">A vs B</span>
            </div>
            <ComparePanel schemeA={schemeA} schemeB={schemeB} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-mono-cn text-xs text-[#1a3a6b] mb-3 tracking-wider">
                  方案 A 完整提示词
                </h3>
                <PromptDisplay scheme={schemeA} showNegative={false} />
              </div>
              <div>
                <h3 className="font-mono-cn text-xs text-[#1a3a6b] mb-3 tracking-wider">
                  方案 B 完整提示词
                </h3>
                <PromptDisplay scheme={schemeB} showNegative={false} />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[#d0d0d0] mt-16 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-mono-cn text-[10px] text-[#909090]">
          <span>瓷器设计·青花瓷 OFFLINE ARCHIVE PROMPT SYSTEM</span>
          <span>ARCHIVE-0047 / SPECIMEN-QH-2024</span>
        </div>
      </footer>
    </div>
  );
}
