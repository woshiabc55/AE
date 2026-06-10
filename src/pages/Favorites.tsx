import { useMemo } from 'react';
import { useFavorites } from '@/store/favorites';
import { useExplorer } from '@/store/explorer';
import { getIcon } from '@/api/icons';
import { IconGrid } from '@/components/IconGrid';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/store/toast';

export function Favorites() {
  const ids = useFavorites((s) => s.ids);
  const clear = useFavorites((s) => s.clear);
  const push = useToast((s) => s.push);
  const { setSource, setCategory, setKeyword } = useExplorer();

  const icons = useMemo(
    () => ids.map((id) => getIcon(id)).filter(Boolean) as ReturnType<typeof getIcon>[],
    [ids],
  );

  const handleClear = () => {
    if (icons.length === 0) return;
    if (window.confirm(`Remove all ${icons.length} favorites?`)) {
      clear();
      push('All favorites cleared', 'info');
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="mb-8 flex items-end justify-between border-b border-ink-200/20 pb-6">
        <div>
          <div className="mb-2 flex items-baseline gap-2 font-mono text-xs uppercase tracking-widest text-ink-300">
            <span className="h-px w-8 bg-vermillion" />
            Your Curation
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tightest text-ink-50">
            FAVORITES
          </h1>
          <p className="mt-2 font-mono text-sm text-ink-300">
            <span className="text-ink-50">{icons.length}</span> icons collected
            <span className="ml-2 text-ink-300/60">·</span>
            <span className="ml-2 text-ink-300/60">local-only storage</span>
          </p>
        </div>
        {icons.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 border border-ink-200/30 px-3 py-2 font-mono text-xs text-ink-300 transition-colors hover:border-vermillion hover:text-vermillion"
          >
            <Trash2 size={12} strokeWidth={1.5} />
            clear all
          </button>
        )}
      </div>

      {icons.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <span className="font-serif text-5xl italic text-ink-200">∅</span>
          <p className="font-mono text-sm text-ink-300">No favorites yet.</p>
          <button
            onClick={() => {
              setSource('all');
              setCategory('all');
              setKeyword('');
            }}
            className="mt-2 border border-vermillion px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-50 transition-colors hover:bg-vermillion hover:text-ink"
          >
            start collecting →
          </button>
        </div>
      ) : (
        <IconGrid icons={icons} />
      )}
    </div>
  );
}
