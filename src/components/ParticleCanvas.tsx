import { useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import {
  updateParticles,
  renderParticles,
  renderConnections,
  createParticlesFromEntry,
  createParticlesFromCode,
} from '@/utils/particleEngine'
import type { Particle } from '@/types'

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)
  const prevCodeRef = useRef<string>('')
  const containerRef = useRef<HTMLDivElement>(null)

  const { scriptCode, entries, emitEntryParticles, emitCodeDiff } = useAppStore()

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
  }, [])

  useEffect(() => {
    resizeCanvas()
    const observer = new ResizeObserver(resizeCanvas)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [resizeCanvas])

  useEffect(() => {
    if (emitCodeDiff && scriptCode !== prevCodeRef.current) {
      const canvas = canvasRef.current
      if (canvas) {
        const newParticles = createParticlesFromCode(
          scriptCode,
          prevCodeRef.current,
          canvas.width,
          canvas.height
        )
        particlesRef.current = [...particlesRef.current, ...newParticles]
      }
      prevCodeRef.current = scriptCode
    }
  }, [scriptCode, emitCodeDiff])

  useEffect(() => {
    if (emitEntryParticles) {
      const canvas = canvasRef.current
      if (!canvas) return
      for (const entry of entries) {
        if (entry.state === 'particle') {
          const newParticles = createParticlesFromEntry(entry, canvas.width, canvas.height)
          particlesRef.current = [...particlesRef.current, ...newParticles]
        }
      }
    }
  }, [entries, emitEntryParticles])

  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      particlesRef.current = updateParticles(particlesRef.current)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      renderConnections(ctx, particlesRef.current, 100)
      renderParticles(ctx, particlesRef.current, true)

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
