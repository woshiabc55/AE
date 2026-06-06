import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, X, Download, Trash2, Sparkles } from 'lucide-react'
import { useLibraryStore } from '../store/useLibraryStore'
import { DERIVATIVES, TYPE_LABEL } from '../data/derivatives'
import { fmtRegion, fmtDate, fmtStatus } from '../lib/stats'

export function Favorites() {
  const favorites = useLibraryStore(s => s.favorites)
  const toggleFavorite = useLibraryStore(s => s.toggleFavorite)
  const items = DERIVATIVES.filter(d => favorites.includes(d.id))
  const [tagFilter, setTagFilter] = useState('')

  const allTags = Array.from(new Set(items.flatMap(i => i.tags))).sort()
  const visible = tagFilter ? items.filter(i => i.tags.includes(tagFilter)) : items

  const exportJSON = () => {
    const data = items.map(d => ({ ...d }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ip-codex-favorites-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[1600px] px-4 py-6 md:px-8"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-neon" fill="currentColor" />
          <div>
            <h1 className="pixel-h text-2xl glow-text">收藏夹</h1>
            <p className="mt-1 font-mono text-[11px] text-bone/55">本地存储，刷新不丢</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip chip-on">已收藏 {items.length}</span>
          <button onClick={exportJSON} disabled={!items.length} className="btn-pixel success disabled:opacity-40">
            <Download className="h-3 w-3" /> 导出 JSON
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-bone/55" />
          <span className="label-pixel opacity-70">按标签筛选：</span>
          <button onClick={() => setTagFilter('')} className={`chip ${!tagFilter ? 'chip-on' : ''}`}>全部</button>
          {allTags.map(t => (
            <button key={t} onClick={() => setTagFilter(t === tagFilter ? '' : t)} className={`chip ${tagFilter === t ? 'chip-on' : ''}`}>#{t}</button>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <div className="tile p-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-bone/25" />
          <div className="mt-3 font-pixel text-base text-bone/65">收藏夹还是空的</div>
          <p className="mt-2 font-mono text-[12px] text-bone/45">到资料库点击卡片左上角的 ♥ 收藏作品</p>
        </div>
      ) : (
        <div className="tile overflow-hidden">
          <div className="grid grid-cols-[60px_minmax(0,2fr)_minmax(0,1fr)_90px_80px_70px_60px] items-center gap-3 border-b border-bone/10 bg-ink/60 px-3 py-2 font-pixel text-[9px] tracking-widest text-bone/55">
            <div>封面</div><div>标题 / IP</div><div>形式</div><div>年份</div><div>地区</div><div>评分</div><div>操作</div>
          </div>
          <div className="divide-y divide-bone/10">
            {visible.map(d => (
              <div key={d.id} className="grid grid-cols-[60px_minmax(0,2fr)_minmax(0,1fr)_90px_80px_70px_60px] items-center gap-3 px-3 py-2 hover:bg-bone/5">
                <div className="h-12 w-12 overflow-hidden border border-bone/20" style={{ background: `linear-gradient(135deg, hsl(${d.coverHue} 70% 50%), hsl(${(d.coverHue+40)%360} 70% 30%))` }} />
                <div>
                  <div className="line-clamp-1 font-pixel text-[11px] text-bone">{d.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-bone/55">
                    <span className="font-pixel">{d.ip}</span>
                    <span className="text-bone/30">·</span>
                    <span className="font-mono">{fmtDate(d.releaseDate)}</span>
                    <span className="text-bone/30">·</span>
                    <span>{fmtStatus(d.status)}</span>
                  </div>
                </div>
                <div className="chip chip-on">{TYPE_LABEL[d.type]}</div>
                <div className="font-pixel text-sm">{d.year}</div>
                <div className="font-mono text-[11px] text-bone/65">{fmtRegion(d.region)}</div>
                <div className="font-pixel text-sm" style={{ color: `hsl(${d.coverHue} 80% 65%)` }}>{d.rating.toFixed(1)}</div>
                <button onClick={() => toggleFavorite(d.id)} className="grid h-7 w-7 place-items-center border border-bone/20 text-bone/55 hover:border-neon hover:text-neon">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button onClick={() => { items.forEach(d => toggleFavorite(d.id)) }} className="btn-pixel danger">
            <Trash2 className="h-3 w-3" /> 清空全部收藏
          </button>
        </div>
      )}
    </motion.div>
  )
}
