import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Seal } from '../lib/svg'
import { items } from '../data/items'
import { classics } from '../data/classics'

const messages = [
  '江湖夜雨十年灯，何处是归程。',
  '卷中虽无剑，案上自有锋。',
  '把卷问青天，可记旧时月。',
  '万马奔腾处，卷末落朱砂。',
]

export const SealNote = () => {
  const { isKeeper, toggleKeeper, collection, toggleCollect } = useStore()
  const [msg, setMsg] = useState(messages[0])
  const [name, setName] = useState('')
  const [stamped, setStamped] = useState(false)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="lens-tag">SEAL · 卷末寄语</div>
        <h2 className="font-brush text-silk-100 text-6xl md:text-7xl mt-3">
          落<span className="text-cinnabar">·</span>卷<span className="text-cinnabar">·</span>寄<span className="text-cinnabar">·</span>语
        </h2>
        <div className="divider-tassel w-40 mt-6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 card-paper p-10 relative">
          <div className="absolute -top-3 -left-3">
            <Seal char="寄" size={48} rotate={-6} />
          </div>
          <div className="text-silk-300/50 text-xs font-seal tracking-widest mb-3">卷末 · 客官寄语</div>
          <p className="font-brush text-silk-100 text-3xl md:text-4xl leading-relaxed">「{msg}」</p>
          <div className="divider-tassel my-6" />
          <div className="flex flex-wrap gap-2">
            {messages.map((m) => (
              <button
                key={m}
                onClick={() => setMsg(m)}
                className={`px-3 py-1.5 text-xs font-brush border tracking-widest transition ${
                  msg === m ? 'border-cinnabar text-cinnabar bg-cinnabar/10' : 'border-gold-700/30 text-silk-300/70 hover:border-gold-500'
                }`}
              >
                {m.slice(0, 8)}…
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="落款 · 客官署名"
              className="flex-1 bg-transparent border-b border-gold-700/40 focus:border-cinnabar outline-none py-2 text-silk-100 placeholder:text-silk-300/30 font-brush tracking-widest"
            />
            <button
              onClick={() => {
                setStamped(true)
                if (!isKeeper) toggleKeeper()
                setTimeout(() => setStamped(false), 1600)
              }}
              className={`btn-seal ${stamped ? 'animate-flicker' : ''}`}
            >
              {stamped ? '已落印' : '落 印'}
            </button>
          </div>
          <p className="mt-4 text-silk-300/50 text-sm">
            {name ? (
              <span>谨以此卷，奉 <span className="text-cinnabar font-brush">{name || '客官'}</span> 阁下落印。</span>
            ) : (
              '留一处空，待客官自填。'
            )}
          </p>
        </div>
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="card-paper p-6">
            <div className="flex items-center gap-3 mb-3">
              <Seal char="荐" size={36} rotate={4} />
              <div className="font-brush text-silk-100 text-xl">卷主亲荐</div>
            </div>
            <div className="space-y-3">
              {items.slice(0, 3).map((it) => (
                <div key={it.id} className="flex items-center gap-3 text-silk-300/80 text-sm">
                  <span className="w-2 h-2 rounded-full" style={{ background: it.swatch }} />
                  <span className="flex-1">{it.name}</span>
                  <span className="text-silk-300/40 font-seal text-xs">¥{it.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-paper p-6">
            <div className="flex items-center gap-3 mb-3">
              <Seal char="卷" size={36} rotate={-4} />
              <div className="font-brush text-silk-100 text-xl">私藏速览</div>
            </div>
            {collection.length === 0 ? (
              <p className="text-silk-300/50 text-sm">尚无卷藏。返回雅物柜"卷藏"任意一件。</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {collection.slice(0, 6).map((id) => {
                  const it = items.find((x) => x.id === id)!
                  return (
                    <div key={id} className="aspect-square border border-gold-700/30 grid place-items-center" style={{ background: `${it.swatch}33` }}>
                      <Seal char={it.seal} size={28} rotate={-3} />
                    </div>
                  )
                })}
              </div>
            )}
            <button onClick={() => collection.forEach((id) => toggleCollect(id))} className="mt-4 text-xs text-silk-300/40 hover:text-cinnabar transition">清空私藏</button>
          </div>
          <div className="card-paper p-6">
            <div className="flex items-center gap-3 mb-2">
              <Seal char="藏" size={36} rotate={6} />
              <div className="font-brush text-silk-100 text-xl">典籍引</div>
            </div>
            <ul className="space-y-2 text-sm text-silk-300/80">
              {classics.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <span>{c.title}</span>
                  <span className="text-silk-300/40 font-seal text-[10px] tracking-widest">{c.dynasty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
