import { useCallback, useEffect, useRef } from 'react'

export function useCanvasAnimation(
  draw: (ctx: CanvasRenderingContext2D, time: number, delta: number) => void,
  active = true
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const drawRef = useRef(draw)

  drawRef.current = draw

  const animate = useCallback(
    (time: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0.016
      lastTimeRef.current = time

      drawRef.current(ctx, time / 1000, Math.min(delta, 0.1))

      animFrameRef.current = requestAnimationFrame(animate)
    },
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    if (active) {
      lastTimeRef.current = 0
      animFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [active, animate])

  return canvasRef
}
