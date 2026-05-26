import type { Particle, Entry } from '@/types'

const PARTICLE_COLORS = ['#00ff88', '#ff0066', '#00ccff', '#ffaa00', '#ff44cc', '#44ffcc']

export function createParticlesFromEntry(entry: Entry, canvasWidth: number, canvasHeight: number): Particle[] {
  const chars = entry.text.split('')
  const count = Math.min(chars.length * 3, entry.particleCount)
  const particles: Particle[] = []

  for (let i = 0; i < count; i++) {
    const char = chars[i % chars.length]
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const speed = 0.5 + Math.random() * 2.5
    const maxLife = 60 + Math.random() * 120

    particles.push({
      id: `${entry.id}-${i}-${Date.now()}`,
      x: entry.x + (Math.random() - 0.5) * 20,
      y: entry.y + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: maxLife,
      maxLife,
      size: 2 + Math.random() * 4,
      color: entry.color || PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: 1,
      entryId: entry.id,
      char,
    })
  }

  return particles
}

export function createParticlesFromCode(
  code: string,
  prevCode: string,
  canvasWidth: number,
  canvasHeight: number
): Particle[] {
  const diffLines: number[] = []
  const currentLines = code.split('\n')
  const prevLines = prevCode.split('\n')

  for (let i = 0; i < currentLines.length; i++) {
    if (currentLines[i] !== (prevLines[i] || '')) {
      diffLines.push(i)
    }
  }

  if (diffLines.length === 0) return []

  const particles: Particle[] = []
  const lineHeight = 18

  for (const lineIdx of diffLines) {
    const line = currentLines[lineIdx] || ''
    const y = Math.min(lineIdx * lineHeight + 30, canvasHeight - 20)
    const chars = line.split('')

    for (let ci = 0; ci < chars.length; ci++) {
      if (chars[ci] === ' ' || chars[ci] === '\t') continue
      if (Math.random() > 0.4) continue

      const x = Math.min(60 + ci * 7.8, canvasWidth - 10)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI
      const speed = 0.3 + Math.random() * 1.5
      const maxLife = 40 + Math.random() * 80

      const isKeyword = /^(function|const|let|var|return|if|else|for|while|class|import|export|new|this|async|await)$/.test(chars.slice(ci).join(''))
      const color = isKeyword ? '#00ff88' : (Math.random() > 0.5 ? '#ff0066' : '#00ccff')

      particles.push({
        id: `code-${lineIdx}-${ci}-${Date.now()}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: isKeyword ? 3 + Math.random() * 3 : 1.5 + Math.random() * 2,
        color,
        alpha: 1,
        entryId: 'code',
        char: chars[ci],
      })
    }
  }

  return particles
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.01,
      vx: p.vx * 0.99,
      life: p.life - 1,
      alpha: Math.max(0, p.life / p.maxLife),
      size: p.size * (0.99 + (p.life / p.maxLife) * 0.01),
    }))
    .filter((p) => p.life > 0)
}

export function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  showChars: boolean = true
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (const p of particles) {
    ctx.save()
    ctx.globalAlpha = p.alpha * 0.8

    ctx.shadowBlur = p.size * 3
    ctx.shadowColor = p.color

    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()

    if (showChars && p.size > 2 && p.alpha > 0.3) {
      ctx.globalAlpha = p.alpha * 0.6
      ctx.shadowBlur = 0
      ctx.font = `${Math.round(p.size * 2.5)}px 'JetBrains Mono', monospace`
      ctx.fillStyle = p.color
      ctx.fillText(p.char, p.x + p.size + 1, p.y + p.size * 0.5)
    }

    ctx.restore()
  }
}

export function renderConnections(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  maxDist: number = 80
) {
  const byEntry = new Map<string, Particle[]>()
  for (const p of particles) {
    const list = byEntry.get(p.entryId) || []
    list.push(p)
    byEntry.set(p.entryId, list)
  }

  for (const [, group] of byEntry) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const dx = group[i].x - group[j].x
        const dy = group[i].y - group[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * Math.min(group[i].alpha, group[j].alpha) * 0.3
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.strokeStyle = group[i].color
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(group[i].x, group[i].y)
          ctx.lineTo(group[j].x, group[j].y)
          ctx.stroke()
          ctx.restore()
        }
      }
    }
  }
}
