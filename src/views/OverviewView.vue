<script setup lang="ts">
import { useStoryboardStore } from '@/stores/storyboard'
import TimelineBar from '@/components/TimelineBar.vue'
import BeatCard from '@/components/BeatCard.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const store = useStoryboardStore()
const router = useRouter()

const allPrompts = computed(() => store.shots.map((s) => s.prompt).join('\n\n'))

async function copyAll() {
  try {
    await navigator.clipboard.writeText(allPrompts.value)
    alert('已复制四镜完整提示词到剪贴板')
  } catch {
    alert('复制失败，请手动选择')
  }
}
</script>

<template>
  <div class="overview">
    <header class="hero fade-up">
      <div class="hero-meta mono">
        <span>RUNWAY · PIKA · SORA</span>
        <span class="serif-divider"></span>
        <span>60s · IMAX · 24/48fps</span>
        <span class="serif-divider"></span>
        <span>FOUR-SHOT SEQUENCE</span>
      </div>
      <h1 class="hero-title display fade-up delay-1">
        <span class="char" style="--i:0">铁</span>
        <span class="char" style="--i:1">链</span>
        <span class="char" style="--i:2">惊</span>
        <span class="char" style="--i:3">蛰</span>
        <span class="hero-dot" style="--i:4">·</span>
        <span class="char hero-sub" style="--i:5">黄</span>
        <span class="char hero-sub" style="--i:6">忌</span>
        <span class="char hero-sub" style="--i:7">出</span>
        <span class="char hero-sub" style="--i:8">阵</span>
      </h1>
      <p class="hero-subtitle serif fade-up delay-2">
        四镜 · <span class="glow">60 秒</span> IMAX 战斗分镜 —— 蓄力、释放、坠毁、绝对静止。
      </p>
      <div class="hero-actions fade-up delay-3">
        <button class="btn btn-primary" @click="router.push('/scene/one')">从分镜一开始</button>
        <button class="btn btn-ghost" @click="copyAll">复制全部提示词</button>
      </div>
    </header>

    <section class="section fade-up delay-3">
      <div class="section-head">
        <span class="section-mark display">I</span>
        <h2 class="section-title serif">时序条 · Time Axis</h2>
        <span class="section-note muted">0:00 — 1:00 · 60 格刻度</span>
      </div>
      <TimelineBar />
    </section>

    <section class="section fade-up delay-4">
      <div class="section-head">
        <span class="section-mark display">II</span>
        <h2 class="section-title serif">节奏波形 · Beat Cards</h2>
        <span class="section-note muted">四镜主导节奏</span>
      </div>
      <div class="beat-grid">
        <BeatCard
          v-for="shot in store.shots"
          :key="shot.id"
          :index="shot.index"
          :title="shot.title"
          :shape="shot.beatShape.split('（')[0]"
          :range="shot.timeLabel"
          :color="shot.color"
        />
      </div>
    </section>

    <section class="section fade-up delay-5">
      <div class="section-head">
        <span class="section-mark display">III</span>
        <h2 class="section-title serif">动态导向总线 · Motion Bus</h2>
        <span class="section-note muted">动作轴 / 视觉导向 / 粒子主轨迹</span>
      </div>
      <div class="bus-table">
        <div class="bus-table-head">
          <span>分镜</span>
          <span>主导运动轴</span>
          <span>视觉导向</span>
          <span>节奏波形</span>
          <span>粒子主轨迹</span>
        </div>
        <div class="bus-table-row" v-for="shot in store.shots" :key="shot.id" :style="{ '--c': shot.color }">
          <span class="bus-shot">
            <span class="bus-shot-index display">分镜{{ shot.index }}</span>
            <span class="bus-shot-title serif">{{ shot.title }}</span>
          </span>
          <span class="mono">{{ shot.motionAxis }}</span>
          <span>{{ shot.visualGuide }}</span>
          <span>{{ shot.beatShape }}</span>
          <span class="spark">{{ shot.particleTrail }}</span>
        </div>
      </div>
    </section>

    <footer class="foot fade-up delay-6">
      <div class="foot-left">
        <span class="display" style="font-size:24px; color:var(--c-bronze-glow); letter-spacing:.08em;">铁链惊蛰</span>
        <span class="muted" style="font-size:11px; letter-spacing:.18em;">STORYBOARD WORKSHOP</span>
      </div>
      <div class="foot-right muted">
        制作 · {{ new Date().getFullYear() }} · Vue 3 + Vite + TypeScript
      </div>
    </footer>
  </div>
