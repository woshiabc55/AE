<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { PropType } from 'vue'

type ParticleType = 'smoke' | 'spark' | 'shockwave' | 'blood' | 'arrow' | 'ash'

const props = defineProps({
  type: { type: String as PropType<ParticleType>, required: true },
  active: { type: Boolean, default: true }
})

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let last = 0
let particles: any[] = []

function rand(min: number, max: number) { return min + Math.random() * (max - min) }

function init(type: ParticleType, w: number, h: number) {
  particles = []
  if (type === 'smoke') {
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: w / 2 + rand(-20, 20),
        y: h + rand(0, 40),
        r: rand(8, 18),
        a: rand(0.18, 0.42),
        vy: -rand(0.4, 1.1),
        vx: rand(-0.2, 0.2),
        hue: Math.random() > 0.5 ? '#E0A82E' : '#B08D57',
        life: rand(120, 220),
        age: rand(0, 120)
      })
    }
  } else if (type === 'spark') {
    for (let i = 0; i < 50; i++) {
      const ang = (i / 50) * Math.PI * 2
      particles.push({
        x: w / 2,
        y: h / 2,
        vx: Math.cos(ang) * rand(2, 5),
        vy: Math.sin(ang) * rand(2, 5) - 0.5,
        r: rand(1.2, 2.4),
        life: rand(40, 90),
        age: 0
      })
    }
  } else if (type === 'shockwave') {
    particles = [
      { r: 0, max: Math.hypot(w, h) * 0.6, w: 2, age: 0 },
      { r: 0, max: Math.hypot(w, h) * 0.6, w: 2, age: -25, delay: 25 },
      { r: 0, max: Math.hypot(w, h) * 0.6, w: 2, age: -50, delay: 50 }
    ]
  } else if (type === 'blood') {
    for (let i = 0; i < 36; i++) {
      const ang = rand(-Math.PI * 0.7, -Math.PI * 0.3)
      particles.push({
        x: w / 2,
        y: h * 0.55,
        vx: Math.cos(ang) * rand(2, 6),
        vy: Math.sin(ang) * rand(0.5, 3),
        r: rand(2.4, 4.4),
        life: rand(50, 100),
        age: 0,
        solid: Math.random() > 0.5
      })
    }
  } else if (type === 'arrow') {
    for (let i = 0; i < 6; i++) {
      particles.push({
        x: -40 - i * 30,
        y: h * 0.5 + rand(-30, 30),
        vx: 5 + i * 0.2,
        len: rand(60, 110)
      })
    }
  } else if (type === 'ash') {
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(-h, 0),
        vy: rand(0.5, 1.6),
        vx: rand(-0.2, 0.2),
        r: rand(0.6, 2.0),
        a: rand(0.4, 0.9)
      })
    }
  }
}

function draw(type: ParticleType, t: number, dt: number) {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')!
  const w = c.width, h = c.height
  ctx.fillStyle = 'rgba(11, 11, 15, 0.18)'
  ctx.fillRect(0, 0, w, h)

  if (type === 'smoke') {
    for (const p of particles) {
      p.age += dt
      p.x += p.vx + Math.sin(p.age * 0.04 + p.y * 0.02) * 0.4
      p.y += p.vy
      p.a *= 0.998
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
      grad.addColorStop(0, p.hue + 'cc')
      grad.addColorStop(1, p.hue + '00')
      ctx.globalAlpha = p.a
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
      if (p.y < -20 || p.a < 0.02) {
        p.x = w / 2 + rand(-30, 30)
        p.y = h + rand(0, 30)
        p.r = rand(8, 18)
        p.a = rand(0.18, 0.42)
        p.vy = -rand(0.4, 1.1)
        p.vx = rand(-0.2, 0.2)
        p.age = 0
        p.hue = Math.random() > 0.5 ? '#E0A82E' : '#B08D57'
      }
    }
    ctx.globalAlpha = 1
  } else if (type === 'spark') {
    for (const p of particles) {
      p.age += dt
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.12
      p.vx *= 0.99
      const a = Math.max(0, 1 - p.age / p.life)
      ctx.globalAlpha = a
      ctx.fillStyle = '#6FE6DD'
      ctx.shadowColor = '#3FB8AF'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  } else if (type === 'shockwave') {
    for (const p of particles) {
      p.age += dt
      if (p.age < 0) continue
      const k = Math.min(1, p.age / 90)
      p.r = p.max * k
      ctx.globalAlpha = (1 - k) * 0.6
      ctx.strokeStyle = '#E0A82E'
      ctx.lineWidth = p.w * (1 - k * 0.7)
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.55, p.r, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  } else if (type === 'blood') {
    for (const p of particles) {
      p.age += dt
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.18
      const a = Math.max(0, 1 - p.age / p.life)
      ctx.globalAlpha = a
      ctx.fillStyle = '#1A0606'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
      // 拉丝
      if (!p.solid) {
        ctx.strokeStyle = 'rgba(26, 6, 6, ' + (a * 0.6) + ')'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(p.x - p.vx * 6, p.y - p.vy * 6)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  } else if (type === 'arrow') {
    for (const p of particles) {
      p.x += p.vx
      if (p.x > w + 60) p.x = -40
      // 虚影
      ctx.globalAlpha = 0.18
      ctx.strokeStyle = '#E6F0FF'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(p.x - p.len * 0.7, p.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      // 实体
      ctx.globalAlpha = 1
      ctx.strokeStyle = '#C9D6E8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(p.x - 18, p.y)
      ctx.lineTo(p.x + 4, p.y)
      ctx.stroke()
      // 箭头
      ctx.fillStyle = '#E6F0FF'
      ctx.beginPath()
      ctx.moveTo(p.x + 10, p.y)
      ctx.lineTo(p.x + 2, p.y - 4)
      ctx.lineTo(p.x + 2, p.y + 4)
      ctx.closePath()
      ctx.fill()
      // 轨迹
      ctx.globalAlpha = 0.4
      ctx.strokeStyle = '#3FB8AF'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(p.x - p.len, p.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  } else if (type === 'ash') {
    for (const p of particles) {
      p.age += dt
      p.x += p.vx + Math.sin((p.y + p.age) * 0.02) * 0.4
      p.y += p.vy
      if (p.y > h + 6) {
        p.x = rand(0, w)
        p.y = -6
      }
      ctx.globalAlpha = p.a
      ctx.fillStyle = '#A39A8A'
      ctx.fillRect(p.x, p.y, p.r, p.r * 1.6)
    }
    ctx.globalAlpha = 1
  }
}

function loop(t: number) {
  if (!canvas.value) return
  if (!last) last = t
  const dt = Math.min(50, t - last)
  last = t
  draw(props.type, t, dt)
  raf = requestAnimationFrame(loop)
}

function resize() {
  const c = canvas.value
  if (!c) return
  const rect = c.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  c.width = rect.width * dpr
  c.height = rect.height * dpr
  const ctx = c.getContext('2d')!
  ctx.scale(dpr, dpr)
  // reset transform-aware init
  init(props.type, rect.width, rect.height)
}

onMounted(() => {
  resize()
  raf = requestAnimationFrame(loop)
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
watch(() => props.type, () => {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    init(props.type, rect.width, rect.height)
  }
})
</script>

<template>
  <canvas ref="canvas" class="particle-canvas" />
</template>

<style scoped>
.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
  background: radial-gradient(ellipse at 50% 60%, #15151B 0%, #0B0B0F 70%);
  border-radius: 6px;
}
</style>
