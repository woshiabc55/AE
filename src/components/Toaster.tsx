import { useToast } from '@/store/toast';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex min-w-[260px] items-center gap-3 border border-ink-200/40 bg-ink-400 px-4 py-3 text-sm text-ink-50 shadow-2xl animate-slide-in"
        >
          <span className="text-vermillion">
            {t.kind === 'success' && <CheckCircle2 size={16} strokeWidth={1.5} />}
            {t.kind === 'error' && <AlertCircle size={16} strokeWidth={1.5} />}
            {t.kind === 'info' && <Info size={16} strokeWidth={1.5} />}
          </span>
          <span className="font-mono text-xs">{t.text}</span>
          <span className="ml-2 h-0.5 w-12 bg-vermillion/40" />
        </div>
      ))}
    </div>
  );
}
