import { useUIStore } from '@/store/uiStore';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ToastHost() {
  const toasts = useUIStore((s) => s.toasts);
  const remove = useUIStore((s) => s.removeToast);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22 }}
            className={cn(
              'pointer-events-auto glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-panel min-w-[260px]',
              t.type === 'success' && 'border-emerald-300/30',
              t.type === 'error' && 'border-rose-300/30',
              t.type === 'info' && 'border-neon-cyan/30',
            )}
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-neon-cyan" />}
            {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-300" />}
            <div className="text-sm flex-1">{t.message}</div>
            <button
              onClick={() => remove(t.id)}
              className="text-fog-dim hover:text-cream transition"
              aria-label="dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
