import { useCallback, useRef } from 'react'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  color: string
}

interface KilnFireCanvasProps {
  className?: string
  intensity?: number
  colorScheme?: 'warm' | 'cool' | 'mixed'
}

export default function KilnFireCanvas({
  className = '',
  intensity = 1,
  colorScheme = 'warm',
}: KilnFireCanvasProps) {
  const particlesRef = useRef<Particle[]>([])

  const warmColors = ['#D4622B', '#E8843A', '#F5A06F', '#FBC5A7', '#F5F0E8']
  const coolColors = ['#4A7C59', '#6a946e', '#8aab8c', '#B0C4B1', '#dce8dd']
  const mixedColors = [...warmColors.slice(0, 3), ...coolColors.slice(0, 3)]

  const colors = colorScheme === 'warm' ? warmColors : colorScheme === 'cool' ? coolColors : mixedColors

  const createParticle = useCallback(
    (width: number, height: number): Particle => {
      const maxLife = 1.5 + Math.random() * 2
      return {
        x: width * 0.3 + Math.random() * width * 0.4,
        y: height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(1.5 + Math.random() * 2) * intensity,
        size: 2 + Math.random() * 4,
        opacity: 0.6 + Math.random() * 0.4,
        life: 0,
        maxLife,
        color: colors[Math.floor(Math.random() * colors.length)],
      }
    },
    [colors, intensity]
  )

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _time: number, delta: number) => {
      const canvas = ctx.canvas
      const width = canvas.getBoundingClientRect().width
      const height = canvas.getBoundingClientRect().height

      ctx.clearRect(0, 0, width, height)

      const glow = ctx.createRadialGradient(
        width / 2,
        height,
        0,
        width / 2,
        height,
        height * 0.6
      )
      if (colorScheme === 'warm') {
        glow.addColorStop(0, 'rgba(212, 98, 43, 0.15)')
        glow.addColorStop(0.5, 'rgba(212, 98, 43, 0.05)')
        glow.addColorStop(1, 'rgba(212, 98, 43, 0)')
      } else if (colorScheme === 'cool') {
        glow.addColorStop(0, 'rgba(74, 124, 89, 0.15)')
        glow.addColorStop(0.5, 'rgba(74, 124, 89, 0.05)')
        glow.addColorStop(1, 'rgba(74, 124, 89, 0)')
      } else {
        glow.addColorStop(0, 'rgba(180, 110, 50, 0.15)')
        glow.addColorStop(0.5, 'rgba(100, 140, 80, 0.05)')
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      }
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      if (particlesRef.current.length < 80 * intensity) {
        particlesRef.current.push(createParticle(width, height))
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += delta
        if (p.life >= p.maxLife) return false

        p.x += p.vx + (Math.random() - 0.5) * 0.3
        p.y += p.vy * delta * 60
        p.vy *= 0.998
        p.opacity = Math.max(0, (1 - p.life / p.maxLife) * 0.8)
        p.size = Math.max(0.5, p.size * (1 - delta * 0.3))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1

        return true
      })
    },
    [colorScheme, createParticle, intensity]
  )

  const canvasRef = useCanvasAnimation(draw)

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
