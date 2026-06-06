import { useLibraryStore, type SortKey } from '../../store/useLibraryStore'
import { Grid3x3, List } from 'lucide-react'

export function SortBar({ view, setView }: { view: 'grid' | 'list'; setView: (v: 'grid' | 'list') => void }) {
  const sort = useLibraryStore(s => s.sort)
  const setSort = useLibraryStore(s => s.setSort)
  const opts: Array<{ k: SortKey; label: string }> = [
    { k: 'popularity-desc', label: '热门度' },
    { k: 'year-desc', label: '年份 ↓' },
    { k: 'year-asc', label: '年份 ↑' },
    { k: 'rating-desc', label: '评分 ↓' },
  ]
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        {opts.map(o => (
          <button
            key={o.k}
            onClick={() => setSort(o.k)}
            className={`chip ${sort === o.k ? 'chip-on' : ''}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => setView('grid')} className={`grid h-7 w-7 place-items-center border ${view === 'grid' ? 'border-neon bg-neon/20 text-neon' : 'border-bone/20 text-bone/55'}`}>
          <Grid3x3 className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setView('list')} className={`grid h-7 w-7 place-items-center border ${view === 'list' ? 'border-neon bg-neon/20 text-neon' : 'border-bone/20 text-bone/55'}`}>
          <List className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
