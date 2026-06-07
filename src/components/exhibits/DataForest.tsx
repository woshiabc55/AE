import { useEffect, useRef, useState } from 'react'

const COLS = 64
const ROWS = 50
const TOTAL = COLS * ROWS // 3200

const DATASETS = [
  { id: 'gdp',   label: 'GDP',   cn: '国民生产总值', values: gen(0xA1) },
  { id: 'heart', label: 'BPM',   cn: '心率',         values: gen(0xB2) },
  { id: 'price', label: 'PRICE', cn: '股价',         values: gen(0xC3) },
  { id: 'steps', label: 'STEPS', cn: '步数',         values: gen(0xD4) },
  { id: 'co2',   label: 'CO₂',   cn: '碳排放',       values: gen(0xE5) },
  { id: 'rain',  label: 'RAIN',  cn: '降雨量',       values: gen(0xF6) },
  { id: 'sleep', label: 'SLEEP', cn: '睡眠',         values: gen(0x07) },
  { id: 'pop',   label: 'POP',   cn: '人口',         values: gen(0x18) },
]

function gen(seed: number): number[] {
  let s = seed
  const arr: number[] = []
  for (let i = 0; i < TOTAL; i++) {
    s = (s * 1664525 + 1013904223) >>> 0
    arr.push((s % 1000) / 1000)
  }
  return arr
}

export function DataForest() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [datasetId, setDatasetId] = useState(DATASETS[0].id)
  const [hover, setHover] = useState<{ i: number; v: number } | null>(null)
  const ds = DATASETS.find((d) => d.id === datasetId)!

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

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      const cw = (w - 80) / COLS
      const ch = (h - 60) / ROWS
      const col = Math.floor((mx - 40) / cw)
      const row = Math.floor((my - 40) / ch)
      if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
        const i = row * COLS + col
        setHover({ i, v: ds.values[i] })
      } else {
        setHover(null)
      }
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', () => setHover(null))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // ground
      const grad = ctx.createLinearGradient(0, h * 0.4, 0, h)
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(1, 'rgba(0,0,0,0.6)')
      ctx.fillStyle = grad
      ctx.fillRect(0, h * 0.4, w, h * 0.6)
      // grid
      const cw = (w - 80) / COLS
      const ch = (h - 60) / ROWS
      const t = performance.now() * 0.001
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = r * COLS + c
          const v = ds.values[i]
          const x = 40 + c * cw + cw / 2
          const yBase = 40 + r * ch
          // distance to center (camera perspective)
          const distR = r / ROWS
          const persp = 0.4 + distR * 0.6
          const trunkH = (10 + v * 90) * persp
          // sway
          const sway = Math.sin(t * 0.6 + c * 0.4 + r * 0.2) * (1.5 + v * 4)
          // trunk
          ctx.strokeStyle = `rgba(${212 - v * 40}, ${175 - v * 30}, ${55 - v * 20}, ${0.55 + v * 0.4})`
          ctx.lineWidth = 0.8 + v * 1.2
          ctx.beginPath()
          ctx.moveTo(x, yBase)
          ctx.lineTo(x + sway, yBase - trunkH)
          ctx.stroke()
          // canopy
          const cR = (1.5 + v * 4) * persp
          const canopy = ctx.createRadialGradient(x + sway, yBase - trunkH, 0, x + sway, yBase - trunkH, cR)
          canopy.addColorStop(0, `hsla(${50 + v * 30},80%,${60 + v * 20}%,0.85)`)
          canopy.addColorStop(0.5, `hsla(${50 + v * 30},70%,${50 + v * 15}%,0.4)`)
          canopy.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = canopy
          ctx.beginPath()
          ctx.arc(x + sway, yBase - trunkH, cR, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [ds])

  return (
    <div className="relative h-full w-full overflow-hidden bg-mist">
      <div className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.15), transparent 60%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <div className="section-meta">
          <span className="num">08</span>
          <span>DATA FOREST · 数据林</span>
        </div>
        <h2 className="font-display section-title mt-3 gilt-text">
          三千<br />数据<br />树
        </h2>
        <p className="font-han section-sub mt-5">
          3,200 棵由数据长成的树。高度 = 数值，颜色 = 类别。
          切换顶部数据源，看整片森林换上新的形状。
        </p>
        <div className="mt-6 flex flex-wrap gap-2 max-w-md">
          {DATASETS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDatasetId(d.id)}
              className={`tag-pill ${datasetId === d.id ? 'bord-gilt-50 text-gilt' : ''}`}
              data-cursor="hover"
            >
              {d.cn}
            </button>
          ))}
        </div>
      </div>

      {hover && (
        <div className="pointer-events-none absolute right-6 bottom-6 md:right-12 md:bottom-12 z-10 font-mono text-[0.7rem] tracking-widest text-paper/80 text-right">
          <div className="text-gilt">TREE · #{hover.i.toString().padStart(4, '0')}</div>
          <div className="mt-1">{ds.label} · {(hover.v * 1000).toFixed(1)}</div>
        </div>
      )}

      <div className="pointer-events-none absolute right-6 top-24 md:right-12 md:top-28 z-10 text-right font-mono text-[0.7rem] tracking-widest text-paper/60">
        <div>TREES · 3,200</div>
        <div className="text-paper/40 mt-1">DATA · {ds.label}</div>
      </div>
    </div>
  )
}
