<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStoryboardStore } from '@/stores/storyboard'
import { useRouter } from 'vue-router'

const store = useStoryboardStore()
const router = useRouter()

const hoverTime = ref<number | null>(null)
const tooltipX = ref(0)
const tooltipVisible = ref(false)

const shotAtTime = computed(() => (t: number) => {
  return store.shots.find((s) => t >= s.range[0] && t < s.range[1])
})

function go(id: string) {
  router.push(`/scene/${id}`)
}

function onRulerMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const t = Math.max(0, Math.min(60, (x / rect.width) * 60))
  hoverTime.value = t
  tooltipX.value = x
  tooltipVisible.value = true
}
function onRulerLeave() { tooltipVisible.value = false; hoverTime.value = null }

function formatTime(t: number) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  const cs = Math.floor((t * 10) % 10)
  return `${m}:${s.toString().padStart(2, '0')}.${cs}`
}
</script>

<template>
  <div class="timeline">
    <div class="timeline-axis">
      <span class="axis-tick" v-for="n in 13" :key="n" :style="{ left: ((n - 1) * (100 / 12)) + '%' }">
        <span class="axis-tick-mark"></span>
        <span class="axis-tick-label">{{ (n - 1) * 5 }}s</span>
      </span>
    </div>

    <div class="ruler-hover" @mousemove="onRulerMove" @mouseleave="onRulerLeave">
      <div class="ruler-hover-bar">
        <div
          v-if="tooltipVisible && hoverTime !== null"
          class="ruler-cursor"
          :style="{ left: tooltipX + 'px' }"
        ></div>
        <div
          v-if="tooltipVisible && hoverTime !== null"
          class="ruler-tooltip"
          :style="{ left: tooltipX + 'px' }"
        >
          <div class="ruler-tooltip-time mono">{{ formatTime(hoverTime) }}</div>
          <div v-if="shotAtTime(hoverTime)" class="ruler-tooltip-shot" :style="{ '--c': shotAtTime(hoverTime)!.color }">
            <span class="mono">SHOT {{ shotAtTime(hoverTime)!.index }}</span>
            <span class="serif">·</span>
            <span class="serif">{{ shotAtTime(hoverTime)!.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="timeline-bar">
      <button
        v-for="shot in store.shots"
        :key="shot.id"
        class="shot-cell"
        :style="{
          width: ((shot.range[1] - shot.range[0]) / 60 * 100) + '%',
          '--c-shot': shot.color
        }"
        @click="go(shot.id)"
      >
        <div class="shot-cell-inner">
          <div class="shot-cell-time serif">{{ shot.timeLabel }}</div>
          <div class="shot-cell-title">
            <span class="shot-cell-index display">分镜{{ shot.index }}</span>
            <span class="shot-cell-name">{{ shot.title }}</span>
          </div>
          <div class="shot-cell-axis mono">{{ shot.motionAxis }}</div>
        </div>
        <div class="scan" aria-hidden="true"></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  margin: var(--s-5) 0 var(--s-6);
  position: relative;
}
.timeline-axis {
  position: relative;
  height: 18px;
  margin-bottom: 4px;
}
.axis-tick {
  position: absolute;
  transform: translateX(-50%);
  top: 0;
}
.axis-tick-mark {
  display: block;
  width: 1px;
  height: 8px;
  background: var(--c-line-strong);
  margin: 0 auto;
}
.axis-tick-label {
  display: block;
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--c-ash);
  margin-top: 2px;
}

.ruler-hover {
  position: relative;
  height: 16px;
  margin-bottom: 4px;
  cursor: crosshair;
}
.ruler-hover-bar {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(176, 141, 87, 0.06), transparent);
  border-top: 1px dashed var(--c-line);
  border-bottom: 1px dashed var(--c-line);
}
.ruler-cursor {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 1px;
  background: var(--c-bronze-glow);
  box-shadow: 0 0 6px var(--c-bronze-glow);
  transform: translateX(-0.5px);
  pointer-events: none;
}
.ruler-tooltip {
  position: absolute;
  top: -8px;
  transform: translateX(-50%);
  background: var(--c-ink-3);
  border: 1px solid var(--c-bronze);
  padding: 6px 10px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(50% + 6px) calc(100% - 6px), 50% 100%, calc(50% - 6px) calc(100% - 6px), 0 calc(100% - 6px));
}
.ruler-tooltip-time {
  font-size: 14px;
  color: var(--c-bronze-glow);
  font-weight: 600;
  letter-spacing: 0.05em;
}
.ruler-tooltip-shot {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  font-size: 10px;
  color: #E8E1D4;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--c) 75%, white);
}

.timeline-bar {
  display: flex;
  width: 100%;
  height: 116px;
  border: 1px solid var(--c-line);
  background: var(--c-ink-2);
  box-shadow: var(--shadow-1);
}
.shot-cell {
  position: relative;
  background: linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.55));
  border: 0;
  border-right: 1px solid rgba(255,255,255,0.04);
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  padding: 0;
  transition: transform var(--t-fast);
}
.shot-cell:first-child { clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%); padding-right: 22px; }
.shot-cell:last-child  { clip-path: polygon(0 0, 100% 0, 100% 100%, 22px 100%); padding-left: 22px; border-right: 0; }
.shot-cell:not(:first-child):not(:last-child) { clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 22px 100%); padding: 0 22px; }

.shot-cell:hover { transform: translateY(-2px); }
.shot-cell:hover .scan { transform: translateX(0); }

.shot-cell-inner {
  position: relative;
  z-index: 2;
  padding: 14px 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c-shot) 18%, transparent), transparent 60%);
}

.shot-cell-time {
  font-size: 11px;
  color: color-mix(in srgb, var(--c-shot) 80%, white);
  letter-spacing: 0.1em;
}
.shot-cell-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.shot-cell-index {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
  text-shadow: 0 0 16px color-mix(in srgb, var(--c-shot) 60%, transparent);
}
.shot-cell-name {
  font-family: var(--f-serif);
  font-size: 13px;
  color: #E8E1D4;
}
.shot-cell-axis {
  font-size: 9px;
  color: var(--c-ash-2);
  letter-spacing: 0.08em;
}

.scan {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--c-shot) 30%, transparent), transparent);
  transform: translateX(-100%);
  transition: transform 0.7s ease;
  pointer-events: none;
}
</style>
