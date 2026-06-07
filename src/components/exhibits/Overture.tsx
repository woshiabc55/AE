import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useStellaris } from '@/store/useStellaris'
import { mulberry32 } from '@/lib/random'
import { ArrowDown, Play } from 'lucide-react'

const CHARS = '万象STELLARIS观象象限010203456789∩∪∮∝∞◊◇◆※〇△▽☆☄✦✧❋❆◐◑◒◓░▒▓'

export function Overture() {
  const setActive = useStellaris((s) => s.setActive)
  const ref = useRef<HTMLCanvasElement>(null)
  const [pushed, setPushed] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    type P = { x: number; y: number; vy: number; ch: string; size: number; alpha: number }
    const rng = mulberry32(0xA1B2C3D4)
    const particles: P[] = []
    const N = 220

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = (p: P) => {
      p.x = rng() * w
      p.y = -20 - rng() * h
      p.vy = 0.4 + rng() * 1.4
      p.ch = CHARS[Math.floor(rng() * CHARS.length)]
      p.size = 14 + rng() * 28
      p.alpha = 0.05 + rng() * 0.4
    }

    for (let i = 0; i < N; i++) {
      const p: P = { x: 0, y: 0, vy: 0, ch: '', size: 0, alpha: 0 }
      spawn(p)
      p.y = rng() * h // start spread across
      particles.push(p)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(232,228,216,0.02)'
      ctx.fillRect(0, 0, w, h)
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      for (const p of particles) {
        p.y += p.vy
        if (p.y > h + 30) spawn(p)
        ctx.font = `300 ${p.size}px "Fraunces", Georgia, serif`
        ctx.fillStyle = `rgba(232,228,216,${p.alpha * 0.6})`
        ctx.fillText(p.ch, p.x, p.y)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  const enter = () => {
    setPushed(true)
    setTimeout(() => setActive('starmap'), 700)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-mist">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />

      {/* sun / focal disc */}
      <motion.div
        animate={pushed ? { scale: 6, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.55), rgba(212,175,55,0.06) 60%, transparent 80%)',
          filter: 'blur(2px)',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="section-meta"
        >
          <span className="num">00</span>
          <span>OVERTURE · 序厅</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display section-title mt-6"
          style={{ fontSize: 'clamp(3.4rem, 11vw, 12rem)' }}
        >
          <span className="gilt-text">STELLARIS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.7 }}
          className="font-han section-sub text-paper-70 mt-6 max-w-2xl"
        >
          十万颗微元素、十二个展厅、一组由声音与光标驱动的活体图腾。
          <br />
          万象天文台 · 一个独立的艺术网站。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.0 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <button
            onClick={enter}
            className="btn-capsule"
            data-cursor="hover"
          >
            <Play className="h-3 w-3" />
            <span>进入星图</span>
            <span className="arrow" />
          </button>
          <div className="flex items-center gap-2 text-paper-50 font-mono text-[0.65rem] tracking-widest mt-4">
            <ArrowDown className="h-3 w-3 animate-float" />
            <span>向下滚动以浏览全部展厅</span>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute left-1/2 bottom-6 -translate-x-1/2 text-paper/30 font-mono text-[0.6rem] tracking-[0.3em]">
        100,000+ UI ELEMENTS · 12 EXHIBITS · A LIVING OBSERVATORY
      </div>
    </div>
  )
}
