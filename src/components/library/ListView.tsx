import { useEffect, useState } from 'react'
import { Heart, GitCompare, Eye, ChevronRight } from 'lucide-react'
import type { Derivative } from '../../data/derivatives'
import { TYPE_LABEL } from '../../data/derivatives'
import { useLibraryStore } from '../../store/useLibraryStore'
import { fmtRegion, fmtStatus, fmtDate } from '../../lib/stats'

export function ListView({ items }: { items: Derivative[] }) {
  return (
    <div className="tile overflow-hidden">
      <div className="grid grid-cols-[60px_minmax(0,2fr)_minmax(0,1fr)_90px_70px_70px_60px] items-center gap-3 border-b border-bone/10 bg-ink/60 px-3 py-2 font-pixel text-[9px] tracking-widest text-bone/55">
        <div>封面</div>
        <div>标题 / IP</div>
        <div>形式 / 标签</div>
        <div>年份</div>
        <div>地区</div>
        <div>评分</div>
        <div>操作</div>
      </div>
      <div className="divide-y divide-bone/10">
        {items.map(d => <Row key={d.id} d={d} />)}
      </div>
    </div>
  )
}

function Row({ d }: { d: Derivative }) {
  const isFav = useLibraryStore(s => s.favorites.includes(d.id))
  const inCompare = useLibraryStore(s => s.compareList.includes(d.id))
  const toggleFav = useLibraryStore(s => s.toggleFavorite)
  const addCompare = useLibraryStore(s => s.addToCompare)
  const openDetail = useLibraryStore(s => s.openDetail)
  return (
    <div
      onClick={() => openDetail(d.id)}
      className="grid grid-cols-[60px_minmax(0,2fr)_minmax(0,1fr)_90px_70px_70px_60px] items-center gap-3 px-3 py-2 transition hover:bg-bone/5"
    >
      <div className="h-12 w-12 overflow-hidden border border-bone/20" style={{ background: `linear-gradient(135deg, hsl(${d.coverHue} 70% 50%), hsl(${(d.coverHue+40)%360} 70% 30%))` }} />
      <div className="min-w-0">
        <div className="line-clamp-1 font-pixel text-[11px] text-bone">{d.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-bone/55">
          <span className="font-pixel">{d.ip}</span>
          <span className="text-bone/30">·</span>
          <span className="font-mono">{fmtDate(d.releaseDate)}</span>
          <span className="text-bone/30">·</span>
          <span className="line-clamp-1">{d.creator}</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="chip chip-on">{TYPE_LABEL[d.type]}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {d.tags.slice(0, 2).map(t => <span key={t} className="chip">#{t}</span>)}
        </div>
      </div>
      <div className="font-pixel text-sm text-bone">{d.year}</div>
      <div className="font-mono text-[11px] text-bone/65">{fmtRegion(d.region)}</div>
      <div className="font-pixel text-sm" style={{ color: `hsl(${d.coverHue} 80% 65%)` }}>{d.rating.toFixed(1)}</div>
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => toggleFav(d.id)} className={`grid h-6 w-6 place-items-center border ${isFav ? 'border-neon bg-neon text-ink' : 'border-bone/25 text-bone/65'} hover:scale-110`}>
          <Heart className="h-3 w-3" fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <button onClick={() => addCompare(d.id)} className={`grid h-6 w-6 place-items-center border ${inCompare ? 'border-azure bg-azure text-ink' : 'border-bone/25 text-bone/65'} hover:scale-110`}>
          <GitCompare className="h-3 w-3" />
        </button>
        <button onClick={() => openDetail(d.id)} className="grid h-6 w-6 place-items-center border border-bone/25 text-bone/65 hover:border-neon hover:text-neon">
          <Eye className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
