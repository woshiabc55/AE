import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { items, categoryMap, type Item } from '../data/items'
import { useStore } from '../store/useStore'
import { Seal } from '../lib/svg'

const filters: (Item['category'] | 'all')[] = ['all', 'ink', 'paper', 'brush', 'inkstone', 'tea', 'incense', 'curio']

export const Cabinet = () => {
  const filter = useStore((s) => s.catalogFilter)
  const setFilter = useStore((s) => s.setCatalogFilter)
  const collection = useStore((s) => s.collection)
  const toggle = useStore((s) => s.toggleCollect)
  const isKeeper = useStore((s) => s.isKeeper)
  const [active, setActive] = useState<Item | null>(null)

  const list = items.filter((i) => filter === 'all' || i.category === filter)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="lens-tag">CABINET · 雅物柜</div>
        <h2 className="font-brush text-silk-100 text-6xl md:text-7xl mt-3">
          墨<span className="text-cinnabar">·</span>纸<span className="text-cinnabar">·</span>笔<span className="text-cinnabar">·</span>砚
        </h2>
        <div className="divider-tassel w-40 mt-6" />
        <p className="mt-6 text-silk-300/70 max-w-2xl leading-8 font-serif">
          取古意于器物，列卷中以为案头清供。客官可悬停细观，亦可"卷藏"入私阁。
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-brush tracking-widest border transition ${
              filter === f
                ? 'bg-cinnabar text-silk-50 border-cinnabar'
                : 'border-gold-700/30 text-silk-300 hover:border-gold-500 hover:text-gold-500'
            }`}
          >
            {f === 'all' ? '全 卷' : categoryMap[f as Item['category']].label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((it, i) => {
          const collected = collection.includes(it.id)
          return (
            <motion.article
              key={it.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              onMouseEnter={() => setActive(it)}
              onMouseLeave={() => setActive(null)}
              className={`card-paper p-6 group relative transition-all ${active?.id === it.id ? 'glow-cinnabar' : ''}`}
            >
              <div className="absolute top-4 left-4">
                <Seal char={it.seal} size={36} rotate={-6} />
              </div>
              <div className="absolute top-4 right-4 text-silk-300/40 font-seal text-[10px] tracking-widest">
                NO. {String(i + 1).padStart(3, '0')}
              </div>
              <div className="aspect-[3/4] mt-10 mb-6 relative grid place-items-center" style={{ background: `radial-gradient(ellipse at center, ${it.swatch}22, transparent 65%)` }}>
                <ItemGlyph item={it} />
              </div>
              <h3 className="font-brush text-silk-100 text-2xl mb-1">{it.name}</h3>
              <div className="text-silk-300/50 text-[11px] font-seal tracking-widest mb-3">
                {it.origin} · {it.weight}
              </div>
              <p className="text-silk-300/70 text-sm leading-7 line-clamp-3">{it.story}</p>
              <div className="mt-5 pt-5 border-t border-gold-700/20 flex items-center justify-between">
                <div>
                  <div className="text-silk-300/50 text-[10px] tracking-widest font-seal">铜钱 / ¥</div>
                  <div className="font-seal text-cinnabar text-lg">{it.price.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => toggle(it.id)}
                  className={`px-3 py-1.5 text-sm font-brush tracking-widest border transition ${
                    collected
                      ? 'bg-cinnabar text-silk-50 border-cinnabar'
                      : 'border-gold-500/40 text-gold-500 hover:bg-gold-500/10'
                  }`}
                >
                  {collected ? '已卷藏 ✓' : '卷 藏'}
                </button>
              </div>
            </motion.article>
          )
        })}
      </div>
      <AnimatePresence>
        {isKeeper && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-12 mx-auto max-w-2xl card-paper p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Seal char="阁" size={40} rotate={4} />
              <div>
                <div className="font-brush text-silk-100 text-lg">私藏墨宝</div>
                <div className="text-silk-300/60 text-sm">共卷藏 {collection.length} 件</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ItemGlyph: React.FC<{ item: Item }> = ({ item }) => {
  switch (item.category) {
    case 'ink':
      return (
        <div className="relative w-32 h-32">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${item.swatch}, #2a1f12)`, clipPath: 'polygon(20% 0, 80% 0, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0 70%, 0 30%)' }} />
          <div className="absolute inset-x-6 top-6 h-1 bg-gold-500/30" />
          <div className="absolute inset-x-6 bottom-6 h-1 bg-gold-500/30" />
          <span className="absolute inset-0 grid place-items-center font-brush text-silk-100 text-3xl">墨</span>
        </div>
      )
    case 'paper':
      return (
        <div className="relative w-32 h-32">
          <div className="absolute inset-0" style={{ background: `${item.swatch}22`, border: `1px solid ${item.swatch}66` }} />
          <div className="absolute inset-3 border border-gold-500/20" />
          <span className="absolute inset-0 grid place-items-center font-brush text-silk-100 text-3xl">纸</span>
        </div>
      )
    case 'brush':
      return (
        <div className="relative w-40 h-24">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2" style={{ background: `linear-gradient(90deg, ${item.swatch}, #F2E9D8, ${item.swatch})` }} />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-5 bg-[#3D2A18]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-ink-950" />
        </div>
      )
    case 'inkstone':
      return (
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-md" style={{ background: `linear-gradient(180deg, ${item.swatch}, #0E0B08)` }} />
          <div className="absolute inset-6 rounded-full bg-ink-950/80 border border-gold-500/30" />
          <span className="absolute inset-0 grid place-items-center font-brush text-silk-100 text-2xl">砚</span>
        </div>
      )
    case 'tea':
      return (
        <div className="relative w-32 h-32">
          <div className="absolute inset-3 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, ${item.swatch}, #0E0B08)` }} />
          <div className="absolute inset-3 rounded-full border-2 border-gold-500/30" />
          <span className="absolute inset-0 grid place-items-center font-brush text-silk-100 text-2xl">茶</span>
        </div>
      )
    case 'incense':
      return (
        <div className="relative w-24 h-32">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-16" style={{ background: `linear-gradient(180deg, ${item.swatch}, #3D2A18)` }} />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-6 bg-cinnabar" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold-500 animate-flicker" />
        </div>
      )
    case 'curio':
      return (
        <div className="relative w-32 h-32">
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${item.swatch}, #0E0B08)` }} />
          <div className="absolute inset-x-4 top-4 h-12 border border-gold-500/40 rounded-t-full" />
          <div className="absolute inset-x-2 bottom-4 h-6 bg-ink-800" />
        </div>
      )
  }
}
