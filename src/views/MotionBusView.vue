<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStoryboardStore } from '@/stores/storyboard'
import { RouterLink } from 'vue-router'

const store = useStoryboardStore()
const hoverShotId = ref<string | null>(null)
const playProgress = ref(0)
let raf = 0
let last = 0

function beatPath(shape: string): string {
  switch (shape) {
    case '双波峰（蓄力→释放→二次释放）':
      return 'M 0 60 L 80 60 L 100 18 L 140 75 L 180 22 L 240 70 L 320 50 L 400 50'
    case '波浪形（扩散→交汇→螺旋→跃升→凝聚）':
      return 'M 0 60 C 50 20, 100 100, 150 50 S 250 10, 300 60 S 380 100, 400 50 L 400 60'
    case 'V型反弹（上升→坠毁→挣扎→爆发）':
      return 'M 0 25 L 100 25 L 180 95 L 260 95 L 340 30 L 400 30'
    case '螺旋上升（蓄势→爆发→绝对静止）':
    default:
      return 'M 0 100 C 60 100, 80 80, 120 80 S 200 60, 240 60 S 320 30, 400 18'
  }
}

// 让波形在屏幕中流动
let playStart = 0
function loop(t: number) {
  if (!last) { last = t; playStart = t }
  const dt = t - last
  last = t
  const phase = ((t - playStart) % 12000) / 12000
  playProgress.value = phase
  raf = requestAnimationFrame(loop)
}
onMounted(() => { raf = requestAnimationFrame(loop) })
onBeforeUnmount(() => cancelAnimationFrame(raf))

// 当前 hover 的分镜
const hoverShot = computed(() => hoverShotId.value ? store.shotById(hoverShotId.value) : null)
</script>

