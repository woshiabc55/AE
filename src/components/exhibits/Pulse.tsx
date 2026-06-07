import { useEffect, useRef, useState } from 'react'
import { audio } from '@/lib/audio'
import { Mic, MicOff, Waves } from 'lucide-react'

const RINGS = 12
const PER_RING = 80

export function Pulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [micOn, setMicOn] = useState(false)
  const [permission, setPermission] = useState<'idle' | 'denied' | 'ok'>('idle')

  useEffect(() => {
    audio.startAmbient()
  }, [])

  useEffect(() => {
    audio.setMuted(micOn === false && false) // ambient still audible
  }, [micOn])

  const toggleMic = async () => {
    if (micOn) {
      audio.stopMic()
      setMicOn(false)
      return
    }
    const ok = await audio.startMic()
    if (ok) {
      setMicOn(true)
      setPermission('ok')
    } else {
      setPermission('denied')
    }
  }

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

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const bands = audio.bands12()
      // 12 concentric rings, each with 80 tick marks
      for (let r = 0; r < RINGS; r++) {
        const energy = bands[r] ?? 0
        const radius = 90 + r * 30
        const ticks = PER_RING
        for (let i = 0; i < ticks; i++) {
          const a = (i / ticks) * Math.PI * 2
          // amplitude is function of ring + tick
          const amp = 6 + energy * 60 * (1 - r / RINGS) * 0.5
          const x1 = Math.cos(a) * radius
          const y1 = Math.sin(a) * radius
          const x2 = Math.cos(a) * (radius + amp)
          const y2 = Math.sin(a) * (radius + amp)
          ctx.strokeStyle = `hsla(${20 + r * 6}, 80%, ${55 + energy * 30}%, ${0.35 + energy * 0.4})`
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(w / 2 + x1, h / 2 + y1)
          ctx.lineTo(w / 2 + x2, h / 2 + y2)
          ctx.stroke()
        }
      }
      // central core
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 90)
      grad.addColorStop(0, `rgba(239,71,111,${0.45 + (bands[0] ?? 0) * 0.4})`)
      grad.addColorStop(1, 'rgba(239,71,111,0)')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(w / 2, h / 2, 90, 0, Math.PI * 2); ctx.fill()
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-flame">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute left-6 top-24 md:left-12 md:top-28 z-10 max-w-md">
        <div className="section-meta">
          <span className="num">04</span>
          <span>PULSE · 脉搏</span>
        </div>
        <h2 className="font-display section-title mt-3">
          <span style={{ color: '#EF476F' }}>十二</span><br />同心<br />音律
        </h2>
        <p className="font-han section-sub mt-5">
          12 圈 × 80 段 = 960 道音频脉冲。
          点击下方按钮授权麦克风，环境音将重塑整片波形。
        </p>
        <div className="mt-6 flex flex-wrap gap-2 items-center">
          <button
            onClick={toggleMic}
            className={`btn-capsule ${micOn ? 'bord-gilt-50 text-gilt' : ''}`}
            data-cursor="hover"
          >
            {micOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
            <span>{micOn ? '关闭麦克风' : '启用麦克风'}</span>
          </button>
          <span className="tag-pill">
            {permission === 'denied' ? '未授权 · 使用内置低频' : micOn ? 'LIVE · 环境音' : 'AMBIENT · 内置低频'}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 top-24 md:right-12 md:top-28 z-10 text-right font-mono text-[0.7rem] tracking-widest text-paper/60">
        <div>SEGMENTS · 960</div>
        <div className="text-paper/40 mt-1">FFT · 2048</div>
        <div className="text-paper/40 mt-1">SOURCE · {micOn ? 'MIC' : 'OSC'}</div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-paper-50 font-mono text-[0.6rem] tracking-widest">
        <Waves className="h-3 w-3" /> WEB AUDIO API · ANALYSER NODE
      </div>
    </div>
  )
}
