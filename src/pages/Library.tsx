import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from '../components/library/SearchBar'
import { FilterSidebar } from '../components/library/FilterSidebar'
import { SortBar } from '../components/library/SortBar'
import { CardGrid } from '../components/library/CardGrid'
import { ListView } from '../components/library/ListView'
import { useLibraryStore, applyPipeline } from '../store/useLibraryStore'
import { DERIVATIVES } from '../data/derivatives'
import { ChevronDown } from 'lucide-react'

const PAGE_SIZE = 60

export function Library() {
  const query = useLibraryStore(s => s.query)
  const filters = useLibraryStore(s => s.filters)
  const sort = useLibraryStore(s => s.sort)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => applyPipeline(DERIVATIVES, query, filters, sort), [query, filters, sort])

  const paged = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paged.length < filtered.length

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[1600px] px-4 py-6 md:px-8"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="pixel-h text-2xl glow-text">资料库</h1>
          <p className="mt-1 font-mono text-[11px] text-bone/55">所有 {DERIVATIVES.length.toLocaleString()} 条记录的实时检索视图</p>
        </div>
      </div>

      <div className="mb-4">
        <SearchBar total={filtered.length} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FilterSidebar />
        <div>
          <div className="mb-3">
            <SortBar view={view} setView={setView} />
          </div>

          {filtered.length === 0 ? (
            <div className="tile p-12 text-center">
              <div className="font-pixel text-base text-bone/65">未找到匹配项</div>
              <p className="mt-2 font-mono text-[12px] text-bone/45">尝试调整筛选或重置关键词</p>
            </div>
          ) : view === 'grid' ? (
            <>
              <CardGrid items={paged} />
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button onClick={() => setPage(p => p + 1)} className="btn-pixel ghost">
                    加载更多（{filtered.length - paged.length} 项剩余）<ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <ListView items={paged} />
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button onClick={() => setPage(p => p + 1)} className="btn-pixel ghost">
                    加载更多（{filtered.length - paged.length} 项剩余）<ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </>
          )}

          {!hasMore && filtered.length > PAGE_SIZE && (
            <div className="mt-6 text-center font-mono text-[10px] text-bone/45">
              — 已加载全部 {filtered.length} 项 —
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