<template>
  <div class="motion-bus">
    <header class="head fade-up">
      <div class="head-meta mono">MOTION BUS · 60s</div>
      <h1 class="head-title display">四镜动态总线</h1>
      <p class="head-sub serif">横向 60 格时间线 + 节奏波形 + 视觉导向 + 粒子主轨迹的四线对照视图。波形会持续流动，悬停分镜段可高亮所有相关行。</p>
    </header>

    <section class="section fade-up delay-1">
      <div class="section-head">
        <span class="section-mark display">I</span>
        <h2 class="section-title serif">时间线 · Timeline</h2>
        <span class="section-note muted">悬停分镜段高亮 · 0 — 60s</span>
      </div>

      <div class="timeline">
        <div class="timeline-ruler">
          <span v-for="n in 13" :key="n" class="ruler-tick" :style="{ left: ((n - 1) * (100 / 12)) + '%' }">
            <span class="ruler-mark"></span>
            <span class="ruler-label">{{ (n - 1) * 5 }}s</span>
          </span>
        </div>

        <div class="timeline-track" v-for="(row, ri) in [
          { label: '分镜分段', kind: 'shots' },
          { label: '动作轴', kind: 'axis' },
          { label: '视觉导向', kind: 'guide' },
          { label: '节奏波形', kind: 'beat' },
          { label: '粒子主轨迹', kind: 'particle' }
        ]" :key="ri">
          <div class="timeline-track-label mono">{{ row.label }}</div>
          <div class="timeline-track-content">
            <template v-if="row.kind === 'shots'">
              <RouterLink
                v-for="shot in store.shots"
                :key="shot.id"
                :to="`/scene/${shot.id}`"
                class="track-shot"
                :class="{ dim: hoverShotId && hoverShotId !== shot.id }"
                :style="{
                  left: (shot.range[0] / 60 * 100) + '%',
                  width: ((shot.range[1] - shot.range[0]) / 60 * 100) + '%',
                  '--c': shot.color
                }"
                @mouseenter="hoverShotId = shot.id"
                @mouseleave="hoverShotId = null"
              >
                <span class="track-shot-name serif">分镜{{ shot.index }} · {{ shot.title }}</span>
              </RouterLink>
            </template>

            <template v-if="row.kind === 'axis'">
              <div
                v-for="shot in store.shots"
                :key="shot.id"
                class="track-axis"
                :class="{ dim: hoverShotId && hoverShotId !== shot.id, on: hoverShotId === shot.id }"
                :style="{
                  left: (shot.range[0] / 60 * 100) + '%',
                  width: ((shot.range[1] - shot.range[0]) / 60 * 100) + '%',
                  '--c': shot.color
                }"
              >
                <span class="track-axis-text mono">{{ shot.motionAxis }}</span>
              </div>
            </template>

            <template v-if="row.kind === 'guide'">
              <div
                v-for="shot in store.shots"
                :key="shot.id"
                class="track-guide"
                :class="{ dim: hoverShotId && hoverShotId !== shot.id }"
                :style="{
                  left: (shot.range[0] / 60 * 100) + '%',
                  width: ((shot.range[1] - shot.range[0]) / 60 * 100) + '%',
                  '--c': shot.color
                }"
              >
                <span class="track-guide-text">{{ shot.visualGuide }}</span>
              </div>
            </template>

            <template v-if="row.kind === 'beat'">
              <svg
                v-for="shot in store.shots"
                :key="shot.id"
                class="track-beat"
                :class="{ dim: hoverShotId && hoverShotId !== shot.id, on: hoverShotId === shot.id }"
                :viewBox="`${shot.range[0] * (400/60)} 0 ${(shot.range[1]-shot.range[0]) * (400/60)} 100`"
                preserveAspectRatio="none"
                :style="{
                  left: (shot.range[0] / 60 * 100) + '%',
                  width: ((shot.range[1] - shot.range[0]) / 60 * 100) + '%',
                  '--c': shot.color
                }"
              >
                <line :x1="0" :y1="50" :x2="(shot.range[1]-shot.range[0]) * (400/60)" :y2="50" stroke="currentColor" stroke-opacity="0.18" stroke-dasharray="2 4" />
                <path :d="beatPath(shot.beatShape)" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" />
                <!-- 流动扫描线 -->
                <line
                  :x1="(shot.range[0] + (shot.range[1]-shot.range[0]) * playProgress) * (400/60)"
                  :y1="0"
                  :x2="(shot.range[0] + (shot.range[1]-shot.range[0]) * playProgress) * (400/60)"
                  :y2="100"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-opacity="0.85"
                />
                <circle
                  :cx="(shot.range[0] + (shot.range[1]-shot.range[0]) * playProgress) * (400/60)"
                  :cy="50"
                  r="6"
                  fill="currentColor"
                  fill-opacity="0.15"
                />
              </svg>
            </template>

            <template v-if="row.kind === 'particle'">
              <div
                v-for="shot in store.shots"
                :key="shot.id"
                class="track-particle"
                :class="{ dim: hoverShotId && hoverShotId !== shot.id }"
                :style="{
                  left: (shot.range[0] / 60 * 100) + '%',
                  width: ((shot.range[1] - shot.range[0]) / 60 * 100) + '%',
                  '--c': shot.color
                }"
              >
                <span class="track-particle-text spark mono">{{ shot.particleTrail }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <transition name="shot-info">
        <div v-if="hoverShot" class="shot-info" :style="{ '--c': hoverShot.color }">
          <div class="shot-info-bar"></div>
          <div class="shot-info-content">
            <div class="shot-info-head">
              <span class="mono shot-info-num">SHOT {{ hoverShot.index }}</span>
              <span class="serif shot-info-title">{{ hoverShot.title }}</span>
            </div>
            <div class="shot-info-bus">{{ hoverShot.bus }}</div>
            <RouterLink :to="`/scene/${hoverShot.id}`" class="shot-info-link">查看详情 →</RouterLink>
          </div>
        </div>
      </transition>
    </section>

    <section class="section fade-up delay-2">
      <div class="section-head">
        <span class="section-mark display">II</span>
        <h2 class="section-title serif">分镜对照表 · Comparison</h2>
        <span class="section-note muted">4 shots · 5 维度</span>
      </div>
      <div class="cmp-table">
        <div class="cmp-table-head">
          <span>分镜</span>
          <span>主导运动轴</span>
          <span>视觉导向</span>
          <span>节奏波形</span>
          <span>粒子主轨迹</span>
        </div>
        <div v-for="shot in store.shots" :key="shot.id" class="cmp-table-row" :style="{ '--c': shot.color }">
          <div class="cmp-shot">
            <span class="cmp-shot-index display">分镜{{ shot.index }}</span>
            <span class="cmp-shot-title serif">{{ shot.title }}</span>
            <span class="cmp-shot-time mono">{{ shot.timeLabel }}</span>
          </div>
          <span class="mono">{{ shot.motionAxis }}</span>
          <span>{{ shot.visualGuide }}</span>
          <span>{{ shot.beatShape }}</span>
          <span class="spark">{{ shot.particleTrail }}</span>
        </div>
      </div>
    </section>

    <section class="section fade-up delay-3">
      <div class="section-head">
        <span class="section-mark display">III</span>
        <h2 class="section-title serif">动态导向总线 · Bus Line</h2>
        <span class="section-note muted">从起点到终点的运动链</span>
      </div>
      <div class="bus-chain">
        <div v-for="(shot, i) in store.shots" :key="shot.id" class="bus-chain-node" :style="{ '--c': shot.color }">
          <div class="bus-chain-num display">0{{ i + 1 }}</div>
          <div class="bus-chain-title serif">分镜{{ shot.index }} · {{ shot.title }}</div>
          <div class="bus-chain-bus">{{ shot.bus }}</div>
          <div class="bus-chain-dots" aria-hidden="true">
            <span v-for="d in 5" :key="d" :style="{ animationDelay: (d * 0.15) + 's' }"></span>
          </div>
          <svg v-if="i < store.shots.length - 1" class="bus-chain-arrow" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M 0 20 L 30 20 M 22 12 L 30 20 L 22 28" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.motion-bus { display: flex; flex-direction: column; gap: var(--s-8); }

.head { border-bottom: 1px solid var(--c-line); padding-bottom: var(--s-5); }
.head-meta { font-size: 11px; letter-spacing: 0.2em; color: var(--c-ash); margin-bottom: var(--s-3); }
.head-title {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  color: var(--c-bronze-glow);
  margin: 0 0 var(--s-3);
  letter-spacing: 0.04em;
  text-shadow: 0 0 32px rgba(224, 168, 46, 0.25);
}
.head-sub { font-size: 16px; color: #C8BFAE; margin: 0; max-width: 720px; }

.section { display: flex; flex-direction: column; gap: var(--s-4); }
.section-head { display: flex; align-items: baseline; gap: var(--s-4); border-bottom: 1px solid var(--c-line); padding-bottom: var(--s-3); }
.section-mark { font-size: 24px; color: var(--c-blood); }
.section-title { font-size: 20px; margin: 0; color: #E8E1D4; letter-spacing: 0.05em; }
.section-note { font-size: 11px; letter-spacing: 0.16em; }

.timeline {
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  padding: 12px 0;
}
.timeline-ruler {
  position: relative;
  height: 20px;
  margin: 0 0 8px 100px;
  border-bottom: 1px dashed var(--c-line);
}
.ruler-tick {
  position: absolute;
  transform: translateX(-50%);
  top: 0;
}
.ruler-mark { display: block; width: 1px; height: 6px; background: var(--c-line-strong); margin: 0 auto; }
.ruler-label { display: block; font-family: var(--f-mono); font-size: 9px; color: var(--c-ash); margin-top: 2px; letter-spacing: 0.08em; }

.timeline-track {
  display: flex;
  align-items: stretch;
  height: 36px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.timeline-track:last-child { border-bottom: 0; }
.timeline-track-label {
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--c-ash-2);
  text-transform: uppercase;
  border-right: 1px solid var(--c-line);
  background: var(--c-ink-3);
}
.timeline-track-content {
  position: relative;
  flex: 1;
  background:
    repeating-linear-gradient(90deg, transparent 0, transparent calc(100% / 12 - 1px), rgba(255,255,255,0.03) calc(100% / 12 - 1px), rgba(255,255,255,0.03) calc(100% / 12));
}

.track-shot {
  position: absolute;
  top: 4px;
  bottom: 4px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 28%, transparent), color-mix(in srgb, var(--c) 10%, transparent));
  border: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #E8E1D4;
  font-size: 11px;
  letter-spacing: 0.04em;
  transition: transform var(--t-fast), opacity var(--t-fast);
  overflow: hidden;
}
.track-shot:hover { transform: scale(1.04); z-index: 2; box-shadow: 0 0 16px color-mix(in srgb, var(--c) 50%, transparent); }
.track-shot.dim { opacity: 0.3; }
.track-shot-name { white-space: nowrap; }

.track-axis {
  position: absolute;
  top: 4px;
  bottom: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-left: 2px solid var(--c);
  background: color-mix(in srgb, var(--c) 5%, transparent);
  transition: opacity var(--t-fast), background var(--t-fast);
}
.track-axis.on { background: color-mix(in srgb, var(--c) 18%, transparent); }
.track-axis.dim { opacity: 0.3; }
.track-axis-text {
  font-size: 10px;
  color: color-mix(in srgb, var(--c) 70%, white);
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-guide {
  position: absolute;
  top: 4px;
  bottom: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--c) 12%, transparent));
  border-bottom: 1px dashed color-mix(in srgb, var(--c) 50%, transparent);
  transition: opacity var(--t-fast);
}
.track-guide.dim { opacity: 0.3; }
.track-guide-text { font-family: var(--f-serif); font-size: 12px; color: #E8E1D4; letter-spacing: 0.06em; }

.track-beat {
  position: absolute;
  top: 4px;
  bottom: 4px;
  color: var(--c);
  pointer-events: none;
  transition: opacity var(--t-fast);
}
.track-beat.dim { opacity: 0.3; }
.track-beat.on { filter: drop-shadow(0 0 6px color-mix(in srgb, var(--c) 60%, transparent)); }

.track-particle {
  position: absolute;
  top: 4px;
  bottom: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--c) 12%, transparent), transparent 70%);
  transition: opacity var(--t-fast);
}
.track-particle.dim { opacity: 0.3; }
.track-particle-text {
  font-size: 10px;
  color: var(--c-spark-bright);
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shot-info {
  position: relative;
  background: linear-gradient(90deg, color-mix(in srgb, var(--c) 10%, var(--c-ink-2)) 0%, var(--c-ink-2) 100%);
  border: 1px solid color-mix(in srgb, var(--c) 35%, var(--c-line));
  padding: var(--s-3) var(--s-4);
  display: flex;
  align-items: center;
  gap: var(--s-4);
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
}
.shot-info-bar {
  width: 4px;
  align-self: stretch;
  background: var(--c);
  box-shadow: 0 0 12px var(--c);
}
.shot-info-content { flex: 1; }
.shot-info-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.shot-info-num { font-size: 11px; color: var(--c); letter-spacing: 0.2em; font-weight: 600; }
.shot-info-title { font-size: 16px; color: #E8E1D4; }
.shot-info-bus { font-size: 12px; color: #C8BFAE; letter-spacing: 0.04em; }
.shot-info-link {
  display: inline-block;
  margin-top: 4px;
  font-family: var(--f-mono);
  font-size: 11px;
  color: var(--c);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-bottom: 1px dashed var(--c);
  padding-bottom: 2px;
  transition: all var(--t-fast);
}
.shot-info-link:hover { color: var(--c-bronze-glow); }
.shot-info-enter-active, .shot-info-leave-active { transition: all .3s cubic-bezier(0.4, 0, 0.2, 1); }
.shot-info-enter-from, .shot-info-leave-to { opacity: 0; transform: translateY(-6px); }

.cmp-table {
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
}
.cmp-table-head, .cmp-table-row {
  display: grid;
  grid-template-columns: 1.4fr 1.1fr 0.9fr 1.4fr 1.4fr;
  gap: var(--s-3);
  align-items: center;
  padding: 14px 20px;
  font-size: 12.5px;
}
.cmp-table-head {
  background: var(--c-ink-3);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--c-ash-2);
  text-transform: uppercase;
  border-bottom: 1px solid var(--c-line);
}
.cmp-table-row {
  border-bottom: 1px solid rgba(255,255,255,0.04);
  position: relative;
  color: #D6CFBD;
  transition: background var(--t-fast);
}
.cmp-table-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--c); }
.cmp-table-row:hover { background: rgba(255,255,255,0.03); }
.cmp-table-row:last-child { border-bottom: 0; }
.cmp-shot { display: flex; flex-direction: column; gap: 2px; }
.cmp-shot-index { color: var(--c); font-size: 16px; font-weight: 700; }
.cmp-shot-title { color: #E8E1D4; font-size: 13px; }
.cmp-shot-time { color: var(--c-ash); font-size: 10px; letter-spacing: 0.1em; }

.bus-chain {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  padding: var(--s-5);
  overflow-x: auto;
}
.bus-chain-node {
  flex: 1;
  min-width: 220px;
  padding: var(--s-4) var(--s-4) var(--s-3);
  background: color-mix(in srgb, var(--c) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}
.bus-chain-num {
  font-size: 22px;
  color: var(--c);
  font-weight: 700;
}
.bus-chain-title { font-size: 14px; color: #E8E1D4; }
.bus-chain-bus { font-size: 12px; color: #C8BFAE; line-height: 1.6; }

.bus-chain-dots {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}
.bus-chain-dots span {
  width: 6px;
  height: 6px;
  background: var(--c);
  border-radius: 50%;
  animation: dotPulse 1.2s ease-in-out infinite;
}
@keyframes dotPulse {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.bus-chain-arrow {
  flex: 0 0 40px;
  align-self: center;
  color: var(--c-ash);
}
</style>
