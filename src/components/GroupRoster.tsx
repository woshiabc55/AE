import { useOpsStore } from '@/store/useOpsStore';
import { ChevronRight, Plus, Layers } from 'lucide-react';
import { cn } from '@/lib/cn';

export function GroupRoster() {
  const groups = useOpsStore((s) => s.groups);
  const active = useOpsStore((s) => s.activeGroupId);
  const setActive = useOpsStore((s) => s.setActiveGroup);

  return (
    <aside className="w-[260px] shrink-0 border-r border-line bg-bg-deep/60 backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b border-line flex items-center justify-between">
        <div>
          <div className="font-mono text-[9px] tracking-[0.3em] text-line-strong">SKILL PACK // ROSTER</div>
          <div className="font-display text-base font-bold text-amber text-shadow-amber">技能包组目录</div>
        </div>
        <button className="w-7 h-7 grid place-items-center border border-line-strong hover:border-amber hover:bg-amber/10 text-line-strong hover:text-amber transition-colors clip-bevel-sm">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {groups.map((g) => {
          const isActive = g.id === active;
          const total = g.packs.length;
          const equipped = g.packs.filter((p) => p.equipped).length;
          const t6 = g.packs.filter((p) => p.rarity === 'T6').length;
          return (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={cn(
                'relative w-full text-left p-3 border bg-bg-surface/50 transition-all duration-200 group',
                isActive
                  ? 'border-amber/60 bg-amber/5 shadow-amber-glow'
                  : 'border-line hover:border-cyan/40 hover:bg-bg-panel/60',
              )}
            >
              {/* 激活态左侧琥珀光带 */}
              {isActive && (
                <span className="absolute top-0 left-0 bottom-0 w-0.5 bg-amber animate-pulseGlow" />
              )}
              {isActive && (
                <span className="absolute -top-px -left-px w-2 h-2 border-t border-l border-amber" />
              )}
              {isActive && (
                <span className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-amber" />
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className={cn('w-3.5 h-3.5', isActive ? 'text-amber' : 'text-line-strong')} />
                  <span className={cn('font-orbitron text-xs font-bold tracking-wider', isActive ? 'text-amber' : 'text-cyan')}>
                    {g.code}
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    'w-3.5 h-3.5 transition-transform',
                    isActive ? 'text-amber translate-x-0.5' : 'text-line-strong',
                  )}
                />
              </div>

              <div className="font-display text-sm font-semibold text-zinc-100">{g.name}编队</div>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-bg-deep border border-line-dim overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all',
                      isActive ? 'bg-amber' : 'bg-cyan/60',
                    )}
                    style={{ width: `${(equipped / total) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-line-strong">
                  {equipped}/{total}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 font-mono text-[9px] tracking-widest">
                <span className="px-1 border border-rarity-t6/30 text-rarity-t6">T6 ×{t6}</span>
                <span className="px-1 border border-line text-line-strong">CAP {g.capacity}</span>
                {isActive && <span className="px-1 border border-amber/50 text-amber">ACTIVE</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-line">
        <div className="font-mono text-[9px] text-line-strong tracking-widest leading-relaxed">
          ROSTER.SYNC.STATUS<br />
          <span className="text-ok">// ALL GROUPS OPERATIONAL</span>
        </div>
      </div>
    </aside>
  );
}
