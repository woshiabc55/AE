import { useLibraryStore } from '../../store/useLibraryStore'
import { TYPES, TYPE_LABEL, REGIONS, REGION_LABEL, STATUSES, STATUS_LABEL } from '../../data/derivatives'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'

export function FilterSidebar() {
  const { filters, toggleType, toggleRegion, toggleStatus, setYearRange, setRatingMin, resetFilters } = useLibraryStore()
  return (
    <aside className="tile sticky top-[64px] flex max-h-[calc(100vh-80px)] flex-col overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-neon" />
          <span className="label-pixel">筛选器</span>
        </div>
        <button onClick={resetFilters} className="flex items-center gap-1 font-mono text-[10px] text-bone/55 hover:text-neon">
          <RotateCcw className="h-3 w-3" /> 重置
        </button>
      </div>

      <div className="-mr-2 flex-1 space-y-5 overflow-y-auto pr-2">
        <Group title="衍生形式">
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={`chip ${filters.types.includes(t) ? 'chip-on' : ''}`}
              >
                {TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </Group>

        <Group title="首发地区">
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => toggleRegion(r)}
                className={`chip ${filters.regions.includes(r) ? 'chip-on' : ''}`}
              >
                {REGION_LABEL[r]}
              </button>
            ))}
          </div>
        </Group>

        <Group title="状态">
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={`chip ${filters.status.includes(s) ? 'chip-on' : ''}`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </Group>

        <Group title="年份范围">
          <div className="flex items-center justify-between font-mono text-[10px] text-bone/65">
            <span>{filters.yearMin}</span>
            <span>—</span>
            <span>{filters.yearMax}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="range" min={1985} max={2026} value={filters.yearMin}
              onChange={(e) => setYearRange(Math.min(+e.target.value, filters.yearMax), filters.yearMax)}
            />
            <input
              type="range" min={1985} max={2026} value={filters.yearMax}
              onChange={(e) => setYearRange(filters.yearMin, Math.max(+e.target.value, filters.yearMin))}
            />
          </div>
        </Group>

        <Group title={`最低评分 · ${filters.ratingMin.toFixed(1)}`}>
          <input
            type="range" min={0} max={10} step={0.1} value={filters.ratingMin}
            onChange={(e) => setRatingMin(+e.target.value)}
          />
        </Group>
      </div>
    </aside>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-pixel mb-2 opacity-80">{title}</div>
      {children}
    </div>
  )
}
