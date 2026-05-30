import { useState } from 'react';
import DocEditor from '@/components/nim/DocEditor';
import SvgWorkshop from '@/components/nim/SvgWorkshop';
import CollageBoard from '@/components/nim/CollageBoard';
import { FileText, Palette, Layers, Wrench } from 'lucide-react';

type ToolMode = 'doc' | 'svg' | 'collage';

export default function SkillNim() {
  const [mode, setMode] = useState<ToolMode>('svg');

  const tabs: { key: ToolMode; label: string; icon: React.ReactNode }[] = [
    { key: 'doc', label: '文档编辑器', icon: <FileText size={14} /> },
    { key: 'svg', label: 'SVG图形工坊', icon: <Palette size={14} /> },
    { key: 'collage', label: '拼接画板', icon: <Layers size={14} /> },
  ];

  return (
    <div className="h-screen flex flex-col grid-bg">
      <header className="border-b border-[#1a1a1a] bg-white/90 backdrop-blur-sm shrink-0 z-50">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-[#606060] hover:text-[#1a1a1a] transition-colors text-sm font-mono-cn">
              ← 首页
            </a>
            <div className="w-px h-4 bg-[#d0d0d0]" />
            <div className="flex items-center gap-2">
              <Wrench size={16} className="text-[#1a3a6b]" />
              <h1 className="text-sm font-black">Skill-Nim</h1>
              <span className="font-mono-cn text-[9px] text-[#909090] border border-[#d0d0d0] px-1.5 py-0.5">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-[#606060] hidden md:inline">
              文档 + SVG + 拼接 · 提示词概念设计工具
            </span>
          </div>
          <div className="font-mono-cn text-[9px] text-[#909090] hidden md:flex items-center gap-3">
            <span>纯文档</span>
            <span>·</span>
            <span>SVG图形</span>
            <span>·</span>
            <span>图像拼接</span>
          </div>
        </div>
        <div className="flex border-t border-[#d0d0d0]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key)}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono-cn
                border-b-2 transition-all duration-200 cursor-pointer
                ${
                  mode === tab.key
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
      </header>

      <div className="flex-1 min-h-0">
        {mode === 'doc' && <DocEditor />}
        {mode === 'svg' && <SvgWorkshop />}
        {mode === 'collage' && <CollageBoard />}
      </div>
    </div>
  );
}
