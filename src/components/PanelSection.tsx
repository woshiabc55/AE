import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PanelSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function PanelSection({ title, defaultOpen = true, children }: PanelSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#0f3460]/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-white/60 transition-colors hover:text-white/80"
      >
        {isOpen ? (
          <ChevronDown className="h-3 w-3 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
        )}
        {title}
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
