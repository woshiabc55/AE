import { useCallback, useRef } from 'react'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'

interface Crack {
  points: { x: number; y: number }[]
  width: number
  color: string
  speed: number
  branches: Crack[]
}

interface CrackCanvasProps {
  className?: string
  progress?: number
}

function generateCrack(
  startX: number,
  startY: number,
  angle: number,
  length: number,
  width: number,
  isMain: boolean,
  depth: number
): Crack {
  const points: { x: number; y: number }[] = [{ x: startX, y: startY }]
  const segments = Math.floor(length / 8)
  let currentAngle = angle
  let cx = startX
  let cy = startY

  for (let i = 0; i < segments; i++) {
    currentAngle += (Math.random() - 0.5) * 0.6
    cx += Math.cos(currentAngle) * 8
    cy += Math.sin(currentAngle) * 8
    points.push({ x: cx, y: cy })
  }

  const branches: Crack[] = []
  if (depth < 3 && isMain) {
    const branchCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < branchCount; i++) {
      const branchIndex = Math.floor(Math.random() * points.length)
      const bp = points[branchIndex]
      const branchAngle = currentAngle + (Math.random() - 0.5) * 1.2
      branches.push(
        generateCrack(bp.x, bp.y, branchAngle, length * 0.4, width * 0.5, false, depth + 1)
      )
    }
  } else if (depth < 2 && !isMain) {
    if (Math.random() > 0.5) {
      const branchIndex = Math.floor(Math.random() * points.length)
      const bp = points[branchIndex]
      const branchAngle = currentAngle + (Math.random() - 0.5) * 1.5
      branches.push(
        generateCrack(bp.x, bp.y, branchAngle, length * 0.3, width * 0.3, false, depth + 1)
      )
    }
  }

  return {
    points,
    width,
    color: isMain ? '#5C3A21' : '#C9A84C',
    speed: 0.3 + Math.random() * 0.4,
    branches,
  }
}

function drawCrack(ctx: CanvasRenderingContext2D, crack: Crack, globalProgress: number) {
  const visiblePoints = Math.floor(crack.points.length * Math.min(1, globalProgress * crack.speed))
  if (visiblePoints < 2) return

  ctx.beginPath()
  ctx.moveTo(crack.points[0].x, crack.points[0].y)
  for (let i = 1; i < visiblePoints; i++) {
    ctx.lineTo(crack.points[i].x, crack.points[i].y)
  }
  ctx.strokeStyle = crack.color
  ctx.lineWidth = crack.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 0.8
  ctx.stroke()
  ctx.globalAlpha = 1

  if (crack.width > 1) {
    ctx.beginPath()
    ctx.moveTo(crack.points[0].x, crack.points[0].y)
    for (let i = 1; i < visiblePoints; i++) {
      ctx.lineTo(crack.points[i].x, crack.points[i].y)
    }
    ctx.strokeStyle = crack.color === '#5C3A21' ? '#3a2210' : '#a08030'
    ctx.lineWidth = crack.width * 0.3
    ctx.globalAlpha = 0.4
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  for (const branch of crack.branches) {
    drawCrack(ctx, branch, globalProgress)
  }
}

export default function CrackCanvas({ className = '', progress = 0 }: CrackCanvasProps) {
  const cracksRef = useRef<Crack[] | null>(null)
  const progressRef = useRef(progress)
  progressRef.current = progress

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _time: number, _delta: number) => {
      const canvas = ctx.canvas
      const width = canvas.getBoundingClientRect().width
      const height = canvas.getBoundingClientRect().height
      if (width === 0 || height === 0) return

      ctx.clearRect(0, 0, width, height)

      if (!cracksRef.current) {
        const centerX = width / 2
        const centerY = height / 2
        const mainCracks: Crack[] = []

        const numMain = 5 + Math.floor(Math.random() * 4)
        for (let i = 0; i < numMain; i++) {
          const angle = (Math.PI * 2 * i) / numMain + (Math.random() - 0.5) * 0.5
          const length = 80 + Math.random() * 150
          mainCracks.push(generateCrack(centerX, centerY, angle, length, 2 + Math.random(), true, 0))
        }

        const numGold = 8 + Math.floor(Math.random() * 6)
        for (let i = 0; i < numGold; i++) {
          const angle = Math.random() * Math.PI * 2
          const dist = 20 + Math.random() * 60
          const sx = centerX + Math.cos(angle) * dist
          const sy = centerY + Math.sin(angle) * dist
          const length = 40 + Math.random() * 80
          mainCracks.push(generateCrack(sx, sy, angle + (Math.random() - 0.5), length, 0.8, false, 1))
        }

        cracksRef.current = mainCracks
      }

      const p = progressRef.current
      if (p <= 0) return

      for (const crack of cracksRef.current) {
        drawCrack(ctx, crack, p)
      }
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
