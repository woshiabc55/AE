import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { classics } from '../data/classics'
import { Seal } from '../lib/svg'

export const Library = () => {
  const [page, setPage] = useState(0)
  const book = classics[page]
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="lens-tag">LIBRARY · 典藏阁</div>
        <h2 className="font-brush text-silk-100 text-6xl md:text-7xl mt-3">
          经<span className="text-cinnabar">·</span>史<span className="text-cinnabar">·</span>谱<span className="text-cinnabar">·</span>帖
        </h2>
        <div className="divider-tassel w-40 mt-6" />
        <p className="mt-6 text-silk-300/70 max-w-2xl leading-8 font-serif">
          以"经、史、谱、帖"四部，列卷中典籍；非为售卖，乃为案头清赏。
        </p>
      </div>

      <div className="relative">
        {/* 翻书主区 */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={book.id}
              initial={{ opacity: 0, rotateY: -8 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 8 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 card-paper p-10 relative min-h-[440px]"
              style={{
                background: `linear-gradient(180deg, rgba(242,233,216,0.04), ${book.swatch}10), #15110D`,
              }}
            >
              <div className="absolute top-0 right-0 p-6">
                <Seal char={book.kind} size={56} rotate={6} />
              </div>
              <div className="text-silk-300/40 font-seal tracking-widest text-xs">
                {book.dynasty} · 撰 {book.author}
              </div>
              <h3 className="font-brush text-silk-100 text-5xl mt-2 leading-tight">{book.title}</h3>
              <div className="divider-tassel my-6" />
              <p className="text-silk-300/80 leading-8 font-serif text-lg">{book.blurb}</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {book.chapters.map((c, i) => (
                  <div
                    key={i}
                    className="border border-gold-700/30 p-3 text-silk-300/70 text-sm hover:text-silk-100 hover:border-cinnabar/60 transition cursor-default"
                  >
                    <span className="font-seal text-cinnabar mr-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {c}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="md:col-span-5 flex flex-col gap-3">
            {classics.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setPage(i)}
                className={`text-left card-paper p-5 flex items-center gap-4 transition ${
                  i === page
                    ? 'glow-gold border-gold-500/60'
                    : 'hover:border-gold-500/40'
                }`}
              >
                <span
                  className="w-10 h-10 grid place-items-center font-brush text-silk-100"
                  style={{ background: c.swatch }}
                >
                  {c.kind}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-brush text-silk-100 text-xl">{c.title}</div>
                  <div className="text-silk-300/50 text-xs font-seal tracking-widest">
                    {c.dynasty} · {c.author}
                  </div>
                </div>
                <div className="text-silk-300/30 font-seal text-xs">
                  {String(i + 1).padStart(2, '0')}/{String(classics.length).padStart(2, '0')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 翻页控件 */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => (p - 1 + classics.length) % classics.length)}
            className="btn-ghost"
          >
            ← 翻上页
          </button>
          <span className="text-silk-300/40 font-seal tracking-widest text-xs">
            {String(page + 1).padStart(2, '0')} / {String(classics.length).padStart(2, '0')}
          </span>
          <button
            onClick={() => setPage((p) => (p + 1) % classics.length)}
            className="btn-ghost"
          >
            翻下页 →
          </button>
        </div>
      </div>
    </div>
  )
}
