import { memo } from 'react';
import { Lock, Zap, Shield, Check } from 'lucide-react';
import type { SkillPack } from '@/data/types';
import { cn } from '@/lib/cn';

const RARITY_COLOR: Record<SkillPack['rarity'], string> = {
  T1: 'text-rarity-t1',
  T2: 'text-rarity-t2',
  T3: 'text-rarity-t3',
  T4: 'text-rarity-t4',
  T5: 'text-rarity-t5',
  T6: 'text-rarity-t6',
};

interface Props {
  pack: SkillPack;
  selected: boolean;
  onToggle: (id: string) => void;
  onClick: (id: string) => void;
  index: number;
  hover: boolean;
}

export const SkillCard = memo(function SkillCard({ pack, selected, onToggle, onClick, index, hover }: Props) {
  return (
    <button
      data-id={pack.id}
      onClick={(e) => {
        if (e.shiftKey || e.metaKey || e.ctrlKey) onToggle(pack.id);
        else onClick(pack.id);
      }}
      className={cn(
        'relative aspect-[1/1.18] w-full text-left bg-bg-surface/70 border transition-all duration-200 group',
        'clip-bevel-md p-2 flex flex-col',
        'animate-hexAppear',
        selected
          ? 'border-cyan shadow-cyan-glow bg-cyan/5'
          : 'border-line hover:border-cyan/40',
        pack.locked && 'opacity-70',
        hover && !selected && 'border-amber/40',
      )}
      style={{ animationDelay: `${Math.min(index * 18, 540)}ms` }}
    >
      {/* 顶部：稀有度条 + 锁 */}
      <div className="flex items-start justify-between mb-1.5">
        <span className={cn('font-orbitron text-[9px] font-bold tracking-widest', RARITY_COLOR[pack.rarity])}>
          {pack.rarity}
        </span>
        <div className="flex items-center gap-1">
          {pack.equipped && (
            <span className="w-3.5 h-3.5 grid place-items-center bg-amber/20 text-amber">
              <Zap className="w-2 h-2" />
            </span>
          )}
          {pack.locked ? (
            <Lock className="w-3 h-3 text-danger" />
          ) : null}
        </div>
      </div>

      {/* 代号 */}
      <div className="font-mono text-[9px] text-line-strong tracking-wide leading-none truncate">{pack.id}</div>
      <div className="font-display text-[11px] font-bold text-zinc-100 leading-tight mt-0.5 line-clamp-1">
        {pack.code}
      </div>

      {/* 等级条 */}
      <div className="mt-auto">
        <div className="flex items-baseline justify-between">
          <span className="font-orbitron text-xl font-black text-amber text-shadow-amber leading-none">
            {String(pack.level).padStart(2, '0')}
          </span>
          <span className="font-mono text-[8px] text-line-strong">/ 90</span>
        </div>
        <div className="mt-1 h-1 bg-bg-deep border border-line-dim overflow-hidden">
          <div
            className={cn(
              'h-full transition-all',
              pack.rarity === 'T6' ? 'bg-rarity-t6' : 'bg-amber',
            )}
            style={{ width: `${(pack.level / 90) * 100}%` }}
          />
        </div>
      </div>

      {/* 选中态浮层 */}
      {selected && (
        <span className="absolute top-1 right-1 w-4 h-4 grid place-items-center bg-cyan text-bg-deep">
          <Check className="w-3 h-3" strokeWidth={3} />
        </span>
      )}

      {/* 锁定水印 */}
      {pack.locked && (
        <span className="absolute inset-0 pointer-events-none grid place-items-center">
          <Shield className="w-7 h-7 text-danger/40" />
        </span>
      )}

      {/* 角标 */}
      <span className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-current opacity-50" />
      <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-current opacity-50" />
    </button>
  );
});
