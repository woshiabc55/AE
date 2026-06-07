// 事件流 - 实时事件显示

import { useGameStore } from '../../store/gameStore';
import { cn } from '../../lib/utils';
import { AlertCircle, Bell, Skull, Zap, BookOpen, Hammer, Info } from 'lucide-react';

const iconMap: Record<string, any> = {
  WORK: Zap,
  WORK_RESULT: Zap,
  MELTDOWN: AlertCircle,
  ORDEAL: Bell,
  DEATH: Skull,
  BREAK: AlertCircle,
  PANIC: AlertCircle,
  DAILY: Info,
  RESEARCH: BookOpen,
  CRAFT: Hammer,
  STORY: BookOpen,
};

const severityColor = (s: string) => {
  const map: Record<string, string> = {
    info: 'text-bone/70',
    warn: 'text-amber',
    danger: 'text-alert',
    success: 'text-enkephalin',
  };
  return map[s] || 'text-bone/70';
};

export default function EventLog() {
  const events = useGameStore((s) => s.events);
  return (
    <div className="bg-obsidian border-l border-panel-light/60 w-72 flex flex-col select-none">
      <div className="px-3 py-2 border-b border-panel-light/60 font-display text-[10px] tracking-widest text-amber">
        事件流
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[10px]">
        {events.length === 0 && (
          <div className="text-text-dim text-center mt-4">暂无事件</div>
        )}
        {events.map((e) => {
          const Icon = iconMap[e.type] || Info;
          return (
            <div
              key={e.id}
              className={cn(
                'flex items-start gap-2 p-2 border-l-2 bg-panel/40',
                e.severity === 'danger' && 'border-alert',
                e.severity === 'warn' && 'border-amber',
                e.severity === 'success' && 'border-enkephalin',
                e.severity === 'info' && 'border-text-dim'
              )}
            >
              <Icon className={cn('w-3 h-3 mt-0.5 shrink-0', severityColor(e.severity))} />
              <div className="flex-1 min-w-0">
                <div className={cn('leading-tight', severityColor(e.severity))}>{e.text}</div>
                <div className="text-text-dim text-[8px] mt-0.5">
                  D{String(e.day).padStart(2, '0')} · {e.tier || '—'} · {e.time.toFixed(1)}s
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
