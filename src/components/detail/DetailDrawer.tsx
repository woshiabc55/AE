import { motion } from 'framer-motion'
import { X, Heart, GitCompare, ExternalLink, ChevronRight, Calendar, MapPin, Star, Hash, Cpu, User } from 'lucide-react'
import { useMemo } from 'react'
import { DERIVATIVES, TYPE_LABEL, TYPE_GLYPH } from '../../data/derivatives'
import { fmtRegion, fmtStatus, fmtDate } from '../../lib/stats'
import { HueCover } from '../ui/HueCover'
import { useLibraryStore } from '../../store/useLibraryStore'
import { Card } from '../library/CardGrid'

export function DetailDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const d = DERIVATIVES.find(x => x.id === id)
  const isFav = useLibraryStore(s => s.favorites.includes(id))
  const inCompare = useLibraryStore(s => s.compareList.includes(id))
  const toggleFav = useLibraryStore(s => s.toggleFavorite)
  const addCompare = useLibraryStore(s => s.addToCompare)
  const removeCompare = useLibraryStore(s => s.removeFromCompare)

  const related = useMemo(() => {
    if (!d) return []
    return DERIVATIVES.filter(x => x.ipKey === d.ipKey && x.id !== d.id).slice(0, 8)
  }, [d])

  if (!d) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.32 }}
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[560px] flex-col border-l border-bone/15 bg-ink/95 drawer-shadow"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-bone/15 p-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="chip chip-on">{TYPE_GLYPH[d.type]} {TYPE_LABEL[d.type]}</span>
              <span className="chip">{d.ip}</span>
              <span className="chip">{fmtStatus(d.status)}</span>
            </div>
            <h2 className="pixel-h mt-2 text-base leading-snug text-bone glow-text">{d.title}</h2>
            {d.originalTitle && <p className="mt-1 font-mono text-xs text-bone/55">{d.originalTitle}</p>}
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center border border-bone/20 text-bone/75 hover:border-neon hover:text-neon">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cover */}
        <div className="border-b border-bone/10">
          <HueCover hue={d.coverHue} title={d.title} type={d.type} size="md" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-2">
            <ActionBtn onClick={() => toggleFav(d.id)} active={isFav} kind="neon">
              <Heart className="h-3.5 w-3.5" fill={isFav ? 'currentColor' : 'none'} />
              {isFav ? '已收藏' : '加入收藏'}
            </ActionBtn>
            {inCompare ? (
              <ActionBtn onClick={() => removeCompare(d.id)} active kind="azure">
                <GitCompare className="h-3.5 w-3.5" />
                移出对比
              </ActionBtn>
            ) : (
              <ActionBtn onClick={() => addCompare(d.id)} kind="azure">
                <GitCompare className="h-3.5 w-3.5" />
                加入对比
              </ActionBtn>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field icon={<Calendar className="h-3.5 w-3.5 text-neon" />} label="发售日">{fmtDate(d.releaseDate)} · {d.year}</Field>
            <Field icon={<MapPin className="h-3.5 w-3.5 text-azure" />} label="地区">{fmtRegion(d.region)}</Field>
            <Field icon={<Star className="h-3.5 w-3.5 text-arcane" />} label="评分">{d.rating.toFixed(1)} / 10</Field>
            <Field icon={<Cpu className="h-3.5 w-3.5 text-arcade" />} label="形式分类">{TYPE_LABEL[d.type]}</Field>
            <Field icon={<User className="h-3.5 w-3.5 text-bone/65" />} label="制作方">{d.creator}</Field>
            {d.platform && <Field icon={<Hash className="h-3.5 w-3.5 text-bone/65" />} label="平台 / 渠道">{d.platform}</Field>}
            {d.director && <Field icon={<User className="h-3.5 w-3.5 text-bone/65" />} label="导演">{d.director}</Field>}
          </div>

          {d.cast && d.cast.length > 0 && (
            <Section title="相关角色">
              <div className="flex flex-wrap gap-1.5">
                {d.cast.map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </Section>
          )}

          {d.tags.length > 0 && (
            <Section title="标签">
              <div className="flex flex-wrap gap-1.5">
                {d.tags.map(t => <span key={t} className="chip chip-on">#{t}</span>)}
              </div>
            </Section>
          )}

          <Section title="简介">
            <p className="serif-cn text-sm leading-relaxed text-bone/85">{d.summary}</p>
          </Section>

          {related.length > 0 && (
            <Section title={`同 IP 其他衍生 · ${related.length}`}>
              <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2">
                {related.map(r => (
                  <div key={r.id} className="w-44 flex-shrink-0 snap-start">
                    <Card d={r} compact />
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </motion.aside>
    </>
  )
}

function ActionBtn({ children, onClick, active, kind }: { children: React.ReactNode; onClick: () => void; active?: boolean; kind: 'neon' | 'azure' }) {
  const cls = kind === 'neon'
    ? (active ? 'border-neon bg-neon text-ink' : 'border-bone/20 text-bone hover:border-neon hover:text-neon')
    : (active ? 'border-azure bg-azure text-ink' : 'border-bone/20 text-bone hover:border-azure hover:text-azure')
  return (
    <button onClick={onClick} className={`flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 font-pixel text-[10px] tracking-wider transition ${cls}`}>
      {children}
    </button>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="border border-bone/10 bg-ink/40 p-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-bone/55">
        {icon}
        <span className="label-pixel opacity-80">{label}</span>
      </div>
      <div className="font-mono text-[12px] text-bone">{children}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="label-pixel mb-2 flex items-center gap-1 opacity-80">
        <ChevronRight className="h-3 w-3 text-neon" /> {title}
      </div>
      {children}
    </div>
  )
}
