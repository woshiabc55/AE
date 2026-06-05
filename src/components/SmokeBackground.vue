<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let lastT = 0

interface P { x: number; y: number; r: number; a: number; vx: number; vy: number; hue: string; life: number; age: number }
let particles: P[] = []

function init(w: number, h: number) {
  particles = []
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 30 + Math.random() * 80,
      a: 0.02 + Math.random() * 0.06,
      vx: (Math.random() - 0.5) * 0.05,
      vy: -0.05 - Math.random() * 0.15,
      hue: Math.random() > 0.6 ? '#E0A82E' : Math.random() > 0.5 ? '#B08D57' : '#7A1B17',
      life: 6000 + Math.random() * 4000,
      age: Math.random() * 6000
    })
  }
}

function draw(dt: number) {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')!
  const w = c.width, h = c.height
  ctx.clearRect(0, 0, w, h)

  for (const p of particles) {
    p.age += dt
    p.x += p.vx * dt * 0.1
    p.y += p.vy * dt * 0.1
    const k = p.age / p.life
    const fade = Math.sin(k * Math.PI) * p.a
    if (k >= 1) {
      p.x = Math.random() * w
      p.y = h + Math.random() * 40
      p.r = 30 + Math.random() * 80
      p.a = 0.02 + Math.random() * 0.06
      p.hue = Math.random() > 0.6 ? '#E0A82E' : Math.random() > 0.5 ? '#B08D57' : '#7A1B17'
      p.age = 0
    }
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
    grad.addColorStop(0, p.hue + Math.round(fade * 255).toString(16).padStart(2, '0'))
    grad.addColorStop(1, p.hue + '00')
    ctx.fillStyle = grad
    ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
  }
}

function loop(t: number) {
  if (!lastT) lastT = t
  const dt = Math.min(80, t - lastT)
  lastT = t
  draw(dt)
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
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
  init(rect.width, rect.height)
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
</script>

<template>
  <canvas ref="canvas" class="smoke-bg" aria-hidden="true" />
</template>

<style scoped>
.smoke-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.7;
}
</style>
