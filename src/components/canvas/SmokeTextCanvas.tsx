import { useCallback, useRef } from 'react'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'

interface TextParticle {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  opacity: number
  color: string
}

interface SmokeTextCanvasProps {
  className?: string
  text?: string
  progress?: number
  color?: string
}

export default function SmokeTextCanvas({
  className = '',
  text = '',
  progress = 0,
  color = '#B0C4B1',
}: SmokeTextCanvasProps) {
  const particlesRef = useRef<TextParticle[] | null>(null)
  const progressRef = useRef(progress)
  progressRef.current = progress
  const configRef = useRef({ text, color })
  configRef.current = { text, color }

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, time: number, _delta: number) => {
      const canvas = ctx.canvas
      const width = canvas.getBoundingClientRect().width
      const height = canvas.getBoundingClientRect().height
      if (width === 0 || height === 0) return

      ctx.clearRect(0, 0, width, height)

      const { text: currentText, color: currentColor } = configRef.current
      if (!currentText) return

      if (!particlesRef.current) {
        const offscreen = document.createElement('canvas')
        const offCtx = offscreen.getContext('2d')
        if (!offCtx) return

        offscreen.width = width
        offscreen.height = height

        const fontSize = Math.min(width / (currentText.length * 0.8), 60)
        offCtx.font = `bold ${fontSize}px "Noto Serif SC", serif`
        offCtx.fillStyle = 'white'
        offCtx.textAlign = 'center'
        offCtx.textBaseline = 'middle'
        offCtx.fillText(currentText, width / 2, height / 2)

        const imageData = offCtx.getImageData(0, 0, width, height)
        const particles: TextParticle[] = []
        const gap = 4

        for (let y = 0; y < height; y += gap) {
          for (let x = 0; x < width; x += gap) {
            const index = (y * width + x) * 4
            if (imageData.data[index + 3] > 128) {
              particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                targetX: x,
                targetY: y,
                size: 1.5 + Math.random() * 1.5,
                opacity: 0.4 + Math.random() * 0.6,
                color: currentColor,
              })
            }
          }
        }

        particlesRef.current = particles
      }

      const p = Math.max(0, Math.min(1, progressRef.current))
      if (p <= 0) return

      const easedP = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

      for (const particle of particlesRef.current) {
        const cx = particle.x + (particle.targetX - particle.x) * easedP
        const cy = particle.y + (particle.targetY - particle.y) * easedP

        const drift = easedP < 1 ? (1 - easedP) * 0.5 : 0
        const dx = cx + Math.sin(cy * 0.02 + time) * drift * 3
        const dy = cy + Math.cos(cx * 0.02 + time) * drift * 3

        ctx.beginPath()
        ctx.arc(dx, dy, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity * (0.3 + easedP * 0.7)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    },
    []
  )

  const canvasRef = useCanvasAnimation(draw, progress > 0)

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
