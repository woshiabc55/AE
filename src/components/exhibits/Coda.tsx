import { useEffect, useRef, useState } from 'react'
import { useStellaris } from '@/store/useStellaris'

const N = 1000

export function Coda() {
  const setActive = useStellaris((s) => s.setActive)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 1000), 50)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)
    // pre-generate star field
    const rng = (() => {
      let s = 0xC0DEFACE
      return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xFFFFFFFF }
    })()
    const stars = Array.from({ length: N }).map(() => ({
      x: rng() * w,
      y: rng() * h,
      r: 0.6 + rng() * 2.2,
      phase: rng() * Math.PI * 2,
      speed: 0.6 + rng() * 1.4,
      hue: rng() < 0.7 ? 38 + rng() * 24 : rng() < 0.5 ? 200 : 320,
    }))

    const draw = () => {
      const t = performance.now() * 0.001
      ctx.clearRect(0, 0, w, h)
      // soft global breath
      const breath = 0.5 + 0.5 * Math.sin(t * 0.5)
      // halo
      const grad = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.min(w, h) * 0.4)
      grad.addColorStop(0, `rgba(212,175,55,${0.06 + breath * 0.06})`)
      grad.addColorStop(1, 'rgba(212,175,55,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      for (const s of stars) {
        const k = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase)
        const alpha = 0.15 + k * 0.85
        const r = s.r * (0.7 + k * 0.6)
        ctx.fillStyle = `hsla(${s.hue}, 70%, ${60 + k * 30}%, ${alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
        ctx.fill()
        if (k > 0.6) {
          ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${(k - 0.6) * 0.5})`
          ctx.beginPath()
          ctx.arc(s.x, s.y, r * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-polar">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="section-meta">
          <span className="num">11</span>
          <span>CODA · 尾声</span>
        </div>
        <h2 className="font-display section-title mt-4 gilt-text" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
          落幕
        </h2>
        <p className="font-han section-sub mt-6 text-paper-70">
          一千个呼吸光点，
          <br />
          为你而明灭。
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={() => setActive('overture')}
            className="btn-capsule"
            data-cursor="hover"
          >
            <span>回到序厅</span>
            <span className="arrow" />
          </button>
          <span className="font-mono text-[0.6rem] tracking-[0.3em] text-paper/40 mt-3">
            按 R 重新开始
          </span>
        </div>
        <div className="mt-16 flex flex-col items-center gap-2">
          <div className="gilt-line w-40" />
          <p className="font-mono text-[0.6rem] tracking-[0.3em] text-paper/40 mt-2">
            STELLARIS · 100,000+ UI ELEMENTS
          </p>
          <p className="font-han text-sm text-paper/40">
            万象天文台 · 一个独立的艺术网站
          </p>
          <p className="font-mono text-[0.55rem] tracking-[0.3em] text-paper/30 mt-2">
            BUILD · VITE + REACT + THREE
          </p>
        </div>
      </div>
    </div>
  )
}
