import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

export function CountUp({ value, duration = 1200, format, className }: CountUpProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const from = 0
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(from + (value - from) * eased))
            if (t < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {format ? format(display) : display.toLocaleString()}
    </span>
  )
}
