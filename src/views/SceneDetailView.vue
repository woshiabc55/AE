<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useStoryboardStore } from '@/stores/storyboard'
import ShotTable from '@/components/ShotTable.vue'
import CameraDiagram from '@/components/CameraDiagram.vue'
import PromptCard from '@/components/PromptCard.vue'

const route = useRoute()
const router = useRouter()
const store = useStoryboardStore()

const shotId = computed(() => route.params.id as string)
const shot = computed(() => store.shotById(shotId.value))
const shotIndex = computed(() => store.shots.findIndex((s) => s.id === shotId.value))
const prevId = computed(() => (shotIndex.value > 0 ? store.shots[shotIndex.value - 1].id : null))
const nextId = computed(() => (shotIndex.value < store.shots.length - 1 ? store.shots[shotIndex.value + 1].id : null))

const activeRow = ref<number | null>(null)
const activeCam = ref<number | null>(null)

const keywords = computed(() => {
  if (!shot.value) return []
  const t = shot.value.prompt
  return Array.from(new Set(t.match(/[A-Z][a-zA-Z]+/g)?.slice(0, 8) || [])).filter((w) => w.length > 3)
})

// 计算当前 hover 行的具体时间（用于 mini timecode）
const activeTimecode = computed(() => {
  if (!shot.value || activeRow.value === null) return null
  const r = shot.value.rows[activeRow.value]
  if (!r) return null
  return r.time
})
</script>

<template>
  <div v-if="!shot" class="not-found">
    <p class="serif" style="font-size:18px;">分镜不存在。</p>
    <button class="btn" @click="router.push('/')">返回总览</button>
  </div>
  <div v-else class="scene" :style="{ '--c': shot.color }">
    <header class="scene-head fade-up">
      <div class="scene-head-left">
        <div class="scene-meta mono">
          <span>SHOT {{ shot.index }} / 4</span>
          <span class="serif-divider"></span>
          <span>{{ shot.timeLabel }}</span>
          <span class="serif-divider"></span>
          <span>{{ shot.motionAxis }}</span>
        </div>
        <h1 class="scene-title display">
          <span class="scene-title-zh">分镜{{ shot.index }} · {{ shot.title }}</span>
          <span class="scene-title-en">SHOT {{ shot.index.toUpperCase() }} · {{ shot.title.toUpperCase() }}</span>
        </h1>
        <p class="scene-bus serif">动态导向总线 · <em>{{ shot.bus }}</em></p>
        <!-- Mini 时间线：分镜内分段进度 -->
        <div class="mini-bar">
          <div
            v-for="(row, i) in shot.rows"
            :key="i"
            class="mini-bar-cell"
            :class="{ active: activeRow === i }"
            :style="{ flex: 1 }"
            @mouseenter="activeRow = i"
            @mouseleave="activeRow = null"
          >
            <div class="mini-bar-fill"></div>
            <span class="mini-bar-label mono">{{ row.time }}</span>
          </div>
        </div>
        <transition name="fade">
          <div v-if="activeTimecode" class="active-timecode mono">
            <span class="at-pulse"></span>NOW · {{ activeTimecode }}
          </div>
        </transition>
      </div>
      <div class="scene-head-right">
        <RouterLink v-if="prevId" :to="`/scene/${prevId}`" class="nav-arrow">
          <span aria-hidden="true">←</span>
          <span>分镜{{ store.shotById(prevId)?.index }}</span>
        </RouterLink>
        <RouterLink v-if="nextId" :to="`/scene/${nextId}`" class="nav-arrow next">
          <span>分镜{{ store.shotById(nextId)?.index }}</span>
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </header>

    <section class="section fade-up delay-1">
      <div class="section-head">
        <span class="section-mark display">I</span>
        <h2 class="section-title serif">分镜表 · Shot Table</h2>
        <span class="section-note muted">悬停行高亮同步时间轴 · {{ shot.rows.length }} 段</span>
      </div>
      <ShotTable v-model:active="activeRow" :rows="shot.rows" :color="shot.color" />
    </section>

    <section class="section fade-up delay-2">
      <div class="section-head">
        <span class="section-mark display">II</span>
        <h2 class="section-title serif">运镜图示 · Camera Moves</h2>
        <span class="section-note muted">悬停查看运镜说明 · {{ shot.cameraMoves.length }} 种</span>
      </div>
      <CameraDiagram v-model:active="activeCam" :moves="shot.cameraMoves" :color="shot.color" />
    </section>

    <section class="section fade-up delay-3">
      <div class="section-head">
        <span class="section-mark display">III</span>
        <h2 class="section-title serif">节奏与导向</h2>
        <span class="section-note muted">Beat &amp; Guide</span>
      </div>
      <div class="meta-grid">
        <div class="meta-card">
          <div class="meta-card-label mono">BEAT SHAPE</div>
          <div class="meta-card-value serif">{{ shot.beatShape }}</div>
        </div>
        <div class="meta-card">
          <div class="meta-card-label mono">VISUAL GUIDE</div>
          <div class="meta-card-value serif">{{ shot.visualGuide }}</div>
        </div>
        <div class="meta-card">
          <div class="meta-card-label mono">PARTICLE TRAIL</div>
          <div class="meta-card-value serif spark">{{ shot.particleTrail }}</div>
        </div>
      </div>
    </section>

    <section class="section fade-up delay-4">
      <div class="section-head">
        <span class="section-mark display">IV</span>
        <h2 class="section-title serif">AI 提示词 · Prompt</h2>
        <span class="section-note muted">Runway · Pika · Sora · 已语法高亮</span>
      </div>
      <PromptCard :prompt="shot.prompt" :color="shot.color" :title="`分镜${shot.index} · ${shot.title}`" :keywords="keywords" />
    </section>
  </div>
