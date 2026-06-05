import { ReactNode, useState } from 'react';
import { Info, Code2, ExternalLink, Maximize2 } from 'lucide-react';

interface FrameProps {
  title: string;
  pack: string;
  level: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  children: ReactNode;
  detail?: string;
}

/**
 * 规范化演示包装器 - 所有 UI 包的统一外壳
 * 级别 1-5 决定装饰密度（标题条/侧栏/页脚/索引等）
 */
export function DemoFrame({ title, pack, level, tags, children, detail }: FrameProps) {
  const [showInfo, setShowInfo] = useState(false);
  const accent = LEVEL_ACCENT[level];

  return (
    <div className={`relative w-full h-full overflow-hidden bg-ink text-bone font-mono ${accent.bg}`}>
      {/* 演示区 */}
      <div className="absolute inset-0">{children}</div>

      {/* 顶部 chrome */}
      <div className={`absolute top-0 left-0 right-0 flex items-center gap-2 px-2 py-1 text-[9px] uppercase tracking-widest bg-ink/70 backdrop-blur-sm border-b border-bone/20 ${accent.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} animate-pulse`} />
        <span className={accent.text}>{pack}</span>
        <span className="text-bone/30">/</span>
        <span className="text-bone/80 font-bold">{title}</span>
        {level >= 2 && (
          <span className={`ml-2 px-1.5 py-px ${accent.chip} text-[8px] font-bold`}>
            L{level}
          </span>
        )}
        <div className="flex-1" />
        {level >= 3 && tags.slice(0, 3).map(t => (
          <span key={t} className="hidden md:inline text-bone/40">#{t}</span>
        ))}
        {detail && level >= 4 && (
          <button
            onClick={() => setShowInfo(s => !s)}
            className={`p-0.5 hover:${accent.text} text-bone/60`}
            title="info"
          >
            <Info size={10} />
          </button>
        )}
      </div>

      {/* 底部索引 - 仅 L3+ */}
      {level >= 3 && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1 text-[9px] bg-ink/70 backdrop-blur-sm border-t border-bone/20">
          <div className="flex items-center gap-2 text-bone/40">
            <Code2 size={9} />
            <span>{tags.slice(0, 2).join(' · ')}</span>
          </div>
          <div className="flex items-center gap-2 text-bone/40">
            <span>{title.toUpperCase()}</span>
            <Maximize2 size={9} />
          </div>
        </div>
      )}

      {/* 信息弹层 - L4+ */}
      {showInfo && detail && level >= 4 && (
        <div className="absolute top-6 right-2 left-2 md:left-auto md:w-64 z-10 p-3 bg-ink/95 border-2 border-bone/40 text-[10px] leading-relaxed backdrop-blur">
          <div className={`font-bold ${accent.text} mb-1`}>{title}</div>
          <div className="text-bone/70">{detail}</div>
        </div>
      )}

      {/* 角标 - L5 */}
      {level >= 5 && (
        <div className={`absolute bottom-6 right-2 text-[8px] font-bold ${accent.text} opacity-60`}>
          ◇ ◇ ◇
        </div>
      )}
    </div>
  );
}

const LEVEL_ACCENT = {
  1: {
    bg: '',
    text: 'text-bone',
    dot: 'bg-bone',
    border: '',
    chip: 'bg-bone/20 text-bone',
  },
  2: {
    bg: '',
    text: 'text-cyan',
    dot: 'bg-cyan',
    border: 'border-cyan/20',
    chip: 'bg-cyan/20 text-cyan',
  },
  3: {
    bg: '',
    text: 'text-volt',
    dot: 'bg-volt',
    border: 'border-volt/30',
    chip: 'bg-volt/20 text-volt',
  },
  4: {
    bg: '',
    text: 'text-pink',
    dot: 'bg-pink',
    border: 'border-pink/30',
    chip: 'bg-pink/20 text-pink',
  },
  5: {
    bg: '',
    text: 'text-plum',
    dot: 'bg-plum',
    border: 'border-plum/40',
    chip: 'bg-plum/20 text-plum',
  },
} as const;
