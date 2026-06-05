import { useState } from 'react'
import { motion } from 'framer-motion'
import { items, categoryMap, type Item } from '../data/items'
import { useStore } from '../store/useStore'
import { Seal } from '../lib/svg'

const categories: { key: Item['category'] | 'all'; label: string; desc: string; seal: string }[] = [
  { key: 'all', label: '全部', desc: '凡三百六十件，悉列卷中。', seal: '全' },
  { key: 'ink', label: '墨', desc: categoryMap.ink.desc, seal: '墨' },
  { key: 'paper', label: '纸', desc: categoryMap.paper.desc, seal: '纸' },
  { key: 'brush', label: '笔', desc: categoryMap.brush.desc, seal: '笔' },
  { key: 'inkstone', label: '砚', desc: categoryMap.inkstone.desc, seal: '砚' },
  { key: 'tea', label: '茶', desc: categoryMap.tea.desc, seal: '茶' },
  { key: 'incense', label: '香', desc: categoryMap.incense.desc, seal: '香' },
  { key: 'curio', label: '玩', desc: categoryMap.curio.desc, seal: '玩' },
]

interface Props {
  onJump: (id: string) => void
}

export const JianghuDirectory: React.FC<Props> = ({ onJump }) => {
  const [hover, setHover] = useState<string>('墨')
  const current = categories.find((c) => c.seal === hover) ?? categories[0]
  const counts: Record<string, number> = {}
  items.forEach((i) => (counts[i.category] = (counts[i.category] ?? 0) + 1))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="lens-tag">CATALOGUE · 江湖目录</div>
        <h2 className="font-brush text-silk-100 text-6xl md:text-7xl mt-3">
          雅<span className="text-cinnabar">·</span>物<span className="text-cinnabar">·</span>典
        </h2>
        <div className="divider-tassel w-40 mt-6" />
        <p className="mt-6 text-silk-300/70 max-w-2xl leading-8 font-serif">
          墨纸笔砚，茶香雅玩；江湖之远，皆在卷中。客官可凭卷索骥，按类而入。
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
        <div className="md:col-span-5 flex flex-col gap-2">
          {categories.map((c, i) => (
            <button
              key={c.key}
              onMouseEnter={() => setHover(c.seal)}
              onClick={() => {
                useStore.getState().setCatalogFilter(c.key)
                onJump('cabinet')
              }}
              className="group flex items-center gap-5 px-5 py-4 border-l-2 border-gold-700/20 hover:border-cinnabar hover:bg-ink-800/30 transition"
            >
              <span className="chapter-num text-silk-300/40 text-xs w-6">{String(i).padStart(2, '0')}</span>
              <Seal char={c.seal} size={40} rotate={-4} />
              <div className="flex-1 text-left">
                <div className="font-brush text-silk-100 text-2xl">{c.label}</div>
                <div className="text-silk-300/60 text-xs leading-6 mt-1">{c.desc}</div>
              </div>
              <div className="text-silk-300/40 text-xs font-seal tracking-widest">
                {c.key === 'all' ? items.length : counts[c.key] ?? 0} 件
              </div>
            </button>
          ))}
        </div>
        <motion.div
          key={current.seal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-7 card-paper p-10 relative"
        >
          <div className="absolute top-0 right-0 p-6">
            <Seal char={current.seal} size={72} rotate={6} />
          </div>
          <div className="text-silk-300/40 font-seal tracking-widest text-xs">CATEGORY · {current.seal}</div>
          <h3 className="font-brush text-silk-100 text-5xl mt-2">{current.label}</h3>
          <p className="text-silk-300/80 leading-8 mt-4 max-w-md">{current.desc}</p>
          <div className="divider-tassel my-8" />
          <div className="grid grid-cols-3 gap-4">
            {items
              .filter((i) => current.key === 'all' || i.category === current.key)
              .slice(0, 3)
              .map((it) => (
                <div key={it.id} className="aspect-square border border-gold-700/30 p-3 flex flex-col justify-between" style={{ background: `linear-gradient(180deg, ${it.swatch}33, transparent)` }}>
                  <Seal char={it.seal} size={28} rotate={-3} />
                  <div className="font-brush text-silk-100 text-sm">{it.name}</div>
                </div>
              ))}
          </div>
          <button onClick={() => onJump('cabinet')} className="btn-ghost mt-8">入柜细览 →</button>
        </motion.div>
      </div>
    </div>
  )
}
