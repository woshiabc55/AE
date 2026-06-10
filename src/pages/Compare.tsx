import { useState, useEffect } from 'react';
import { queryIcons } from '@/api/icons';
import { ALL_SOURCES, SOURCE_META, type IconItem, type IconSource } from '@/api/types';
import { useDebounce } from '@/hooks/useDebounce';
import { Copy } from 'lucide-react';
import { useToast } from '@/store/toast';
import { copyText } from '@/utils/copy';

const COMPARE_SOURCES: IconSource[] = ['lucide', 'heroicons', 'tabler', 'phosphor'];

export function Compare() {
  const [keyword, setKeyword] = useState('home');
  const debounced = useDebounce(keyword, 200);
  const push = useToast((s) => s.push);

  const map: Record<IconSource, IconItem[]> = {
    lucide: [],
    heroicons: [],
    tabler: [],
    phosphor: [],
    iconpark: [],
    material: [],
    iconfont: [],
  };

  for (const src of COMPARE_SOURCES) {
    map[src] = queryIcons({ source: src, keyword: debounced });
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="mb-8 border-b border-ink-200/20 pb-6">
        <div className="mb-2 flex items-baseline gap-2 font-mono text-xs uppercase tracking-widest text-ink-300">
          <span className="h-px w-8 bg-vermillion" />
          Cross-Source Comparison
        </div>
        <h1 className="font-display text-5xl font-extrabold tracking-tightest text-ink-50">
          COMPARE
        </h1>
        <p className="mt-2 font-mono text-sm text-ink-300">
          One keyword. <span className="text-ink-50">4 visual languages</span> side by side.
        </p>
      </div>

      <div className="mb-8 flex items-baseline gap-3">
        <label className="font-mono text-xs uppercase tracking-widest text-ink-300">Search</label>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border-b border-ink-200/40 bg-transparent py-1 font-display text-2xl font-bold text-ink-50 focus:border-vermillion focus:outline-none"
          placeholder="home, heart, gear, user…"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {COMPARE_SOURCES.map((src) => {
          const items = map[src];
          return (
            <div key={src} className="border border-ink-200/20 bg-ink-400/30 p-5">
              <div className="mb-4 flex items-baseline justify-between border-b border-ink-200/20 pb-2">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-vermillion">
                    {SOURCE_META[src].short}
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink-50">
                    {SOURCE_META[src].label}
                  </h3>
                </div>
                <span className="font-mono text-xs text-ink-300">{items.length} found</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {items.slice(0, 6).map((icon) => (
                  <button
                    key={icon.id}
                    onClick={async () => {
                      const ok = await copyText(icon.svg);
                      push(ok ? `Copied ${icon.displayName}` : 'Copy failed', ok ? 'success' : 'error');
                    }}
                    title={icon.displayName}
                    className="group flex aspect-square items-center justify-center border border-transparent text-ink-50 transition-colors hover:border-vermillion hover:bg-ink-400/40"
                  >
                    <div dangerouslySetInnerHTML={{ __html: icon.svg }} className="h-6 w-6" />
                  </button>
                ))}
                {Array.from({ length: Math.max(0, 6 - items.length) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center border border-dashed border-ink-200/15"
                  >
                    <span className="font-mono text-xs text-ink-300/30">—</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
