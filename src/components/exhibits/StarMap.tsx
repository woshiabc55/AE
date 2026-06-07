import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { mulberry32 } from '@/lib/random'
import { useStellaris } from '@/store/useStellaris'

const COUNT = 100_000
const RADIUS = 5200

interface Star {
  x: number
  y: number
  r: number
  a: number
  hue: number
  twinkle: number
  glyph: string
  id: number
  arm: number
  z: number
}

const GLYPHS = '·∘○●◌◍◉⊕⊗✦✧⋆✴︎☄️星觀象衡象限万有引光'

export function StarMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<{ x: number; y: number; star: Star } | null>(null)
  const transformRef = useRef({ scale: 1, tx: 0, ty: 0 })
  const [stats, setStats] = useState({ drawn: 0 })

  const stars = useMemo<Star[]>(() => {
    const rng = mulberry32(0xC0FFEE01)
    const arr: Star[] = []
    // Build a soft 4-arm spiral galaxy
    for (let i = 0; i < COUNT; i++) {
      const arm = i % 4
      const t = rng()
      // logarithmic spiral radius
      const r = Math.pow(t, 0.7) * RADIUS
      const baseAngle = arm * (Math.PI * 0.5) + r * 0.0021
      const jitter = (rng() - 0.5) * 0.6
      const angle = baseAngle + jitter
      const x = Math.cos(angle) * r + (rng() - 0.5) * 40
      const y = Math.sin(angle) * r + (rng() - 0.5) * 40
      const z = rng()
      arr.push({
        x,
        y,
        r: 0.4 + rng() * 1.6 + (1 - z) * 0.4,
        a: 0.4 + rng() * 0.6,
        hue: 38 + rng() * 24, // gold-ish
        twinkle: rng() * Math.PI * 2,
        glyph: GLYPHS[Math.floor(rng() * GLYPHS.length)],
        id: i,
        arm,
        z,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Pan/zoom
    let dragging = false
    let lastX = 0, lastY = 0
    let frame = 0

    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (dragging) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
        transformRef.current.tx += dx
        transformRef.current.ty += dy
      }
      // Hit test: convert pointer to world
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left - w / 2
      const cy = e.clientY - rect.top - h / 2
      const sc = transformRef.current.scale
      const wx = (cx - transformRef.current.tx) / sc
      const wy = (cy - transformRef.current.ty) / sc
      let nearest: Star | null = null
      let nd = 14 / sc
      for (let i = 0; i < 2000; i++) {
        const idx = (frame * 137 + i * 911) % stars.length
        const s = stars[idx]
        const dx = s.x - wx
        const dy = s.y - wy
        const d = Math.hypot(dx, dy)
        if (d < nd) { nearest = s; nd = d; break }
      }
      if (nearest) {
        setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, star: nearest })
      } else {
        setHover(null)
      }
    }
    const onUp = () => { dragging = false }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const k = Math.exp(-e.deltaY * 0.0015)
      transformRef.current.scale = Math.max(0.25, Math.min(6, transformRef.current.scale * k))
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    const draw = () => {
      frame++
      const sc = transformRef.current.scale
      const tx = transformRef.current.tx
      const ty = transformRef.current.ty
      ctx.fillStyle = 'rgba(5,6,16,0.35)'
      ctx.fillRect(0, 0, w, h)
      ctx.save()
      ctx.translate(w / 2 + tx, h / 2 + ty)
      ctx.scale(sc, sc)

      // soft galactic core
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 800)
      grad.addColorStop(0, 'rgba(212,175,55,0.30)')
      grad.addColorStop(0.4, 'rgba(212,175,55,0.10)')
      grad.addColorStop(1, 'rgba(212,175,55,0)')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(0, 0, 800, 0, Math.PI * 2); ctx.fill()

      // stars
      const t = performance.now() * 0.001
      let drawn = 0
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const tw = 0.7 + 0.3 * Math.sin(t * 1.4 + s.twinkle)
        ctx.fillStyle = `hsla(${s.hue},80%,72%,${s.a * tw * Math.min(1, s.z + 0.4)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        drawn++
      }
      setStats({ drawn: drawn })
      ctx.restore()
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('wheel', onWheel as any)
    }
  }, [stars])

  const reset = () => {
    transformRef.current = { scale: 1, tx: 0, ty: 0 }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-polar">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="section-meta"
        >
          <span className="num">01</span>
          <span>STELLAR MAP · 星图</span>
        </motion.div>
        <h2 className="font-display section-title gilt-text mt-3">
          一百<br />千颗<br />星辰
        </h2>
        <p className="font-han section-sub mt-5">
          100,000 颗手绘光点，组成四臂螺旋星系。
          拖拽以平移，滚轮以缩放，悬停以凝视其一。
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="tag-pill">100,000 点</span>
          <span className="tag-pill">mulberry32 种子</span>
          <span className="tag-pill">Canvas 2D</span>
        </div>
        <button
          onClick={reset}
          className="mt-6 btn-capsule"
          data-cursor="hover"
        >
          <span>重置视角</span>
          <span className="arrow" />
        </button>
      </div>

      <div className="pointer-events-none absolute right-6 top-24 md:right-12 md:top-28 z-10 text-right font-mono text-[0.7rem] tracking-widest text-paper/60">
        <div>DRAWN · {stats.drawn.toLocaleString('en')}</div>
        <div className="mt-1 text-paper/40">SCALE · ×{transformRef.current.scale.toFixed(2)}</div>
      </div>

      {hover && (
        <div
          ref={overlayRef}
          className="pointer-events-none absolute z-20 rounded-md bord-gilt-50 bg-ink/85 backdrop-blur px-3 py-2 text-[0.7rem] font-mono"
          style={{
            left: hover.x + 14,
            top: hover.y + 14,
            transform: 'translate(0, 0)',
          }}
        >
          <div className="text-gilt">#{hover.star.id.toString().padStart(6, '0')}</div>
          <div className="text-paper/70 mt-1">
            ARM · {hover.star.arm} · Z · {hover.star.z.toFixed(3)}
          </div>
          <div className="text-paper/50 mt-1">
            GLYPH · {hover.star.glyph}
          </div>
        </div>
      )}
    </div>
  )
}
