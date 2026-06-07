import { useEffect, useRef, useState } from 'react'
import { Camera, RotateCcw } from 'lucide-react'

const EFFECTS = [
  { id: 'offset',  label: '位移错位',  cn: '位移' },
  { id: 'noise',   label: '胶片噪点',  cn: '噪点' },
  { id: 'rgb',     label: 'RGB 通道',  cn: '色散' },
  { id: 'pixel',   label: '像素化',    cn: '像素' },
  { id: 'emboss',  label: '浮雕',      cn: '浮雕' },
  { id: 'invert',  label: '反相',      cn: '反相' },
  { id: 'mirror',  label: '镜像',      cn: '镜像' },
  { id: 'blur',    label: '模糊',      cn: '模糊' },
  { id: 'poster',  label: '色调分离',  cn: '色调' },
] as const

const PARTICLES = 1024

interface Particle { x: number; y: number; vx: number; vy: number; c: string; r: number }

export function Sandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState<Set<string>>(new Set(['noise']))
  const [intensity, setIntensity] = useState(50)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, down: false })

  useEffect(() => {
    const rng = (() => {
      let s = 0xDEADBEEF
      return () => {
        s = (s * 1664525 + 1013904223) >>> 0
        return s / 0xFFFFFFFF
      }
    })()
    const colors = ['#D4AF37', '#5BC0EB', '#EF476F', '#06D6A0', '#7B2CBF', '#E8E4D8']
    const arr: Particle[] = []
    for (let i = 0; i < PARTICLES; i++) {
      arr.push({
        x: rng(),
        y: rng(),
        vx: (rng() - 0.5) * 0.0008,
        vy: (rng() - 0.5) * 0.0008,
        c: colors[Math.floor(rng() * colors.length)],
        r: 1 + rng() * 3,
      })
    }
    particlesRef.current = arr
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

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - r.left
      mouseRef.current.y = e.clientY - r.top
    }
    const onDown = () => { mouseRef.current.down = true }
    const onUp = () => { mouseRef.current.down = false }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // bg
      ctx.fillStyle = '#0A0B12'
      ctx.fillRect(0, 0, w, h)
      // particles
      const ps = particlesRef.current
      for (const p of ps) {
        // attract to mouse
        const dx = mouseRef.current.x - p.x * w
        const dy = mouseRef.current.y - p.y * h
        const d = Math.hypot(dx, dy) + 1
        if (mouseRef.current.down) {
          p.vx -= (dx / d) * 0.0003
          p.vy -= (dy / d) * 0.0003
        } else {
          p.vx += (dx / d) * 0.00004
          p.vy += (dy / d) * 0.00004
        }
        // drag
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = 1
        if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1
        if (p.y > 1) p.y = 0
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      // connection lines
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < Math.min(i + 12, ps.length); j++) {
          const a = ps[i], b = ps[j]
          const dx = a.x * w - b.x * w
          const dy = a.y * h - b.y * h
          const d = Math.hypot(dx, dy)
          if (d < 60) {
            ctx.strokeStyle = `rgba(212,175,55,${(1 - d / 60) * 0.3})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(a.x * w, a.y * h)
            ctx.lineTo(b.x * w, b.y * h)
            ctx.stroke()
          }
        }
      }

      // apply effects via second buffer
      const intensityK = intensity / 50
      if (active.size > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        if (active.has('offset')) {
          const k = Math.floor(intensityK * 4)
          // simple channel shift
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4
              if (x + k < canvas.width) {
                const j = (y * canvas.width + x + k) * 4
                const r = data[i]
                data[i] = data[j]
              }
            }
          }
        }
        if (active.has('noise')) {
          for (let i = 0; i < data.length; i += 4) {
            const n = (Math.random() - 0.5) * 60 * intensityK
            data[i] = Math.max(0, Math.min(255, data[i] + n))
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n))
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n))
          }
        }
        if (active.has('rgb')) {
          const k = Math.floor(intensityK * 6)
          const copy = new Uint8ClampedArray(data)
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4
              if (x + k < canvas.width) {
                const j = (y * canvas.width + x + k) * 4
                data[i] = copy[j]
              }
              if (x - k > 0) {
                const j = (y * canvas.width + x - k) * 4
                data[i + 2] = copy[j + 2]
              }
            }
          }
        }
        if (active.has('invert')) {
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]
            data[i + 1] = 255 - data[i + 1]
            data[i + 2] = 255 - data[i + 2]
          }
        }
        if (active.has('poster')) {
          const levels = Math.max(2, Math.floor(8 - intensityK * 4))
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.floor(data[i] / (256 / levels)) * (256 / levels)
            data[i + 1] = Math.floor(data[i + 1] / (256 / levels)) * (256 / levels)
            data[i + 2] = Math.floor(data[i + 2] / (256 / levels)) * (256 / levels)
          }
        }
        if (active.has('pixel')) {
          const k = Math.max(1, Math.floor(intensityK * 6))
          for (let y = 0; y < canvas.height; y += k) {
            for (let x = 0; x < canvas.width; x += k) {
              const i = (y * canvas.width + x) * 4
              const r = data[i], g = data[i + 1], b = data[i + 2]
              for (let yy = 0; yy < k && y + yy < canvas.height; yy++) {
                for (let xx = 0; xx < k && x + xx < canvas.width; xx++) {
                  const j = ((y + yy) * canvas.width + (x + xx)) * 4
                  data[j] = r; data[j + 1] = g; data[j + 2] = b
                }
              }
            }
          }
        }
        if (active.has('mirror')) {
          const half = canvas.width / 2
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < half; x++) {
              const i = (y * canvas.width + x) * 4
              const j = (y * canvas.width + (canvas.width - 1 - x)) * 4
              if (intensityK > 0.5) {
                const tr = data[i]; data[i] = data[j]; data[j] = tr
                const tg = data[i + 1]; data[i + 1] = data[j + 1]; data[j + 1] = tg
                const tb = data[i + 2]; data[i + 2] = data[j + 2]; data[j + 2] = tb
              }
            }
          }
        }
        if (active.has('emboss')) {
          const copy = new Uint8ClampedArray(data)
          for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
              const i = (y * canvas.width + x) * 4
              const j = ((y - 1) * canvas.width + (x - 1)) * 4
              data[i] = Math.max(0, Math.min(255, 128 + (copy[i] - copy[j])))
              data[i + 1] = Math.max(0, Math.min(255, 128 + (copy[i + 1] - copy[j + 1])))
              data[i + 2] = Math.max(0, Math.min(255, 128 + (copy[i + 2] - copy[j + 2])))
            }
          }
        }
        if (active.has('blur')) {
          const copy = new Uint8ClampedArray(data)
          const k = Math.max(1, Math.floor(intensityK * 2))
          for (let y = k; y < canvas.height - k; y++) {
            for (let x = k; x < canvas.width - k; x++) {
              let r = 0, g = 0, b = 0, n = 0
              for (let yy = -k; yy <= k; yy += k) {
                for (let xx = -k; xx <= k; xx += k) {
                  const j = ((y + yy) * canvas.width + (x + xx)) * 4
                  r += copy[j]; g += copy[j + 1]; b += copy[j + 2]
                  n++
                }
              }
              const i = (y * canvas.width + x) * 4
              data[i] = r / n; data[i + 1] = g / n; data[i + 2] = b / n
            }
          }
        }
        ctx.putImageData(imageData, 0, 0)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [active, intensity])

  const toggle = (id: string) => {
    setActive((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const capture = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `stellaris-sandbox-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-flame">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <div className="section-meta">
          <span className="num">09</span>
          <span>SANDBOX · 沙盘</span>
        </div>
        <h2 className="font-display section-title mt-3">
          <span style={{ color: '#EF476F' }}>九重</span><br />画室
        </h2>
        <p className="font-han section-sub mt-5">
          1,024 颗粒子在引力场中漂浮。
          自由叠加 9 种视觉效果，按下鼠标吸引粒子。
        </p>
      </div>

      <div className="absolute right-6 md:right-12 top-24 md:top-28 z-10 max-w-sm">
        <div className="flex flex-wrap gap-2 justify-end">
          {EFFECTS.map((e) => (
            <button
              key={e.id}
              onClick={() => toggle(e.id)}
              className={`tag-pill ${active.has(e.id) ? 'bord-gilt-50 text-gilt' : ''}`}
              data-cursor="hover"
            >
              {e.cn}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 justify-end">
          <span className="font-mono text-[0.6rem] tracking-widest text-paper/50">强度</span>
          <input
            type="range"
            min={0}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-40 accent-[#D4AF37]"
            data-cursor="hover"
          />
          <span className="font-mono text-[0.65rem] tracking-widest text-gilt w-8 text-right">{intensity}</span>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={capture} className="btn-capsule" data-cursor="hover">
            <Camera className="h-3 w-3" />
            <span>抓拍</span>
          </button>
          <button onClick={() => setActive(new Set())} className="btn-capsule" data-cursor="hover">
            <RotateCcw className="h-3 w-3" />
            <span>清空</span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 bottom-6 md:right-12 z-10 font-mono text-[0.7rem] tracking-widest text-paper/60 text-right">
        <div>PARTICLES · 1,024</div>
        <div className="text-paper/40 mt-1">EFFECTS · {active.size}/9</div>
      </div>
    </div>
  )
}
