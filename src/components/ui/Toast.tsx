// 全局 Toast 容器
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToast, type ToastKind } from "@/store/toast";
import { cn } from "@/utils/format";

const KIND_STYLES: Record<ToastKind, { ring: string; icon: any; iconColor: string }> = {
  info: {
    ring: "border-ink-500",
    icon: Info,
    iconColor: "text-paper-200",
  },
  success: {
    ring: "border-amber",
    icon: CheckCircle2,
    iconColor: "text-amber",
  },
  warn: {
    ring: "border-amber/70",
    icon: AlertTriangle,
    iconColor: "text-amber",
  },
  error: {
    ring: "border-reel",
    icon: XCircle,
    iconColor: "text-reel",
  },
};

export function ToastHost() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-3rem)] sm:w-96"
      role="region"
      aria-label="通知"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const style = KIND_STYLES[t.kind];
        const Icon = style.icon;
        return (
          <div
            key={t.id}
            className={cn(
              "relative panel border bg-ink-800 px-4 py-3 pr-9 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]",
              "animate-[fadeInUp_0.3s_ease-out]",
              style.ring
            )}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <Icon size={16} className={cn("mt-0.5 shrink-0", style.iconColor)} />
              <div className="flex-1 min-w-0">
                <div className="font-display text-[15px] text-paper-50 leading-tight">
                  {t.title}
                </div>
                {t.description && (
                  <div className="mt-1 text-[12.5px] font-serif text-paper-200 leading-relaxed">
                    {t.description}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="absolute top-2 right-2 text-ink-300 hover:text-paper-100 p-1"
              aria-label="关闭通知"
            >
              <X size={12} />
            </button>
            {/* 进度条 */}
            {t.duration > 0 && (
              <div className="absolute bottom-0 left-0 h-[2px] bg-amber/40 overflow-hidden">
                <div
                  className="h-full bg-amber origin-left"
                  style={{
                    animation: `toastBar ${t.duration}ms linear forwards`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      <style>{`
        @keyframes toastBar {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
