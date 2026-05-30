import { useCallback, useRef } from 'react'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'
import type { ParticleConfig } from '@/engine/types'

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
  config: ParticleConfig
}

const MAX_PARTICLES = 120

const warmColors = ['#D4622B', '#E8843A', '#F5A06F', '#FBC5A7', '#F5F0E8']
const coolColors = ['#4A7C59', '#6a946e', '#8aab8c', '#B0C4B1', '#dce8dd']
const mixedColors = [...warmColors.slice(0, 3), ...coolColors.slice(0, 3)]
const colorsMap = { warm: warmColors, cool: coolColors, mixed: mixedColors }

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function KilnFireCanvas({
  className = '',
  config,
}: KilnFireCanvasProps) {
  const particlesRef = useRef<Particle[]>([])
  const configRef = useRef(config)
  configRef.current = config

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _time: number, delta: number) => {
      const canvas = ctx.canvas
      const width = canvas.getBoundingClientRect().width
      const height = canvas.getBoundingClientRect().height
      if (width === 0 || height === 0) return

      const {
        intensity,
        colorScheme,
        direction,
        speed,
        sizeRange,
        glowRadius,
        glowColor,
      } = configRef.current
      const colors = colorsMap[colorScheme]

      ctx.clearRect(0, 0, width, height)

      let glowX = width / 2
      let glowY = height
      if (direction === 'down') {
        glowY = 0
      } else if (direction === 'scatter' || direction === 'converge') {
        glowY = height / 2
      }

      const glow = ctx.createRadialGradient(
        glowX, glowY, 0,
        glowX, glowY, glowRadius,
      )
      glow.addColorStop(0, hexToRgba(glowColor, 0.15))
      glow.addColorStop(0.5, hexToRgba(glowColor, 0.05))
      glow.addColorStop(1, hexToRgba(glowColor, 0))
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      const maxCount = Math.floor(MAX_PARTICLES * intensity)
      if (particlesRef.current.length < maxCount) {
        const maxLife = 1.5 + Math.random() * 2
        let x: number, y: number, vx: number, vy: number

        switch (direction) {
          case 'up':
            x = width * 0.3 + Math.random() * width * 0.4
            y = height
            vx = (Math.random() - 0.5) * 0.8
            vy = -(1.5 + Math.random() * 2) * speed
            break
          case 'down':
            x = width * 0.3 + Math.random() * width * 0.4
            y = 0
            vx = (Math.random() - 0.5) * 0.8
            vy = (1.5 + Math.random() * 2) * speed
            break
          case 'scatter': {
            const angle = Math.random() * Math.PI * 2
            const spd = (1.5 + Math.random() * 2) * speed
            x = width / 2
            y = height / 2
            vx = Math.cos(angle) * spd
            vy = Math.sin(angle) * spd
            break
          }
          case 'converge': {
            const side = Math.floor(Math.random() * 4)
            if (side === 0) { x = Math.random() * width; y = 0 }
            else if (side === 1) { x = Math.random() * width; y = height }
            else if (side === 2) { x = 0; y = Math.random() * height }
            else { x = width; y = Math.random() * height }
            const dx = width / 2 - x
            const dy = height / 2 - y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const spd = (1.5 + Math.random() * 2) * speed
            vx = (dx / dist) * spd
            vy = (dy / dist) * spd
            break
          }
        }

        const [minSize, maxSize] = sizeRange
        particlesRef.current.push({
          x,
          y,
          vx,
          vy,
          size: minSize + Math.random() * (maxSize - minSize),
          opacity: 0.6 + Math.random() * 0.4,
          life: 0,
          maxLife,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      const isRadial = direction === 'scatter' || direction === 'converge'

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += delta
        if (p.life >= p.maxLife) return false

        if (isRadial) {
          p.x += p.vx * delta * 60 + (Math.random() - 0.5) * 0.3
          p.y += p.vy * delta * 60
          p.vx *= 0.998
          p.vy *= 0.998
        } else {
          p.x += p.vx + (Math.random() - 0.5) * 0.3
          p.y += p.vy * delta * 60
          p.vy *= 0.998
        }

        p.opacity = Math.max(0, (1 - p.life / p.maxLife) * 0.8)
        p.size = Math.max(0.5, p.size * (1 - delta * 0.3))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()

        return true
      })

      ctx.globalAlpha = 1
    },
    [],
  )

  const canvasRef = useCanvasAnimation(draw)

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
