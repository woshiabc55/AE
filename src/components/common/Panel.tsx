// 面板容器

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function Panel({ title, icon, children, className, actions }: PanelProps) {
  return (
    <div
      className={cn(
        "bg-ink-800/80 backdrop-blur-sm border border-ink-600/60 rounded-xl shadow-panel",
        "flex flex-col min-h-0",
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-600/60">
          <div className="flex items-center gap-2">
            {icon && <span className="text-ember-400">{icon}</span>}
            <h3 className="font-pixel text-[10px] tracking-wider text-ink-100 uppercase">
              {title}
            </h3>
          </div>
          {actions}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}
