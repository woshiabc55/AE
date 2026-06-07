import { useEffect, useRef, useState } from 'react'

const PATTERNS = [
  { id: 'noise',   label: '噪点' },
  { id: 'grid',    label: '网格' },
  { id: 'spiral',  label: '螺旋' },
  { id: 'lines',   label: '折线' },
  { id: 'pixels',  label: '像素' },
  { id: 'glyphs',  label: '文字' },
] as const

const TILES = 360

export function Chroma() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pattern, setPattern] = useState<typeof PATTERNS[number]['id']>('noise')
  const [scratch, setScratch] = useState(0)
  const progressRef = useRef(0)
  const dragging = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let w = 0, h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)

    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      dragging.current = { x: e.clientX - r.left, y: e.clientY - r.top }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const dx = x - dragging.current.x
      const dy = y - dragging.current.y
      const d = Math.hypot(dx, dy)
      progressRef.current = Math.min(1, progressRef.current + d / 1500)
      setScratch(progressRef.current)
      dragging.current = { x, y }
    }
    const onUp = () => { dragging.current = null }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // base: 360 ring color wheel
      const cx = w / 2
      const cy = h / 2
      const r0 = Math.min(w, h) * 0.18
      const r1 = Math.min(w, h) * 0.46
      const segs = TILES
      for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * Math.PI * 2
        const a1 = ((i + 1) / segs) * Math.PI * 2
        const hue = (i / segs) * 360
        ctx.fillStyle = `hsl(${hue},70%,55%)`
        ctx.beginPath()
        ctx.arc(cx, cy, r1, a0, a1)
        ctx.arc(cx, cy, r0, a1, a0, true)
        ctx.closePath()
        ctx.fill()
      }

      // overlay pattern revealed by scratch progress
      const reveal = progressRef.current
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, w, h)
      ctx.arc(cx, cy, r0 - 6, 0, Math.PI * 2, true)
      ctx.clip('evenodd')

      // gradient for reveal
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1)
      grad.addColorStop(0, `rgba(10,11,18,${0.95 * reveal})`)
      grad.addColorStop(0.5, `rgba(10,11,18,${0.7 * reveal})`)
      grad.addColorStop(1, `rgba(10,11,18,${0.2 * reveal})`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // pattern lines
      if (reveal > 0) {
        ctx.globalAlpha = reveal
        drawPattern(ctx, pattern, w, h)
      }
      ctx.restore()

      // outer ring with caret
      ctx.strokeStyle = 'rgba(212,175,55,0.4)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(cx, cy, r1, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(cx, cy, r0, 0, Math.PI * 2); ctx.stroke()

      // center
      ctx.fillStyle = 'rgba(10,11,18,0.85)'
      ctx.beginPath(); ctx.arc(cx, cy, r0 - 6, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(232,228,216,0.85)'
      ctx.font = '500 11px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${(reveal * 100).toFixed(0)}%`, cx, cy - 8)
      ctx.font = '400 9px "JetBrains Mono", monospace'
      ctx.fillStyle = 'rgba(212,175,55,0.9)'
      ctx.fillText(pattern.toUpperCase(), cx, cy + 8)

      raf = requestAnimationFrame(draw)
    }

    const drawPattern = (ctx: CanvasRenderingContext2D, p: string, w: number, h: number) => {
      switch (p) {
        case 'noise': {
          const id = ctx.getImageData(0, 0, w, h)
          const d = id.data
          for (let i = 0; i < d.length; i += 4) {
            const n = (Math.random() - 0.5) * 80
            d[i] = Math.max(0, Math.min(255, d[i] + n))
            d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n))
            d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n))
          }
          ctx.putImageData(id, 0, 0)
          break
        }
        case 'grid': {
          ctx.strokeStyle = 'rgba(232,228,216,0.18)'
          ctx.lineWidth = 1
          for (let x = 0; x < w; x += 24) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
          }
          for (let y = 0; y < h; y += 24) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
          }
          break
        }
        case 'spiral': {
          ctx.strokeStyle = 'rgba(212,175,55,0.5)'
          ctx.lineWidth = 1
          ctx.beginPath()
          for (let t = 0; t < 200; t++) {
            const a = t * 0.3
            const r = t * 1.5
            const x = w / 2 + Math.cos(a) * r
            const y = h / 2 + Math.sin(a) * r
            if (t === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
          break
        }
        case 'lines': {
          ctx.strokeStyle = 'rgba(232,228,216,0.4)'
          ctx.lineWidth = 1
          for (let i = 0; i < 60; i++) {
            const y = (i / 60) * h + Math.sin(i * 0.4) * 20
            ctx.beginPath()
            ctx.moveTo(0, y)
            for (let x = 0; x < w; x += 10) {
              ctx.lineTo(x, y + Math.sin((x + i * 8) * 0.04) * 18)
            }
            ctx.stroke()
          }
          break
        }
        case 'pixels': {
          for (let i = 0; i < 800; i++) {
            ctx.fillStyle = `hsla(${(i * 7) % 360},60%,55%,0.6)`
            ctx.fillRect(Math.random() * w, Math.random() * h, 6, 6)
          }
          break
        }
        case 'glyphs': {
          ctx.fillStyle = 'rgba(232,228,216,0.7)'
          ctx.font = '500 14px "Noto Serif SC", serif'
          for (let i = 0; i < 200; i++) {
            const x = (i % 20) * 60 + 20
            const y = Math.floor(i / 20) * 60 + 30
            ctx.fillText(String.fromCharCode(0x4e00 + (i * 13) % 800), x, y)
          }
          break
        }
      }
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [pattern])

  const reset = () => {
    progressRef.current = 0
    setScratch(0)
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-aurora">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <div className="section-meta">
          <span className="num">07</span>
          <span>CHROMA · 色谱</span>
        </div>
        <h2 className="font-display section-title mt-3 gilt-text">
          刮出<br />色下<br />图案
        </h2>
        <p className="font-han section-sub mt-5">
          360° 环形色板覆盖着一层秘密图案。
          在中心区域按住鼠标拖拽以"刮"出底层。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPattern(p.id)}
              className={`tag-pill ${pattern === p.id ? 'bord-gilt-50 text-gilt' : ''}`}
              data-cursor="hover"
            >
              {p.label}
            </button>
          ))}
        </div>
        <button onClick={reset} className="mt-6 btn-capsule" data-cursor="hover">
          <span>复位</span>
          <span className="arrow" />
        </button>
      </div>

      <div className="pointer-events-none absolute right-6 top-24 md:right-12 md:top-28 z-10 text-right font-mono text-[0.7rem] tracking-widest text-paper/60">
        <div>REVEAL · {(scratch * 100).toFixed(0)}%</div>
        <div className="text-paper/40 mt-1">PATTERN · {pattern.toUpperCase()}</div>
      </div>
    </div>
  )
}