</template>

<style scoped>
.overview {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

.hero { position: relative; padding-top: var(--s-6); }
.hero-meta {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--c-ash);
  margin-bottom: var(--s-4);
}
.hero-title {
  font-size: clamp(48px, 8vw, 112px);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: 0.02em;
  margin: 0 0 var(--s-4);
  color: var(--c-bronze-glow);
  text-shadow: 0 0 32px rgba(224, 168, 46, 0.25);
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
}
.char {
  display: inline-block;
  animation: charRise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i) * 80ms);
}
.hero-sub { color: #E8E1D4; }
.hero-dot { color: var(--c-blood); }
@keyframes charRise {
  from { opacity: 0; transform: translateY(28px) skewY(8deg); }
  to   { opacity: 1; transform: translateY(0) skewY(0); }
}
.hero-subtitle {
  font-size: 18px;
  color: #C8BFAE;
  margin: 0 0 var(--s-5);
  max-width: 720px;
  letter-spacing: 0.04em;
}
.hero-actions { display: flex; gap: var(--s-3); }
.btn {
  padding: 12px 22px;
  border: 1px solid var(--c-line-strong);
  font-family: var(--f-mono);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: transparent;
  color: var(--c-bronze);
  transition: all var(--t-fast);
}
.btn-primary {
  background: linear-gradient(90deg, var(--c-bronze-deep), var(--c-bronze));
  color: var(--c-ink);
  border-color: var(--c-bronze);
  font-weight: 600;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(176, 141, 87, 0.4);
}
.btn-ghost:hover { color: var(--c-bronze-glow); border-color: var(--c-bronze-glow); }

.section { display: flex; flex-direction: column; gap: var(--s-4); }
.section-head { display: flex; align-items: baseline; gap: var(--s-4); border-bottom: 1px solid var(--c-line); padding-bottom: var(--s-3); }
.section-mark {
  font-size: 24px;
  color: var(--c-blood);
  letter-spacing: 0.04em;
}
.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #E8E1D4;
  margin: 0;
  letter-spacing: 0.05em;
}
.section-note { font-size: 11px; letter-spacing: 0.16em; }

.beat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.bus-table {
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
}
.bus-table-head, .bus-table-row {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 1fr 1.4fr 1.4fr;
  align-items: center;
  padding: 14px 20px;
  gap: var(--s-4);
  font-size: 12.5px;
}
.bus-table-head {
  background: var(--c-ink-3);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--c-ash-2);
  text-transform: uppercase;
  border-bottom: 1px solid var(--c-line);
}
.bus-table-row {
  border-bottom: 1px solid rgba(255,255,255,0.04);
  position: relative;
  color: #D6CFBD;
  transition: background var(--t-fast);
}
.bus-table-row::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--c);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--t-med);
}
.bus-table-row:hover { background: rgba(255,255,255,0.03); }
.bus-table-row:hover::before { transform: scaleY(1); }
.bus-table-row:last-child { border-bottom: 0; }
.bus-shot { display: flex; flex-direction: column; gap: 2px; }
.bus-shot-index { color: var(--c); font-size: 14px; font-weight: 700; }
.bus-shot-title { color: #E8E1D4; font-size: 13px; }

.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--s-6) 0 var(--s-4);
  border-top: 1px solid var(--c-line);
  margin-top: var(--s-6);
}
.foot-left { display: flex; flex-direction: column; gap: 4px; }
.foot-right { font-size: 11px; letter-spacing: 0.12em; }
</style>
