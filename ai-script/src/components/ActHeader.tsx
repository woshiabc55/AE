import type { Act } from '../data/catalog';
import { TOOLS } from '../data/catalog';

export default function ActHeader({ act }: { act: Act }) {
  const count = TOOLS.filter((t) => t.actId === act.id).length;
  return (
    <header className="max-w-scriptwide mx-auto px-6 pt-24 pb-12">
      {/* 幕编号 + 副标 */}
      <div className="flex items-baseline gap-4 mb-6">
        <div className="font-display text-7xl md:text-8xl text-clapper-500 leading-none">
          {act.roman}
        </div>
        <div className="flex-1">
          <div className="slate text-[10px] text-gilt-300 mb-1">{act.subtitle}</div>
          <div className="h-px w-12 bg-gilt-600 mb-2" />
          <div className="slate text-[10px] text-gilt-300/70">
            {count} SCENES · {act.style}
          </div>
        </div>
      </div>

      {/* 幕名 */}
      <h2 className="font-display text-5xl md:text-7xl text-parchment-50 leading-[1.05] mb-6 text-balance">
        {act.title}
      </h2>

      {/* 口号 */}
      <p className="font-serif italic text-xl md:text-2xl text-parchment-200/85 max-w-2xl text-pretty">
        "{act.tagline}"
      </p>
    </header>
  );
}
