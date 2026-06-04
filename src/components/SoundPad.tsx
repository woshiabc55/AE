import { useEffect, useRef, useState } from 'react'

/** 模拟唢呐/鼓点音效的 UI（无外部音频，纯 Web Audio 合成） */
export const SoundPad = () => {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      ctxRef.current?.close()
    }
  }, [])

  const beep = (freq: number, dur: number, type: OscillatorType = 'sawtooth', vol = 0.05) => {
    if (!ctxRef.current) return
    const ctx = ctxRef.current
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + dur)
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
    osc.connect(g).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  }

  const toggle = () => {
    if (!on) {
      if (!ctxRef.current) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext
        ctxRef.current = new Ctx()
      }
      const tick = () => {
        // 唢呐：520 / 640 交替
        const f = Math.random() > 0.5 ? 520 : 640
        beep(f, 0.6, 'sawtooth', 0.05)
        // 鼓点
        beep(60 + Math.random() * 30, 0.18, 'sine', 0.12)
        timerRef.current = window.setTimeout(tick, 1500)
      }
      tick()
    } else {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
    setOn((o) => !o)
  }

  return (
    <button
      onClick={toggle}
      title={on ? '关闭唢呐' : '开启唢呐'}
      className="fixed bottom-6 left-6 z-30 w-12 h-12 grid place-items-center bg-ink-900/80 border border-gold-700/30 text-gold-500 hover:text-silk-100 hover:border-gold-500 transition"
    >
      <span className="font-seal text-[10px] tracking-widest">{on ? '唢' : '音'}</span>
    </button>
  )
}
