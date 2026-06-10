import { useMemo, useEffect, useState, useCallback } from 'react';
import { ArrowDown, X, Shuffle } from 'lucide-react';
import { useExplorer } from '@/store/explorer';
import { useDebounce } from '@/hooks/useDebounce';
import { queryIcons, getRandomIcon, SOURCE_COUNT } from '@/api/icons';
import { SourceTabs } from '@/components/SourceTabs';
import { CategorySidebar } from '@/components/CategorySidebar';
import { IconGrid } from '@/components/IconGrid';
import { IconDetailModal } from '@/components/IconDetailModal';
import { SOURCE_META, ALL_SOURCES } from '@/api/types';
import { useToast } from '@/store/toast';
import type { IconItem } from '@/api/types';

const HERO_TITLE = 'ONE GALLERY.\nEVERY ICON.';

export function Home() {
  const { keyword, activeSource, activeCategory, setKeyword, reset } = useExplorer();
  const debounced = useDebounce(keyword, 180);
  const [showHero, setShowHero] = useState(true);
  const [surprise, setSurprise] = useState<IconItem | null>(null);
  const pushToast = useToast((s) => s.push);

  const results = useMemo(
    () => queryIcons({ source: activeSource, category: activeCategory, keyword: debounced }),
    [activeSource, activeCategory, debounced],
  );

  useEffect(() => {
    const onScroll = () => setShowHero(window.scrollY < 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSurprise = useCallback(() => {
    const icon = getRandomIcon(activeSource);
    setSurprise(icon);
    pushToast(`Surprise! ${icon.displayName} · ${SOURCE_META[icon.source].label}`, 'info');
  }, [activeSource, pushToast]);

  return (
    <div>
      <SourceTabs />

      {/* HERO 区域（可滚动消失） */}
      {showHero && (
        <section className="relative border-b border-ink-200/20 overflow-hidden">
          <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-12">
            <div className="flex items-baseline gap-3 mb-6 font-mono text-xs uppercase tracking-widest text-ink-300">
              <span className="h-px w-8 bg-vermillion" />
              <span>Vol. 01 — Cross-Source Icon Index</span>
              <span className="ml-auto font-serif italic normal-case text-ink-300/60">
                est. 2026
              </span>
            </div>

            <h1 className="font-display text-[clamp(48px,9vw,140px)] font-extrabold leading-[0.85] tracking-tightest text-ink-50 whitespace-pre-line">
              {HERO_TITLE.split('').map((ch, i) => (
                <span
                  key={i}
                  className="reveal-letter"
                  style={{ animationDelay: `${i * 25}ms`, whiteSpace: ch === '\n' ? 'pre' : 'normal' }}
                >
                  {ch === '\n' ? <br /> : ch}
                </span>
              ))}
            </h1>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
              <p className="max-w-xl font-mono text-sm leading-relaxed text-ink-300">
                A <span className="text-ink-50">7-source, 750+ icon</span> visual index for designers & developers.
                Search, preview, copy and download — all in one editorial-style browser.
              </p>
              <div className="flex items-center gap-6 font-mono text-xs text-ink-300">
                <span>↓ {Object.values(SOURCE_COUNT).reduce((a, b) => a + b, 0)} indexed</span>
                <span>·</span>
                <span>{ALL_SOURCES.length} sources</span>
                <span>·</span>
                <span>1-click copy</span>
              </div>
            </div>

            {/* 源标签条 + Surprise Me */}
            <div className="mt-10 flex flex-wrap items-center gap-2">
              {ALL_SOURCES.map((src, i) => {
                const meta = SOURCE_META[src];
                const active = activeSource === src;
                return (
                  <button
                    key={src}
                    onClick={() => useExplorer.getState().setSource(src)}
                    className={`group flex items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-all ${
                      active
                        ? 'border-vermillion bg-vermillion/10 text-ink-50'
                        : 'border-ink-200/30 text-ink-300 hover:border-ink-200/60 hover:text-ink-50'
                    }`}
                    style={{ animationDelay: `${300 + i * 50}ms` }}
                  >
                    <span className="text-vermillion">●</span>
                    <span className="font-semibold uppercase tracking-wider">{meta.short}</span>
                    <span className="text-ink-300/70">{meta.label}</span>
                    <span className="ml-1 text-ink-300/50">{SOURCE_COUNT[src]}</span>
                  </button>
                );
              })}

              <button
                onClick={onSurprise}
                title="Roll a random icon"
                className="ml-auto flex items-center gap-2 border border-vermillion bg-vermillion/10 px-3 py-1.5 font-mono text-xs text-vermillion transition-all hover:bg-vermillion hover:text-ink"
              >
                <Shuffle size={12} strokeWidth={2} />
                <span className="font-semibold uppercase tracking-wider">Surprise Me</span>
                <span className="text-vermillion/70 group-hover:text-ink/70">↵</span>
              </button>
            </div>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-3 right-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-300/60">
            <ArrowDown size={12} />
            <span>scroll to explore</span>
          </div>
        </section>
      )}

      {/* 主体：左分类 + 右网格 */}
      <div className="mx-auto flex max-w-[1440px] gap-2 px-2">
        <CategorySidebar />

        <main className="flex-1 py-8 pr-2">
          {/* 结果头 */}
          <div className="mb-4 flex items-baseline justify-between border-b border-ink-200/20 pb-3">
            <div className="flex items-baseline gap-3 font-mono text-xs text-ink-300">
              <span>Results</span>
              <span className="text-ink-50">{results.length}</span>
              {activeSource !== 'all' && (
                <span className="text-vermillion">/ {SOURCE_META[activeSource].label}</span>
              )}
              {activeCategory !== 'all' && <span>/ {activeCategory}</span>}
              {keyword && <span>/ "{keyword}"</span>}
            </div>
            {(keyword || activeSource !== 'all' || activeCategory !== 'all') && (
              <button
                onClick={reset}
                className="flex items-center gap-1 font-mono text-xs text-ink-300 hover:text-vermillion"
              >
                <X size={11} />
                clear
              </button>
            )}
          </div>

          <IconGrid icons={results} />
        </main>
      </div>

      {/* Surprise Me 弹窗 */}
      {surprise && (
        <IconDetailModal icon={surprise} onClose={() => setSurprise(null)} />
      )}
    </div>
  );
}
