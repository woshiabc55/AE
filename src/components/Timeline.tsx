import { useEffect, useRef } from 'react';
import { useOpsStore } from '@/store/useOpsStore';
import { formatTimeAgo } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Activity } from 'lucide-react';

const LEVEL_STYLE = {
  INFO: { color: 'text-cyan', border: 'border-cyan/40', dot: 'bg-cyan' },
  OK: { color: 'text-ok', border: 'border-ok/40', dot: 'bg-ok' },
  WARN: { color: 'text-amber', border: 'border-amber/40', dot: 'bg-amber' },
  CRIT: { color: 'text-danger', border: 'border-danger/40', dot: 'bg-danger' },
} as const;

export function Timeline() {
  const events = useOpsStore((s) => s.events);
  const ref = useRef<HTMLDivElement>(null);

  // 简单滚动到顶部（新事件入栈时）
  useEffect(() => {
    if (ref.current) ref.current.scrollLeft = 0;
  }, [events.length]);

  return (
    <footer className="h-[100px] border-t border-line bg-bg-deep/80 backdrop-blur-sm relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/60 to-transparent" />
      <div className="flex items-center h-full px-4 gap-3">
        <div className="flex flex-col leading-none pr-3 border-r border-line h-full justify-center">
          <div className="font-mono text-[9px] tracking-[0.3em] text-line-strong">TIMELINE //</div>
          <div className="font-display text-sm font-bold text-amber text-shadow-amber">战术时间轴</div>
        </div>

        <div ref={ref} className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex items-center gap-3 h-full">
            {events.map((e, i) => {
              const s = LEVEL_STYLE[e.level];
              return (
                <div
                  key={e.id}
                  className={cn(
                    'shrink-0 relative flex flex-col gap-1 px-3 py-2 border bg-bg-surface/60 animate-slideIn clip-bevel-sm',
                    s.border,
                  )}
                  style={{ animationDelay: `${i * 40}ms`, minWidth: 220, maxWidth: 280 }}
                >
                  <div className="flex items-center justify-between font-mono text-[9px] tracking-widest">
                    <span className="text-line-strong">{e.code}</span>
                    <span className={s.color}>{formatTimeAgo(e.ts)}</span>
                  </div>
                  <div className={cn('font-body text-xs leading-tight', s.color)}>{e.message}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full', s.dot, e.level === 'CRIT' && 'animate-pulse')} />
                    <span className={cn('font-mono text-[9px] tracking-widest', s.color)}>{e.level}</span>
                  </div>
                  {/* 节点圆点 */}
                  <span
                    className={cn(
                      'absolute -top-1 left-3 w-2 h-2 rounded-full',
                      s.dot,
                      e.level !== 'INFO' && 'animate-pulseGlow',
                    )}
                  />
                </div>
              );
            })}
            {events.length === 0 && (
              <div className="font-mono text-[10px] text-line-strong tracking-widest">// NO EVENTS YET</div>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 pl-3 border-l border-line h-full">
          <Activity className="w-4 h-4 text-amber" />
          <div className="flex flex-col leading-none">
            <span className="font-mono text-[9px] tracking-widest text-line-strong">FEED</span>
            <span className="font-orbitron text-xs font-bold text-amber text-shadow-amber">LIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
