import { useEffect, useRef, useState } from 'react'
import { mulberry32 } from '@/lib/random'

const CATEGORIES = [
  { id: 'button', label: 'Button', cn: '按钮' },
  { id: 'card',   label: 'Card',   cn: '卡片' },
  { id: 'switch', label: 'Switch', cn: '开关' },
  { id: 'slider', label: 'Slider', cn: '滑块' },
  { id: 'tag',    label: 'Tag',    cn: '标签' },
  { id: 'progress',label: 'Progress',cn: '进度' },
  { id: 'input',  label: 'Input',  cn: '输入' },
  { id: 'avatar', label: 'Avatar', cn: '头像' },
  { id: 'chart',  label: 'Chart',  cn: '图表' },
  { id: 'glyph',  label: 'Glyph',  cn: '字符' },
] as const

const COUNT_PER = 1000
const COLORS = ['#D4AF37', '#5BC0EB', '#EF476F', '#06D6A0', '#7B2CBF', '#E8E4D8']

export function Specimens() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [filter, setFilter] = useState<string>('all')
  const cacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map())
  const itemsRef = useRef<{ cat: string; i: number; color: string; t: number; v: number; on: boolean; ch: number }[]>([])

  const visible = filter === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === filter)
  const totalShown = visible.length * COUNT_PER

  useEffect(() => {
    const arr: typeof itemsRef.current = []
    for (const c of CATEGORIES) {
      const rng = mulberry32(((c.id.charCodeAt(0) << 16) ^ c.id.charCodeAt(1)) >>> 0)
      for (let i = 0; i < COUNT_PER; i++) {
        arr.push({
          cat: c.id,
          i,
          color: COLORS[Math.floor(rng() * COLORS.length)],
          t: rng(),
          v: Math.floor(rng() * 100),
          on: rng() > 0.5,
          ch: 0x4e00 + Math.floor(rng() * 0x9fa5),
        })
      }
    }
    itemsRef.current = arr
  }, [])

  // Render a single category into an offscreen canvas
  const renderCategory = (cat: typeof CATEGORIES[number]['id']): HTMLCanvasElement => {
    const cached = cacheRef.current.get(cat)
    if (cached) return cached
    const off = document.createElement('canvas')
    const cellW = 56
    const cellH = 64
    const cols = 32
    const rows = Math.ceil(COUNT_PER / cols)
    off.width = cols * cellW + 24
    off.height = rows * cellH + 60
    const ctx = off.getContext('2d')!
    // header
    const c = CATEGORIES.find((c) => c.id === cat)!
    ctx.fillStyle = '#D4AF37'
    ctx.font = '500 11px "JetBrains Mono", monospace'
    ctx.fillText(String(CATEGORIES.findIndex((x) => x.id === cat)).padStart(2, '0'), 24, 18)
    ctx.fillStyle = '#E8E4D8'
    ctx.font = '400 14px "Fraunces", Georgia, serif'
    ctx.fillText(`${c.cn} · ${c.label}`, 48, 18)
    ctx.fillStyle = 'rgba(232,228,216,0.4)'
    ctx.font = '500 9px "JetBrains Mono", monospace'
    ctx.fillText(`${COUNT_PER} PCS`, 200, 18)
    ctx.strokeStyle = 'rgba(212,175,55,0.4)'
    ctx.beginPath(); ctx.moveTo(280, 14); ctx.lineTo(off.width - 24, 14); ctx.stroke()
    // items
    for (let i = 0; i < COUNT_PER; i++) {
      const r = Math.floor(i / cols)
      const col = i % cols
      const x = 24 + col * cellW
      const y = 36 + r * cellH
      const it = itemsRef.current.find((it) => it.cat === cat && it.i === i)
      if (!it) continue
      ctx.fillStyle = 'rgba(232,228,216,0.04)'
      ctx.fillRect(x, y, cellW - 4, cellH - 6)
      ctx.strokeStyle = 'rgba(232,228,216,0.15)'
      ctx.strokeRect(x + 0.5, y + 0.5, cellW - 5, cellH - 7)
      drawSpecimen(ctx, cat, x, y, cellW - 4, cellH - 6, it)
    }
    cacheRef.current.set(cat, off)
    return off
  }

  const drawSpecimen = (ctx: CanvasRenderingContext2D, cat: string, x: number, y: number, w: number, h: number, it: any) => {
    ctx.save()
    const cx = x + w / 2
    const cy = y + h / 2
    switch (cat) {
      case 'button': {
        const bw = 32, bh = 12
        ctx.fillStyle = it.on ? it.color : 'transparent'
        ctx.fillRect(cx - bw / 2, cy - bh / 2, bw, bh)
        ctx.strokeStyle = it.color
        ctx.strokeRect(cx - bw / 2 + 0.5, cy - bh / 2 + 0.5, bw - 1, bh - 1)
        ctx.fillStyle = it.on ? '#0A0B12' : it.color
        ctx.font = '500 7px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('BTN', cx, cy)
        break
      }
      case 'card': {
        ctx.fillStyle = `${it.color}66`
        ctx.fillRect(x + 4, y + 6, w - 8, 4)
        ctx.fillStyle = 'rgba(232,228,216,0.3)'
        ctx.fillRect(x + 4, y + 14, w - 10, 2)
        ctx.fillRect(x + 4, y + 18, (w - 8) * 0.6, 2)
        ctx.fillStyle = it.color
        ctx.fillRect(x + 4, y + h - 12, w - 8, 6)
        break
      }
      case 'switch': {
        const sw = 26, sh = 12
        ctx.fillStyle = it.on ? it.color : 'rgba(232,228,216,0.15)'
        ctx.beginPath()
        ;(ctx as any).roundRect?.(cx - sw / 2, cy - sh / 2, sw, sh, 6)
        ctx.fill()
        ctx.fillStyle = '#E8E4D8'
        ctx.beginPath()
        ctx.arc(it.on ? cx + sw / 2 - 4 : cx - sw / 2 + 4, cy, 3, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'slider': {
        const sx = x + 6
        const sw = w - 12
        ctx.fillStyle = 'rgba(232,228,216,0.15)'
        ctx.fillRect(sx, y + h * 0.35, sw, 2)
        ctx.fillRect(sx, y + h * 0.65, sw, 2)
        ctx.fillStyle = it.color
        ctx.fillRect(sx, y + h * 0.35, sw * it.t, 2)
        ctx.fillRect(sx, y + h * 0.65, sw * (it.v / 100), 2)
        ctx.beginPath()
        ctx.arc(sx + sw * it.t, y + h * 0.35 + 1, 3, 0, Math.PI * 2)
        ctx.arc(sx + sw * (it.v / 100), y + h * 0.65 + 1, 3, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'tag': {
        ctx.font = '500 7px "JetBrains Mono", monospace'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = it.color
        ctx.fillText('TAG', cx - 14, cy)
        ctx.strokeStyle = `${it.color}55`
        ctx.strokeRect(cx - 20, cy - 5, 24, 10)
        ctx.fillStyle = 'rgba(232,228,216,0.5)'
        ctx.fillText('α', cx + 14, cy)
        break
      }
      case 'progress': {
        for (let k = 0; k < 3; k++) {
          const yy = y + 12 + k * 10
          const w2 = (20 + ((it.i + k * 7) % 80)) / 100 * (w - 8)
          ctx.fillStyle = 'rgba(232,228,216,0.12)'
          ctx.fillRect(x + 4, yy, w - 8, 3)
          ctx.fillStyle = COLORS[(k + it.i) % COLORS.length]
          ctx.fillRect(x + 4, yy, w2, 3)
        }
        break
      }
      case 'input': {
        ctx.strokeStyle = 'rgba(232,228,216,0.2)'
        ctx.fillStyle = 'rgba(232,228,216,0.05)'
        ctx.fillRect(x + 4, y + 8, w - 8, 12)
        ctx.strokeRect(x + 4.5, y + 8.5, w - 9, 11)
        ctx.fillRect(x + 4, y + 24, w - 8, 12)
        ctx.strokeRect(x + 4.5, y + 24.5, w - 9, 11)
        ctx.fillStyle = 'rgba(232,228,216,0.5)'
        ctx.font = '500 7px "JetBrains Mono", monospace'
        ctx.textBaseline = 'middle'
        ctx.fillText(`input_${it.i}`, x + 8, y + 14)
        ctx.fillStyle = 'rgba(232,228,216,0.3)'
        ctx.fillText('✶', x + 8, y + 30)
        break
      }
      case 'avatar': {
        ctx.fillStyle = it.color
        ctx.beginPath()
        ctx.arc(cx, cy, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#0A0B12'
        ctx.font = '600 9px "Fraunces", serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String.fromCharCode(65 + (it.i % 26)), cx, cy + 1)
        break
      }
      case 'chart': {
        const bars = 8
        const bw = (w - 8) / bars - 1
        for (let k = 0; k < bars; k++) {
          const h2 = 8 + ((it.i + k * 13) % 80) / 100 * (h - 16)
          ctx.fillStyle = k % 2 ? it.color : 'rgba(232,228,216,0.25)'
          ctx.fillRect(x + 4 + k * (bw + 1), y + h - 8 - h2, bw, h2)
        }
        break
      }
      case 'glyph': {
        ctx.fillStyle = it.color
        ctx.font = '400 18px "Noto Serif SC", serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String.fromCharCode(it.ch), cx, cy)
        break
      }
    }
    ctx.restore()
  }

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

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      let y = 0
      for (const c of visible) {
        const img = renderCategory(c.id)
        // tile the offscreen canvas into the visible area
        const imgH = (img.height / img.width) * w
        ctx.drawImage(img, 0, y, w, imgH)
        y += imgH + 8
        if (y > h + 200) break
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [visible])

  return (
    <div className="relative h-full w-full overflow-hidden bg-mist">
      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-xl">
        <div className="section-meta">
          <span className="num">05</span>
          <span>SPECIMENS · 样本柜</span>
        </div>
        <h2 className="font-display section-title mt-3">
          一万枚<br />UI<br />切片
        </h2>
        <p className="font-han section-sub mt-5">
          10,000 个微缩 UI 组件按 10 大类陈列。
          点击下方分类标签即时过滤。
        </p>
      </div>

      <div className="absolute right-6 md:right-12 top-24 md:top-28 z-10 flex flex-wrap justify-end gap-2 max-w-xl">
        <button
          onClick={() => setFilter('all')}
          className={`tag-pill ${filter === 'all' ? 'bord-gilt-50 text-gilt' : ''}`}
          data-cursor="hover"
        >
          全部
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`tag-pill ${filter === c.id ? 'bord-gilt-50 text-gilt' : ''}`}
            data-cursor="hover"
          >
            {c.cn} · {c.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute left-0 right-0 top-48 bottom-12 mx-0 w-full"
        style={{ height: 'calc(100% - 11rem)' }}
      />

      <div className="pointer-events-none absolute left-6 bottom-6 md:left-12 z-10 font-mono text-[0.7rem] tracking-widest text-paper/60">
        <div>SHOWN · {totalShown.toLocaleString('en')}</div>
        <div className="text-paper/40 mt-1">FILTER · {filter.toUpperCase()}</div>
      </div>
    </div>
  )
}
