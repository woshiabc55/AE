import { ACTS, TOOLS } from '../data/catalog';
import { Film, Music, Code2, Box, Sparkles, Bot, Image as ImageIcon, Type, Clapperboard } from 'lucide-react';

const ICONS: Record<string, typeof Film> = {
  word: Type,
  image: ImageIcon,
  motion: Film,
  sound: Music,
  code: Code2,
  space: Box,
  copilot: Sparkles,
  agents: Bot,
};

export default function TableOfContents() {
  return (
    <div className="mt-24 max-w-scriptwide w-full">
      <div className="flex items-center gap-3 mb-6">
        <Clapperboard size={16} className="text-clapper-500" />
        <div className="slate text-parchment-100 text-xs">TABLE OF CONTENTS · 目录</div>
        <div className="flex-1 h-px bg-gilt-600/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ACTS.map((act) => {
          const count = TOOLS.filter((t) => t.actId === act.id).length;
          const Icon = ICONS[act.id] ?? Sparkles;
          return (
            <a
              key={act.id}
              href={`#act-${act.id}`}
              className="group block border border-gilt-600/40 hover:border-clapper-500/80 transition-colors hover-bg-fade p-4"
            >
              <div className="flex items-start gap-3">
                <div className="font-display text-3xl text-clapper-500 leading-none w-12 shrink-0">
                  {act.roman}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className="text-gilt-300 group-hover:text-clapper-500" />
                    <div className="slate text-[10px] text-gilt-300">{act.subtitle}</div>
                  </div>
                  <div className="font-display text-2xl text-parchment-50">{act.title}</div>
                  <div className="font-serif italic text-sm text-parchment-200/70 mt-1.5 line-clamp-2">
                    {act.tagline}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="slate text-[9px] text-gilt-300">{count} SCENES</div>
                    <div className="slate text-[9px] text-gilt-300">·</div>
                    <div className="slate text-[9px] text-gilt-300/80">{act.style}</div>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
