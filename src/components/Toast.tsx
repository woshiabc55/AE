import { useEffect, useState } from 'react';
import { useOpsStore } from '@/store/useOpsStore';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { setToastHandler, toast, type ToastLevel } from '@/lib/toast';

interface ToastItem {
  id: number;
  message: string;
  level: ToastLevel;
}

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const events = useOpsStore((s) => s.events);

  useEffect(() => {
    setToastHandler((m, l = 'OK') => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, message: m, level: l }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2600);
    });
    return () => {
      setToastHandler(null);
    };
  }, []);

  // 同步 store 变化时弹一次 toast
  useEffect(() => {
    if (events.length === 0) return;
    const first = events[0];
    toast(first.message, first.level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length === 0 ? -1 : events[0]?.id]);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto min-w-[280px] max-w-md flex items-center gap-3 px-3 py-2 border bg-bg-surface/95 backdrop-blur-md clip-bevel-sm animate-slideIn',
            t.level === 'OK' && 'border-ok/60 shadow-cyan-glow',
            t.level === 'WARN' && 'border-amber/60',
            t.level === 'CRIT' && 'border-danger/60',
            t.level === 'INFO' && 'border-cyan/60',
          )}
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              t.level === 'OK' && 'bg-ok',
              t.level === 'WARN' && 'bg-amber',
              t.level === 'CRIT' && 'bg-danger animate-pulse',
              t.level === 'INFO' && 'bg-cyan',
            )}
          />
          <span className="flex-1 font-mono text-xs text-zinc-100 leading-snug">{t.message}</span>
          <button
            onClick={() => setItems((prev) => prev.filter((i) => i.id !== t.id))}
            className="text-line-strong hover:text-amber"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
