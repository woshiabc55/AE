import React, { useEffect, useRef } from 'react'
import { chapters, type Chapter } from '../../data/chapters'

/**
 * 分镜渲染器：使用 Canvas 2D 模拟电影感长镜头。
 * - 卷一：孤烟直（远景大漠 + 长焦压缩 + 卷展 + 飞鸟）
 * - 卷二：烟尘起（战马奔腾 + 牌子碎裂 + 铁链拖拽 + 烟尘）
 * - 卷三：刀光乱（持刀斩击 + 箭矢 + 慢动作墨液飞溅）
 * - 卷四：万马奔腾（大远景战场 + 唢呐字幕 + 俯视拉远）
 */

interface Props {
  chapter: Chapter
  active: boolean
  /** 0..1 章节播放进度（用于同步时间线） */
  progress: number
}

export const ChapterScene: React.FC<Props> = ({ chapter, active, progress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      width = r.width
      height = r.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // 启动时间（基于 progress 同步）
    const duration = chapter.id === 1 ? 15000 : chapter.id === 2 ? 15000 : chapter.id === 3 ? 15000 : 15000
    startRef.current = performance.now() - progress * duration

    const draw = (now: number) => {
      const t = ((now - startRef.current) % duration) / 1000 // 秒
      ctx.clearRect(0, 0, width, height)
      // 背景渐变（按 palette 渲染）
      const p = chapter.palette
      const grad = ctx.createLinearGradient(0, 0, 0, height)
      grad.addColorStop(0, '#0E0B08')
      grad.addColorStop(0.4, p[1] || '#1B1A18')
      grad.addColorStop(1, '#0E0B08')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // 共用：远山轮廓 + 飞鸟
      drawMountains(ctx, width, height, p[2])
      drawBirds(ctx, width, height, t, p[2])

      // 分镜
      switch (chapter.kind) {
        case 'lonely':
          drawLonely(ctx, width, height, t, p)
          break
        case 'dust':
          drawDust(ctx, width, height, t, p)
          break
        case 'blade':
          drawBlade(ctx, width, height, t, p)
          break
        case 'thunder':
          drawThunder(ctx, width, height, t, p)
          break
      }

      // 共用：颗粒 / 镜头晕影
      drawGrain(ctx, width, height, t)
      drawVignette(ctx, width, height)

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [chapter, progress])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${active ? 'shake-slow' : ''}`}
      style={{ display: 'block' }}
    />
  )
}

// ---------- 共用元素 ----------

function drawMountains(ctx: CanvasRenderingContext2D, w: number, h: number, tone: string) {
  const layers = 4
  for (let i = 0; i < layers; i++) {
    const yBase = h * (0.45 + i * 0.12)
    const amp = 30 - i * 4
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 16) {
      const y =
        yBase +
        Math.sin(x * 0.004 + i) * amp +
        Math.sin(x * 0.011 + i * 1.3) * (amp * 0.4)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = tone
    ctx.globalAlpha = 0.08 + i * 0.05
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawBirds(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  tone: string,
) {
  ctx.strokeStyle = tone
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.6
  for (let i = 0; i < 8; i++) {
    const x = ((t * 30 + i * 120) % (w + 200)) - 100
    const y = h * 0.22 + Math.sin(i * 1.3) * 14
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + 6, y - 5, x + 12, y)
    ctx.quadraticCurveTo(x + 18, y - 5, x + 24, y)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawGrain(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.save()
  ctx.globalAlpha = 0.18
  ctx.globalCompositeOperation = 'overlay'
  for (let i = 0; i < 240; i++) {
    const x = (Math.sin(i * 12.9898 + t * 8) * 43758.5453) % 1
    const y = (Math.sin(i * 78.233 + t * 5) * 12345.678) % 1
    ctx.fillStyle = i % 2 ? '#fff' : '#000'
    ctx.fillRect(((x + 1) % 1) * w, ((y + 1) % 1) * h, 1.2, 1.2)
  }
  ctx.restore()
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(0,0,0,0.7)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

// ---------- 卷一·孤烟直 ----------
function drawLonely(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: readonly string[],
) {
  // 长焦压缩：低地平线 + 顶天立地孤烟
  const horizon = h * 0.62
  // 沙漠
  const sand = ctx.createLinearGradient(0, horizon, 0, h)
  sand.addColorStop(0, '#3D2A18')
  sand.addColorStop(1, '#1B1A18')
  ctx.fillStyle = sand
  ctx.fillRect(0, horizon, w, h - horizon)
  // 阳光一抹
  ctx.fillStyle = 'rgba(201,161,74,0.18)'
  ctx.beginPath()
  ctx.ellipse(w * 0.66, horizon, w * 0.25, 12, 0, 0, Math.PI * 2)
  ctx.fill()

  // 孤烟（连续垂直多段）
  const cx = w * 0.36
  for (let i = 0; i < 20; i++) {
    const y0 = horizon - i * 18
    const wob = Math.sin(t * 0.6 + i * 0.4) * 6
    const a = 0.18 - i * 0.008
    if (a <= 0) break
    ctx.fillStyle = `rgba(220,210,190,${a})`
    ctx.beginPath()
    ctx.ellipse(cx + wob, y0, 12 + i * 0.6, 6 + i * 0.3, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // 卷展：左侧长卷徐徐展开
  const rollW = Math.min(w * 0.55, 200 + t * 90)
  const rollGrad = ctx.createLinearGradient(0, 0, rollW, 0)
  rollGrad.addColorStop(0, 'rgba(201,161,74,0.08)')
  rollGrad.addColorStop(1, 'rgba(242,233,216,0.0)')
  ctx.fillStyle = rollGrad
  ctx.fillRect(0, h * 0.78 - 4, rollW, 6)
  // 卷轴上下的木纹轴
  ctx.fillStyle = '#7A5A22'
  ctx.fillRect(0, h * 0.78 - 8, rollW, 4)
  ctx.fillRect(0, h * 0.78 + 2, rollW, 4)
  // 卷中文字淡淡浮现
  ctx.fillStyle = 'rgba(242,233,216,0.18)'
  ctx.font = '14px "Ma Shan Zheng", serif'
  ctx.fillText('卷一 · 孤烟直', 28, h * 0.78 - 12)
}

// ---------- 卷二·烟尘起 ----------
function drawDust(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: readonly string[],
) {
  // 地面
  const horizon = h * 0.55
  ctx.fillStyle = '#1B1A18'
  ctx.fillRect(0, horizon, w, h - horizon)
  ctx.fillStyle = 'rgba(122,90,34,0.4)'
  ctx.fillRect(0, horizon, w, 2)

  // 飞驰战马（侧面剪影 + 腿周期）
  const horses = [
    { x0: 0.05, scale: 1.0, y: 0.05 },
    { x0: 0.2, scale: 0.8, y: -0.02 },
    { x0: 0.32, scale: 0.65, y: 0.04 },
    { x0: 0.45, scale: 0.5, y: 0 },
  ]
  for (const h0 of horses) {
    const x = (t * 0.45 * w + h0.x0 * w) % (w * 1.2)
    const y = horizon - 30 + h0.y * h
    drawRider(ctx, x, y, h0.scale, t)
  }

  // 牌子 + 碎屑
  drawSign(ctx, w, h, t)
  // 铁链拖地
  drawChain(ctx, w, h, t)
  // 烟尘爆开
  drawDustBurst(ctx, w, h, t)

  // 摇晃感更强
  ctx.save()
  ctx.translate(Math.sin(t * 12) * 2, Math.cos(t * 9) * 1.5)
  ctx.restore()
}

function drawRider(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  t: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  // 马身
  ctx.fillStyle = '#0E0B08'
  ctx.beginPath()
  ctx.ellipse(0, 0, 60, 18, 0, 0, Math.PI * 2)
  ctx.fill()
  // 马腿（4 根，奔跑周期）
  const phase = t * 8
  const legs = [-40, -15, 10, 35]
  for (let i = 0; i < legs.length; i++) {
    const off = legs[i]
    const a = Math.sin(phase + i * Math.PI * 0.5) * 18
    ctx.strokeStyle = '#0E0B08'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(off, 8)
    ctx.lineTo(off + a * 0.3, 38)
    ctx.stroke()
  }
  // 马头
  ctx.beginPath()
  ctx.moveTo(50, -2)
  ctx.quadraticCurveTo(78, -18, 70, -28)
  ctx.quadraticCurveTo(58, -22, 50, -10)
  ctx.closePath()
  ctx.fill()
  // 鬃毛
  ctx.fillStyle = 'rgba(122,90,34,0.7)'
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(40 - i * 4, -10 - i, 3, 10 + i)
  }
  // 骑士 + 长刀
  ctx.fillStyle = '#0E0B08'
  ctx.fillRect(-12, -50, 20, 36)
  // 头
  ctx.beginPath()
  ctx.arc(-2, -56, 10, 0, Math.PI * 2)
  ctx.fill()
  // 披风
  ctx.fillStyle = '#A22B1F'
  ctx.beginPath()
  ctx.moveTo(-10, -50)
  ctx.quadraticCurveTo(8, -38, 20, -10)
  ctx.lineTo(10, 8)
  ctx.quadraticCurveTo(-2, -10, -10, -30)
  ctx.closePath()
  ctx.fill()
  // 长刀（从背后）
  ctx.strokeStyle = '#C9A14A'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, -50)
  ctx.lineTo(36, -90)
  ctx.stroke()
  ctx.restore()
}

function drawSign(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const x = w * 0.7 - (t * 0.5 * w) % (w * 1.5)
  const y = h * 0.62
  if (x < -120 || x > w + 60) return
  ctx.save()
  ctx.translate(x, y)
  // 立柱
  ctx.fillStyle = '#3D2A18'
  ctx.fillRect(-3, 0, 6, 70)
  // 牌面
  ctx.fillStyle = '#7A5A22'
  ctx.fillRect(-40, -10, 80, 40)
  ctx.strokeStyle = '#1B1A18'
  ctx.lineWidth = 2
  ctx.strokeRect(-40, -10, 80, 40)
  // 文字
  ctx.fillStyle = '#1B1A18'
  ctx.font = '18px "Ma Shan Zheng", serif'
  ctx.fillText('酒 肆', -28, 16)
  // 牌裂
  if (Math.sin(t * 2) > 0.4) {
    ctx.strokeStyle = '#0E0B08'
    ctx.beginPath()
    ctx.moveTo(-40, -8)
    ctx.lineTo(40, 30)
    ctx.stroke()
  }
  ctx.restore()
}

function drawChain(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const y = h * 0.74
  const offset = (t * 0.6 * w) % 60
  ctx.strokeStyle = '#C9A14A'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let x = -100; x < w + 100; x += 16) {
    const yy = y + Math.sin((x + offset) * 0.06) * 4
    ctx.lineTo(x, yy)
  }
  ctx.stroke()
  // 链节
  for (let x = -100; x < w + 100; x += 16) {
    const yy = y + Math.sin((x + offset) * 0.06) * 4
    ctx.strokeStyle = 'rgba(201,161,74,0.6)'
    ctx.strokeRect(x - 4, yy - 4, 8, 8)
  }
}

function drawDustBurst(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cy = h * 0.6
  for (let i = 0; i < 50; i++) {
    const a = (i / 50) * Math.PI * 2 + t * 0.6
    const r = 40 + (i % 5) * 30 + Math.sin(t * 3 + i) * 20
    const x = w * 0.55 + Math.cos(a) * r
    const y = cy + Math.sin(a) * r * 0.5
    ctx.fillStyle = `rgba(180,160,120,${0.10 + (i % 3) * 0.04})`
    ctx.beginPath()
    ctx.arc(x, y, 10 + (i % 4) * 6, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ---------- 卷三·刀光乱 ----------
function drawBlade(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: readonly string[],
) {
  // 暗调
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fillRect(0, 0, w, h)
  // 角色剪影（背部持长刀）
  const cx = w * 0.5
  const cy = h * 0.62
  // 身
  ctx.fillStyle = '#0E0B08'
  ctx.beginPath()
  ctx.ellipse(cx, cy, 26, 80, 0, 0, Math.PI * 2)
  ctx.fill()
  // 头
  ctx.beginPath()
  ctx.arc(cx, cy - 90, 18, 0, Math.PI * 2)
  ctx.fill()
  // 长刀（从背后斜出）
  ctx.save()
  ctx.translate(cx - 4, cy - 60)
  const swing = Math.sin(t * 1.2) * 0.8
  ctx.rotate(-0.5 + swing * 0.4)
  // 刀身
  const grad = ctx.createLinearGradient(0, 0, 200, 0)
  grad.addColorStop(0, '#C9A14A')
  grad.addColorStop(0.5, '#F2E9D8')
  grad.addColorStop(1, '#7A5A22')
  ctx.fillStyle = grad
  ctx.fillRect(0, -3, 200, 6)
  // 刀柄
  ctx.fillStyle = '#3D2A18'
  ctx.fillRect(-22, -6, 22, 12)
  // 刀光
  ctx.globalAlpha = 0.6
  ctx.fillStyle = 'rgba(255,240,200,0.18)'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(120, -60 + swing * 30, 220, 0)
  ctx.quadraticCurveTo(120, 60 - swing * 30, 0, 0)
  ctx.fill()
  ctx.restore()

  // 残像
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = 0.16 - i * 0.05
    ctx.fillStyle = '#0E0B08'
    ctx.beginPath()
    ctx.ellipse(cx - 12 * (i + 1), cy, 26, 80, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // 箭矢
  for (let i = 0; i < 4; i++) {
    const ax = ((t * 0.7 + i * 0.25) * w) % w
    const ay = h * 0.3 + Math.sin(t * 3 + i) * 18
    ctx.save()
    ctx.translate(ax, ay)
    ctx.rotate(0.1)
    ctx.strokeStyle = '#C9A14A'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(40, 0)
    ctx.stroke()
    // 箭头
    ctx.fillStyle = '#C9A14A'
    ctx.beginPath()
    ctx.moveTo(40, 0)
    ctx.lineTo(34, -3)
    ctx.lineTo(34, 3)
    ctx.closePath()
    ctx.fill()
    // 尾羽
    ctx.fillStyle = 'rgba(242,233,216,0.6)'
    ctx.fillRect(-6, -3, 6, 6)
    ctx.restore()
  }

  // 黑色液体飞溅
  drawInkSplash(ctx, w, h, t)
}

function drawInkSplash(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cx = w * 0.55
  const cy = h * 0.55
  ctx.save()
  for (let i = 0; i < 22; i++) {
    const ang = (i / 22) * Math.PI * 2 + t * 0.4
    const r = 30 + ((i * 17) % 60) + Math.sin(t * 2 + i) * 8
    const x = cx + Math.cos(ang) * r
    const y = cy + Math.sin(ang) * r * 0.6
    const a = 0.45 - (i % 3) * 0.1
    ctx.fillStyle = `rgba(20,15,10,${a})`
    ctx.beginPath()
    ctx.ellipse(x, y, 6 + (i % 4), 2, ang, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

// ---------- 卷四·万马奔腾 ----------
function drawThunder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: readonly string[],
) {
  // 大远景俯视感
  const horizon = h * 0.5
  // 草原
  const g = ctx.createLinearGradient(0, horizon, 0, h)
  g.addColorStop(0, '#26221C')
  g.addColorStop(1, '#0E0B08')
  ctx.fillStyle = g
  ctx.fillRect(0, horizon, w, h - horizon)
  // 地平线雾
  ctx.fillStyle = 'rgba(61,90,90,0.35)'
  ctx.fillRect(0, horizon - 6, w, 12)
  // 战马群（缩小剪影）
  for (let i = 0; i < 40; i++) {
    const x = ((t * 0.6 + i * 0.025) * w) % w
    const y = horizon + 20 + (i * 7) % (h - horizon - 20)
    const s = 0.5 + ((i * 13) % 10) * 0.05
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(s, s)
    ctx.fillStyle = '#0E0B08'
    ctx.beginPath()
    ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(10, -3, 4, 2)
    // 腿
    ctx.strokeStyle = '#0E0B08'
    ctx.lineWidth = 1
    for (let k = 0; k < 4; k++) {
      const lx = -8 + k * 5
      ctx.beginPath()
      ctx.moveTo(lx, 3)
      ctx.lineTo(lx + Math.sin(t * 10 + k) * 2, 9)
      ctx.stroke()
    }
    ctx.restore()
  }
  // 烟尘滚滚
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * Math.PI * 2 + t * 0.5
    const r = 120 + (i * 23) % 100
    const x = w * 0.5 + Math.cos(a) * r
    const y = h * 0.55 + Math.sin(a) * r * 0.35
    ctx.fillStyle = `rgba(180,160,120,${0.08 + (i % 3) * 0.03})`
    ctx.beginPath()
    ctx.arc(x, y, 18 + (i % 5) * 6, 0, Math.PI * 2)
    ctx.fill()
  }
  // 拉远感：边角加暗
  const vg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,0.6)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, w, h)
}

// 静音警告：使用 chapters 列表以保证 tree-shaking 不掉 kind
chapters.forEach(() => {})
