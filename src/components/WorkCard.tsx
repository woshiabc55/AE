import { Flame, Calendar, Globe2, Tv, Film, BookOpen, Library, Drama, Box, ShoppingBag, Music, Gamepad2, Clapperboard } from 'lucide-react';
import type { DerivativeWork } from '../data/types';
import { WORK_TYPE_LABELS } from '../data/types';
import { useAppStore } from '../store/useAppStore';

const ICON_MAP = {
  anime: Tv,
  movie: Film,
  manga: BookOpen,
  novel: Library,
  stage: Drama,
  figure: Box,
  goods: ShoppingBag,
  ost: Music,
  mobile: Gamepad2,
  live: Clapperboard,
};

interface Props {
  work: DerivativeWork;
}

export default function WorkCard({ work }: Props) {
  const openDrawer = useAppStore((s) => s.openDrawer);
  const Icon = ICON_MAP[work.type] || Tv;

  // 渐变封面
  const coverStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${work.cover}cc 0%, ${work.cover}40 100%)`,
  };

  return (
    <button
      onClick={() => openDrawer(work.id)}
      className="card-neon text-left group block w-full focus:outline-none focus:ring-2 focus:ring-neon-cyan/60"
    >
      {/* 封面区 */}
      <div className="relative h-32 overflow-hidden" style={coverStyle}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* 类型图标 */}
        <div className="absolute top-2 left-2 w-8 h-8 rounded-sm grid place-items-center bg-black/40 backdrop-blur border border-white/20 text-white">
          <Icon className="w-4 h-4" />
        </div>
        {/* 类型标签 */}
        <div className="absolute top-2 right-2 chip bg-black/40 backdrop-blur text-white border-white/30">
          {WORK_TYPE_LABELS[work.type]}
        </div>
        {/* 平台 */}
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/70 bg-black/40 backdrop-blur px-1.5 py-0.5 rounded-sm">
          {work.platform}
        </div>
        {/* 热度 */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono">
          <Flame className="w-3 h-3 text-neon-yellow" />
          <span className="text-white/90 font-bold">{work.popularity}</span>
        </div>
        {/* 装饰 */}
        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-neon-cyan/30 transition" />
      </div>

      {/* 内容区 */}
      <div className="p-3 space-y-2">
        <div className="font-semibold text-sm text-white/90 line-clamp-1 group-hover:text-neon-cyan transition">
          {work.title}
        </div>
        <div className="text-[11px] text-white/50 font-mono line-clamp-1">
          ← <span className="text-neon-pink">{work.ipName}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/40 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {work.year}
          </span>
          <span className="flex items-center gap-1">
            <Globe2 className="w-3 h-3" /> {work.region}
          </span>
        </div>
        {work.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {work.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[9px] px-1.5 py-0.5 bg-white/5 text-white/50 rounded-sm border border-white/10"
              >
                #{t}
              </span>
            ))}
            {work.tags.length > 2 && (
              <span className="text-[9px] text-white/30 font-mono">+{work.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

export function WorkListRow({ work }: Props) {
  const openDrawer = useAppStore((s) => s.openDrawer);
  const Icon = ICON_MAP[work.type] || Tv;

  return (
    <button
      onClick={() => openDrawer(work.id)}
      className="card-neon w-full text-left p-3 flex items-center gap-4 group"
    >
      <div
        className="w-16 h-16 shrink-0 rounded-sm grid place-items-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${work.cover}cc 0%, ${work.cover}40 100%)` }}
      >
        <Icon className="w-6 h-6 text-white" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white/90 line-clamp-1 group-hover:text-neon-cyan transition">
          {work.title}
        </div>
        <div className="text-[11px] text-white/50 font-mono mt-0.5">
          {WORK_TYPE_LABELS[work.type]} // {work.ipName} // {work.platform}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/40 font-mono mt-1">
          <span>{work.year}</span>
          <span>{work.region}</span>
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-neon-yellow" /> {work.popularity}
          </span>
        </div>
      </div>
    </button>
  );
}
