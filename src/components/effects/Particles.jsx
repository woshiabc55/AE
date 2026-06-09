import { useEffect, useRef } from 'react'

/**
 * Canvas 粒子系统 — IMS 粒子模糊参考
 */
export default function Particles({
  count = 120,
  color = '#c8a464',
  size = 1.2,
  speed = 0.3,
  spread = 100,
  blur = false,
  className = ''
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    // 初始化粒子
    const r = canvas.getBoundingClientRect()
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * r.width,
      y: Math.random() * r.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      life: Math.random() * 1,
      decay: 0.002 + Math.random() * 0.005,
      size: size * (0.4 + Math.random() * 1.6)
    }))

    const draw = () => {
      const r = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, r.width, r.height)
      if (blur) ctx.filter = 'blur(2px)'
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0 || p.x < -spread || p.x > r.width + spread || p.y < -spread || p.y > r.height + spread) {
          p.x = Math.random() * r.width
          p.y = Math.random() * r.height
          p.life = 1
          p.vx = (Math.random() - 0.5) * speed
          p.vy = (Math.random() - 0.5) * speed
        }
        ctx.globalAlpha = Math.max(0, p.life) * 0.7
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      ctx.filter = 'none'
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [count, color, size, speed, spread, blur])

  return <canvas ref={canvasRef} className={`shot-layer ${className}`} />
}
