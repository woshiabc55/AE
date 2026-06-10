// 通用 Modal / 抽屉
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/format";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
  footer?: ReactNode;
}

const SIZES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-[95vw] h-[90vh]",
};

export function Modal({ open, onClose, title, subtitle, size = "md", children, footer }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      const el = ref.current?.querySelector<HTMLElement>(
        "input,textarea,select,button,[tabindex]:not([tabindex='-1'])"
      );
      el?.focus();
    }, 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-ink-950/85 backdrop-blur"
        onClick={onClose}
      />
      <div
        ref={ref}
        className={cn(
          "relative panel w-full flex flex-col max-h-[90vh] bg-ink-800",
          SIZES[size]
        )}
      >
        {title && (
          <header className="flex items-start justify-between border-b border-ink-600 px-5 py-4">
            <div>
              <h2 className="font-display text-[22px] text-paper-50 leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-[12.5px] font-serif text-paper-200">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-ink-300 hover:text-paper-100 p-1"
              aria-label="关闭"
            >
              <X size={16} />
            </button>
          </header>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
        {footer && (
          <footer className="border-t border-ink-600 px-5 py-3 flex items-center justify-end gap-2 bg-ink-700/30">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
