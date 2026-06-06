import { motion } from 'framer-motion'
import { GitCompare, X, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLibraryStore } from '../store/useLibraryStore'
import { DERIVATIVES, TYPE_LABEL } from '../data/derivatives'
import { fmtRegion, fmtStatus, fmtDate } from '../lib/stats'

const FIELDS: Array<{ key: keyof typeof FIELDS_MAP; label: string }> = [
  { key: 'year', label: '年份' },
  { key: 'region', label: '地区' },
  { key: 'type', label: '形式' },
  { key: 'creator', label: '制作方' },
  { key: 'platform', label: '平台' },
  { key: 'director', label: '导演' },
  { key: 'releaseDate', label: '发售日' },
  { key: 'status', label: '状态' },
  { key: 'rating', label: '评分' },
  { key: 'popularity', label: '热门度' },
  { key: 'tags', label: '标签' },
  { key: 'cast', label: '角色' },
]

const FIELDS_MAP = {
  year: (d: any) => d.year,
  region: (d: any) => fmtRegion(d.region),
  type: (d: any) => TYPE_LABEL[d.type as keyof typeof TYPE_LABEL],
  creator: (d: any) => d.creator,
  platform: (d: any) => d.platform ?? '—',
  director: (d: any) => d.director ?? '—',
  releaseDate: (d: any) => fmtDate(d.releaseDate),
  status: (d: any) => fmtStatus(d.status),
  rating: (d: any) => `${d.rating.toFixed(1)} / 10`,
  popularity: (d: any) => d.popularity,
  tags: (d: any) => d.tags.join('、') || '—',
  cast: (d: any) => d.cast?.join('、') ?? '—',
}

export function Compare() {
  const list = useLibraryStore(s => s.compareList)
  const remove = useLibraryStore(s => s.removeFromCompare)
  const clear = useLibraryStore(s => s.clearCompare)
  const items = list.map(id => DERIVATIVES.find(d => d.id === id)).filter(Boolean) as any[]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-[1600px] px-4 py-6 md:px-8"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <GitCompare className="h-6 w-6 text-azure" />
          <div>
            <h1 className="pixel-h text-2xl glow-text-blue">对比模式</h1>
            <p className="mt-1 font-mono text-[11px] text-bone/55">最多同时对比 3 件作品</p>
          </div>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="btn-pixel danger">
            <X className="h-3 w-3" /> 清空对比
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="tile p-16 text-center">
          <GitCompare className="mx-auto h-12 w-12 text-bone/25" />
          <div className="mt-3 font-pixel text-base text-bone/65">对比栏位还是空的</div>
          <p className="mt-2 font-mono text-[12px] text-bone/45">在资料库卡片上点击「⤢」按钮可加入对比</p>
          <Link to="/library" className="btn-pixel azure mt-5">
            <Plus className="h-3 w-3" /> 前往资料库
          </Link>
        </div>
      ) : (
        <div className="tile overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-bone/15 bg-ink/60">
                <th className="w-32 px-3 py-2 text-left font-pixel text-[9px] tracking-widest text-bone/55">字段</th>
                {items.map(d => (
                  <th key={d.id} className="min-w-40 px-3 py-2 text-left">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 flex-shrink-0 border border-bone/20" style={{ background: `linear-gradient(135deg, hsl(${d.coverHue} 70% 50%), hsl(${(d.coverHue+40)%360} 70% 30%))` }} />
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-pixel text-[10px] text-bone">{d.title}</div>
                        <div className="font-mono text-[10px] text-bone/55">{d.ip}</div>
                      </div>
                      <button onClick={() => remove(d.id)} className="ml-auto grid h-6 w-6 place-items-center border border-bone/20 text-bone/55 hover:border-neon hover:text-neon">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="min-w-40 px-3 py-2 text-left">
                    <Link to="/library" className="flex h-8 items-center justify-center gap-1 border border-dashed border-bone/25 font-pixel text-[10px] text-bone/45 hover:border-azure hover:text-azure">
                      <Plus className="h-3 w-3" /> 添加
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map(f => (
                <tr key={f.key} className="border-b border-bone/10">
                  <td className="px-3 py-2 align-top font-pixel text-[10px] tracking-widest text-bone/55">{f.label}</td>
                  {items.map(d => {
                    const values = items.map(x => FIELDS_MAP[f.key](x))
                    const v = FIELDS_MAP[f.key](d)
                    const isDifferent = values.filter(x => x === v).length === 1
                    return (
                      <td key={d.id} className={`px-3 py-2 font-mono text-[12px] ${isDifferent ? 'bg-arcane/15 text-bone' : 'text-bone/75'}`}>
                        {v}
                      </td>
                    )
                  })}
                  {Array.from({ length: 3 - items.length }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-3 py-2 text-bone/25">—</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-3 py-2 align-top font-pixel text-[10px] tracking-widest text-bone/55">简介</td>
                {items.map(d => (
                  <td key={d.id} className="px-3 py-2 align-top">
                    <p className="serif-cn text-[12px] leading-relaxed text-bone/80">{d.summary}</p>
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={`empty-${i}`} className="px-3 py-2 text-bone/25">—</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
