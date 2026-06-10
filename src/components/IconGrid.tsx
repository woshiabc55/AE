import { useState } from 'react';
import { IconCard } from './IconCard';
import { IconDetailModal } from './IconDetailModal';
import type { IconItem } from '@/api/types';

type Props = {
  icons: IconItem[];
  emptyHint?: string;
};

export function IconGrid({ icons, emptyHint }: Props) {
  const [active, setActive] = useState<IconItem | null>(null);

  if (icons.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <span className="font-serif text-3xl italic text-ink-200">∅</span>
        <p className="font-mono text-sm text-ink-300">
          {emptyHint ?? 'No icons match your filter.'}
        </p>
        <p className="font-mono text-xs text-ink-300/60">Try another keyword or category.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {icons.map((icon, i) => (
          <IconCard key={icon.id} icon={icon} index={i} onClick={() => setActive(icon)} />
        ))}
      </div>
      {active && <IconDetailModal icon={active} onClose={() => setActive(null)} />}
    </>
  );
}
