import { useExplorer } from '@/store/explorer';
import { CATEGORY_META, type IconCategory } from '@/api/types';
import { CATEGORY_COUNT } from '@/api/icons';

const ORDER: IconCategory[] = [
  'general', 'arrow', 'media', 'communication', 'file',
  'system', 'commerce', 'social', 'weather', 'editor',
];

export function CategorySidebar() {
  const { activeCategory, setCategory } = useExplorer();

  return (
    <aside className="w-56 shrink-0 border-r border-ink-200/20 py-8 pr-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h3 className="font-serif text-lg italic text-ink-50">Categories</h3>
        <span className="font-mono text-[10px] text-ink-300">分类</span>
      </div>

      <ul className="space-y-1">
        <li>
          <button
            onClick={() => setCategory('all')}
            className={`group flex w-full items-baseline justify-between border-l-2 py-1.5 pl-3 pr-2 font-mono text-sm transition-all ${
              activeCategory === 'all'
                ? 'border-vermillion text-ink-50'
                : 'border-transparent text-ink-300 hover:border-ink-200/40 hover:text-ink-50'
            }`}
          >
            <span>all</span>
            <span className="text-xs text-ink-300/60">
              {Object.values(CATEGORY_COUNT).reduce((a, b) => a + b, 0)}
            </span>
          </button>
        </li>
        {ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const count = CATEGORY_COUNT[cat] || 0;
          return (
            <li key={cat}>
              <button
                onClick={() => setCategory(cat)}
                className={`group flex w-full items-baseline justify-between border-l-2 py-1.5 pl-3 pr-2 font-mono text-sm transition-all ${
                  activeCategory === cat
                    ? 'border-vermillion text-ink-50'
                    : 'border-transparent text-ink-300 hover:border-ink-200/40 hover:text-ink-50'
                }`}
              >
                <span>{meta.label.toLowerCase()}</span>
                <span className="text-xs text-ink-300/60">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 border-t border-ink-200/20 pt-6">
        <h3 className="mb-3 font-serif text-sm italic text-ink-300">About</h3>
        <p className="font-mono text-xs leading-relaxed text-ink-300">
          A curated gallery aggregating 7 mainstream icon libraries.
          Search, preview, copy and download in one place.
        </p>
      </div>
    </aside>
  );
}
