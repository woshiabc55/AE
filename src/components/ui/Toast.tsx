import { useUIStore } from '@/stores/uiStore';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const toast = useUIStore((s) => s.toast);
  if (!toast) return null;

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
  const color =
    toast.type === 'success' ? 'text-moss border-moss/40' :
    toast.type === 'error' ? 'text-wine border-wine/40' :
    'text-gold-500 border-gold-500/40';

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 animate-fade-up">
      <div className={`flex items-center gap-3 border bg-ink-800/95 px-5 py-3 font-mono text-sm shadow-2xl backdrop-blur ${color}`}>
        <Icon size={16} strokeWidth={1.5} />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
