import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mulberry32 } from '@/lib/random'
import { RotateCcw } from 'lucide-react'

const SIZE = 64
const TOTAL = SIZE * SIZE // 4096

const SETS: string[][] = [
  // 拉丁扩展
  'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'.split(''),
  // 数字 / 符号
  Array.from('0123456789±∞∑∏∫∂∇≈≠≡≤≥⊕⊗⊞⊠◆◇○●□■△▽☆★♠♣♥♦'),
  // 希腊
  Array.from('ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω'),
  // 假名
  Array.from('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん'),
  // 汉字
  '观象万象星光暗影潮汐时间之门声音之地形之上色之海'.split(''),
  // 标点
  Array.from('.,;:!?·•‒–—―…·′″‘’“”«»‹›〈〉《》「」『』【】'),
  // 数学
  Array.from('∝∠∡∢∥∦∴∵∶∷∸∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉'),
  // 箭 / 杂
  Array.from('←↑→↓↔↕↖↗↘↙↚↛↜↝↞↟↠↡↢↣↤↥↦↧↨↩↪↫↬↭↮↯'),
]

export function GlyphSea() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<{ ch: string; x: number; y: number; rot: number; sz: number; cat: number; id: number }[]>([])
  const [resetting, setResetting] = useState(0)
  const [dragging, setDragging] = useState<{ id: number; dx: number; dy: number } | null>(null)

  useEffect(() => {
    const rng = mulberry32(0xBEEF1337)
    const arr = Array.from({ length: TOTAL }, (_, i) => {
      const cat = i % SETS.length
      const set = SETS[cat]
      return {
        id: i,
        ch: set[Math.floor(rng() * set.length)],
        x: (i % SIZE) * (100 / SIZE) + rng() * 0.4,
        y: Math.floor(i / SIZE) * (100 / SIZE) + rng() * 0.4,
        rot: (rng() - 0.5) * 14,
        sz: 1.4 + rng() * 1.6,
        cat,
      }
    })
    setItems(arr)
  }, [resetting])

  const onPointerDown = (id: number) => (e: React.PointerEvent) => {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    const rect = containerRef.current!.getBoundingClientRect()
    const it = items.find((i) => i.id === id)!
    setDragging({ id, dx: e.clientX - rect.left - (it.x / 100) * rect.width, dy: e.clientY - rect.top - (it.y / 100) * rect.height })
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const rect = containerRef.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left - dragging.dx) / rect.width) * 100
    const y = ((e.clientY - rect.top - dragging.dy) / rect.height) * 100
    setItems((p) => p.map((it) => it.id === dragging.id ? { ...it, x, y } : it))
  }
  const onPointerUp = () => setDragging(null)

  return (
    <div className="relative h-full w-full overflow-hidden bg-mist">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(232,228,216,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,228,216,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="absolute inset-0"
      >
        {items.map((it) => (
          <div
            key={`${it.id}-${resetting}`}
            onPointerDown={onPointerDown(it.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none rounded-sm bord-paper-15 bg-ink/40 hover:bg-ink/80 transition-colors duration-500 flex items-center justify-center"
            style={{
              left: `${it.x}%`,
              top: `${it.y}%`,
              transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
              width: 38,
              height: 38,
              fontSize: `${it.sz}rem`,
              touchAction: 'none',
              fontFamily: it.cat === 2 || it.cat === 3 || it.cat === 4
                ? '"Noto Serif SC", serif'
                : '"JetBrains Mono", monospace',
              color: it.cat === 1 ? 'rgba(212,175,55,0.85)' : 'rgba(232,228,216,0.85)',
            }}
            data-cursor="hover"
          >
            {it.ch}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="section-meta"
        >
          <span className="num">02</span>
          <span>GLYPH SEA · 字海</span>
        </motion.div>
        <h2 className="font-display section-title mt-3">
          拖拽<br />字符<br />写诗
        </h2>
        <p className="font-han section-sub mt-5">
          4,096 个字符方块，悬浮于八套字汇之间。
          按住任一方块拖动，重组你的句子；点击右侧按钮回到初始排序。
        </p>
        <button
          onClick={() => { setResetting((n) => n + 1); setDragging(null) }}
          className="mt-6 btn-capsule"
          data-cursor="hover"
        >
          <RotateCcw className="h-3 w-3" />
          <span>重置</span>
        </button>
      </div>

      <div className="pointer-events-none absolute right-6 bottom-6 md:right-12 md:bottom-12 z-10 text-right font-mono text-[0.7rem] tracking-widest text-paper/60">
        <div>CHARS · 4,096</div>
        <div className="text-paper/40 mt-1">SETS · 8</div>
      </div>
    </div>
  )
}
