import { useCallback, useRef } from 'react'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'

interface Shard {
  x: number
  y: number
  targetX: number
  targetY: number
  rotation: number
  targetRotation: number
  size: number
  opacity: number
  color: string
  points: { x: number; y: number }[]
}

interface ShardCanvasProps {
  className?: string
  progress?: number
}

function createShardPoints(size: number): { x: number; y: number }[] {
  const n = 3 + Math.floor(Math.random() * 3)
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.5
    const r = size * (0.5 + Math.random() * 0.5)
    points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r })
  }
  return points
}

export default function ShardCanvas({ className = '', progress = 0 }: ShardCanvasProps) {
  const shardsRef = useRef<Shard[] | null>(null)

  const ensureShards = useCallback((width: number, height: number) => {
    if (shardsRef.current) return

    const centerX = width / 2
    const centerY = height / 2
    const shardColors = ['#B0C4B1', '#8aab8c', '#4A7C59', '#6a946e', '#dce8dd']
    const shards: Shard[] = []

    const numShards = 20
    for (let i = 0; i < numShards; i++) {
      const angle = (Math.PI * 2 * i) / numShards + (Math.random() - 0.5) * 0.3
      const dist = 30 + Math.random() * 80
      const size = 15 + Math.random() * 25

      shards.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: centerX + Math.cos(angle) * dist,
        targetY: centerY + Math.sin(angle) * dist,
        rotation: Math.random() * Math.PI * 2,
        targetRotation: (Math.random() - 0.5) * 0.3,
        size,
        opacity: 0.3 + Math.random() * 0.5,
        color: shardColors[Math.floor(Math.random() * shardColors.length)],
        points: createShardPoints(size),
      })
    }

    shardsRef.current = shards
  }, [])

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _time: number, _delta: number) => {
      const canvas = ctx.canvas
      const width = canvas.getBoundingClientRect().width
      const height = canvas.getBoundingClientRect().height

      ctx.clearRect(0, 0, width, height)
      ensureShards(width, height)

      if (!shardsRef.current) return

      const p = Math.max(0, Math.min(1, progress))
      const easedP = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

      for (const shard of shardsRef.current) {
        const cx = shard.x + (shard.targetX - shard.x) * easedP
        const cy = shard.y + (shard.targetY - shard.y) * easedP
        const rot = shard.rotation + (shard.targetRotation - shard.rotation) * easedP
        const opacity = shard.opacity * (0.3 + easedP * 0.7)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot)
        ctx.globalAlpha = opacity

        ctx.beginPath()
        ctx.moveTo(shard.points[0].x, shard.points[0].y)
        for (let i = 1; i < shard.points.length; i++) {
          ctx.lineTo(shard.points[i].x, shard.points[i].y)
        }
        ctx.closePath()

        ctx.fillStyle = shard.color
        ctx.fill()

        ctx.strokeStyle = 'rgba(245, 240, 232, 0.3)'
        ctx.lineWidth = 0.5
        ctx.stroke()

        if (easedP > 0.8) {
          const glowOpacity = (easedP - 0.8) * 5 * 0.3
          ctx.shadowColor = shard.color
          ctx.shadowBlur = 10
          ctx.globalAlpha = glowOpacity
          ctx.fill()
          ctx.shadowBlur = 0
        }

        ctx.restore()
      }

      ctx.globalAlpha = 1
    },
    [progress, ensureShards]
  )

  const canvasRef = useCanvasAnimation(draw, progress > 0)

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