</template>

<style scoped>
.scene { display: flex; flex-direction: column; gap: var(--s-8); }

.scene-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--s-5);
  border-bottom: 1px solid var(--c-line);
  padding-bottom: var(--s-5);
}
.scene-meta {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--c-ash);
  margin-bottom: var(--s-3);
}
.scene-title {
  margin: 0 0 var(--s-3);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.scene-title-zh {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  color: #E8E1D4;
  letter-spacing: 0.04em;
  line-height: 1;
}
.scene-title-en {
  font-size: 14px;
  font-weight: 500;
  color: var(--c);
  letter-spacing: 0.32em;
  text-shadow: 0 0 18px color-mix(in srgb, var(--c) 50%, transparent);
}
.scene-bus {
  margin: 0;
  font-size: 14px;
  color: #C8BFAE;
  max-width: 800px;
  letter-spacing: 0.04em;
}
.scene-bus em { color: var(--c-bronze-glow); font-style: normal; font-weight: 500; }

.mini-bar {
  display: flex;
  gap: 4px;
  margin-top: var(--s-4);
  max-width: 800px;
  height: 26px;
  position: relative;
}
.mini-bar-cell {
  position: relative;
  height: 100%;
  border: 1px solid var(--c-line);
  cursor: pointer;
  transition: all var(--t-fast);
  overflow: hidden;
}
.mini-bar-cell:hover,
.mini-bar-cell.active {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
}
.mini-bar-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 25%, transparent), color-mix(in srgb, var(--c) 8%, transparent));
  opacity: 0;
  transition: opacity var(--t-med);
}
.mini-bar-cell.active .mini-bar-fill { opacity: 1; }
.mini-bar-label {
  position: relative;
  z-index: 1;
  display: block;
  text-align: center;
  line-height: 24px;
  font-size: 9px;
  color: var(--c-ash);
  letter-spacing: 0.08em;
  transition: color var(--t-fast);
}
.mini-bar-cell.active .mini-bar-label { color: var(--c-bronze-glow); font-weight: 600; }

.active-timecode {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--s-3);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--c-bronze-glow);
  padding: 4px 10px;
  background: color-mix(in srgb, var(--c) 8%, transparent);
  border-left: 2px solid var(--c);
}
.at-pulse {
  width: 6px;
  height: 6px;
  background: var(--c-blood);
  border-radius: 50%;
  animation: pulseDot 1s ease-in-out infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.2); }
}
.fade-enter-active, .fade-leave-active { transition: all .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(-8px); }

.scene-head-right { display: flex; gap: var(--s-3); flex: 0 0 auto; }
.nav-arrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--c-line-strong);
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-ash-2);
  transition: all var(--t-fast);
}
.nav-arrow:hover { color: var(--c); border-color: var(--c); transform: translateY(-2px); }
.nav-arrow.next { background: color-mix(in srgb, var(--c) 12%, transparent); }

.section { display: flex; flex-direction: column; gap: var(--s-4); }
.section-head { display: flex; align-items: baseline; gap: var(--s-4); border-bottom: 1px solid var(--c-line); padding-bottom: var(--s-3); }
.section-mark { font-size: 24px; color: var(--c-blood); }
.section-title { font-size: 20px; margin: 0; color: #E8E1D4; letter-spacing: 0.05em; }
.section-note { font-size: 11px; letter-spacing: 0.16em; }

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}
.meta-card {
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  padding: var(--s-4) var(--s-4);
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}
.meta-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 3px; height: 100%;
  background: var(--c);
}
.meta-card-label {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--c-ash);
  margin-bottom: var(--s-3);
}
.meta-card-value {
  font-size: 16px;
  color: #E8E1D4;
  letter-spacing: 0.04em;
}
.meta-card-value.spark { color: var(--c-spark-bright); }

.not-found { padding: var(--s-8) 0; text-align: center; }
.not-found .btn {
  margin-top: var(--s-4);
  padding: 10px 20px;
  background: var(--c-bronze);
  border: 0;
  color: var(--c-ink);
  font-family: var(--f-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
</style>
