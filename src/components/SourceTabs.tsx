import { useExplorer } from '@/store/explorer';
import { ALL_SOURCES, SOURCE_META, type IconSource } from '@/api/types';
import { SOURCE_COUNT } from '@/api/icons';

export function SourceTabs() {
  const { activeSource, setSource } = useExplorer();

  return (
    <div className="border-b border-ink-200/20">
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 overflow-x-auto px-6">
        <button
          onClick={() => setSource('all')}
          className={`group relative flex shrink-0 items-baseline gap-1.5 px-4 py-3 font-mono text-sm transition-colors ${
            activeSource === 'all' ? 'text-ink-50' : 'text-ink-300 hover:text-ink-50'
          }`}
        >
          <span>All</span>
          <span className="text-xs text-ink-300">
            {Object.values(SOURCE_COUNT).reduce((a, b) => a + b, 0)}
          </span>
          {activeSource === 'all' && (
            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-vermillion" />
          )}
        </button>

        {ALL_SOURCES.map((src) => (
          <SourceTab
            key={src}
            source={src}
            active={activeSource === src}
            onClick={() => setSource(src)}
          />
        ))}
      </div>
    </div>
  );
}

function SourceTab({
  source,
  active,
  onClick,
}: {
  source: IconSource;
  active: boolean;
  onClick: () => void;
}) {
  const meta = SOURCE_META[source];
  const count = SOURCE_COUNT[source] || 0;
  return (
    <button
      onClick={onClick}
      className={`group relative flex shrink-0 items-baseline gap-1.5 px-4 py-3 font-mono text-sm transition-colors ${
        active ? 'text-ink-50' : 'text-ink-300 hover:text-ink-50'
      }`}
    >
      <span className="font-mono text-[10px] text-ink-300/60 uppercase tracking-wider">
        {meta.short}
      </span>
      <span>{meta.label}</span>
      <span className="text-xs text-ink-300/80">{count}</span>
      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-vermillion" />
      )}
    </button>
  );
}
