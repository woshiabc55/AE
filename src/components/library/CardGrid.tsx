import { Heart, GitCompare, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Derivative } from '../../data/derivatives'
import { TYPE_LABEL, TYPE_GLYPH } from '../../data/derivatives'
import { HueCover } from '../ui/HueCover'
import { useLibraryStore } from '../../store/useLibraryStore'
import { fmtRegion, fmtStatus, fmtDate } from '../../lib/stats'

export function Card({ d, compact }: { d: Derivative; compact?: boolean }) {
  const isFav = useLibraryStore(s => s.favorites.includes(d.id))
  const inCompare = useLibraryStore(s => s.compareList.includes(d.id))
  const toggleFav = useLibraryStore(s => s.toggleFavorite)
  const addCompare = useLibraryStore(s => s.addToCompare)
  const openDetail = useLibraryStore(s => s.openDetail)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="tile group flex flex-col"
    >
      <div className="relative cursor-pointer" onClick={() => openDetail(d.id)}>
        <HueCover hue={d.coverHue} title={d.title} type={d.type} size={compact ? 'sm' : 'md'} />
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
          <span className="chip bg-ink/70">{d.year}</span>
          <span className="chip bg-ink/70">{fmtRegion(d.region)}</span>
        </div>
        <button
          aria-label="收藏"
          onClick={(e) => { e.stopPropagation(); toggleFav(d.id) }}
          className={`absolute left-2 top-2 grid h-7 w-7 place-items-center border ${isFav ? 'border-neon bg-neon text-ink' : 'border-bone/35 bg-ink/70 text-bone/85'} hover:scale-110 transition`}
        >
          <Heart className="h-3.5 w-3.5" fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <span className="chip chip-on">{TYPE_GLYPH[d.type]} {TYPE_LABEL[d.type]}</span>
          <span className="chip">{fmtStatus(d.status)}</span>
        </div>
        <h3 className="line-clamp-2 font-pixel text-[12px] leading-snug text-bone" title={d.title}>
          {d.title}
        </h3>
        {d.originalTitle && (
          <p className="mt-0.5 line-clamp-1 font-mono text-[10px] text-bone/55">{d.originalTitle}</p>
        )}
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-bone/60">
          <span className="font-pixel">{d.ip}</span>
          <span className="text-bone/30">·</span>
          <span className="font-mono">{fmtDate(d.releaseDate)}</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {d.tags.slice(0, 3).map(t => (
            <span key={t} className="chip">#{t}</span>
          ))}
        </div>

        {!compact && (
          <p className="mt-2 line-clamp-2 font-serif text-[12px] leading-relaxed text-bone/65">
            {d.summary}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-bone/10 pt-2.5">
          <div className="flex items-center gap-2">
            <div className="font-pixel text-sm" style={{ color: `hsl(${d.coverHue} 80% 65%)` }}>
              {d.rating.toFixed(1)}
            </div>
            <div className="font-mono text-[10px] text-bone/45">/10</div>
            <div className="h-1 w-12 bg-bone/10">
              <div className="h-full" style={{ width: `${d.rating * 10}%`, background: `hsl(${d.coverHue} 80% 60%)` }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="对比"
              onClick={() => addCompare(d.id)}
              className={`grid h-6 w-6 place-items-center border ${inCompare ? 'border-azure bg-azure text-ink' : 'border-bone/35 text-bone/75 hover:text-azure'} transition`}
            >
              <GitCompare className="h-3 w-3" />
            </button>
            <button
              aria-label="查看"
              onClick={() => openDetail(d.id)}
              className="grid h-6 w-6 place-items-center border border-bone/35 text-bone/75 hover:border-neon hover:text-neon transition"
            >
              <Eye className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CardGrid({ items, compact }: { items: Derivative[]; compact?: boolean }) {
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
      {items.map(d => <Card key={d.id} d={d} compact={compact} />)}
    </div>
  )
}
