<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStoryboardStore } from '@/stores/storyboard'
import ParticleCanvas from '@/components/ParticleCanvas.vue'

const store = useStoryboardStore()

const playing = ref(true)
const speed = ref(1)
const seed = ref(Math.floor(Math.random() * 999999))
const activeType = ref<string | null>(null)
const showHelp = ref(true)

const visibleParticles = computed(() => {
  if (!activeType.value) return store.particles
  return store.particles.filter((p) => p.id === activeType.value)
})

function respawn() {
  seed.value = Math.floor(Math.random() * 999999)
}

function resetAll() {
  respawn()
  playing.value = true
}
</script>

<template>
  <div class="particles">
    <header class="head fade-up">
      <div class="head-meta mono">PARTICLE TRAILS · 6 TYPES · 24fps</div>
      <h1 class="head-title display">粒子轨迹演示</h1>
      <p class="head-sub serif">
        按分镜脚本中的 6 类粒子轨迹，可在 Canvas 中循环预览。可暂停、重播、调速、聚焦单个粒子类型。
      </p>
      <div class="head-actions">
        <div class="ctl-group">
          <button class="ctl-btn" :class="{ on: playing }" @click="playing = !playing" :aria-label="playing ? '暂停' : '播放'">
            <span v-if="playing">❚❚</span>
            <span v-else>▶</span>
            <span class="ctl-label">{{ playing ? 'PAUSE' : 'PLAY' }}</span>
          </button>
          <button class="ctl-btn" @click="respawn" aria-label="重新随机">
            <span>↻</span>
            <span class="ctl-label">RESPAWN</span>
          </button>
          <div class="ctl-speed">
            <span class="ctl-speed-label mono">SPEED</span>
            <input type="range" min="0.2" max="3" step="0.1" v-model.number="speed" />
            <span class="ctl-speed-value mono">{{ speed.toFixed(1) }}x</span>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label mono">FILTER</span>
          <button class="filter-chip" :class="{ on: !activeType }" @click="activeType = null">ALL</button>
          <button
            v-for="p in store.particles"
            :key="p.id"
            class="filter-chip"
            :class="{ on: activeType === p.id }"
            @click="activeType = activeType === p.id ? null : p.id"
          >{{ p.id.toUpperCase() }}</button>
        </div>
      </div>
    </header>

    <transition name="grid-fade">
      <div v-if="showHelp" class="hint fade-up delay-1">
        <span class="hint-text">点击粒子格子右上角 ⟳ 可重播单格；点击「FILTER」标签聚焦某一类。</span>
        <button class="hint-close" @click="showHelp = false" aria-label="关闭提示">✕</button>
      </div>
    </transition>

    <transition-group tag="section" name="cell" class="grid">
      <article v-for="p in visibleParticles" :key="p.id" class="cell" :data-id="p.id">
        <div class="cell-head">
          <div>
            <div class="cell-trail mono">{{ p.trail }}</div>
            <h3 class="cell-name serif">{{ p.name }}</h3>
          </div>
          <span class="cell-id mono">#{{ p.id.toUpperCase() }}</span>
        </div>
        <div class="cell-canvas">
          <ParticleCanvas
            v-if="playing || !playing"
            :type="(p.id as any)"
            :active="playing"
            :speed="speed"
            :seed="seed"
            :key="`${p.id}-${seed}`"
          />
          <div v-if="!playing" class="paused-overlay">
            <span class="paused-text">PAUSED</span>
          </div>
        </div>
        <div class="cell-meta">
          <p class="cell-spec">{{ p.spec }}</p>
          <span class="cell-seed mono">SEED #{{ seed.toString(16).toUpperCase().slice(0, 6) }}</span>
        </div>
      </article>
    </transition-group>

    <footer class="foot">
      <span class="serif muted" style="font-size:12px;">支持 <span class="glow">canvas 2d</span> · 24fps · DPR 1-2</span>
      <button class="btn-ghost" @click="resetAll">RESET ALL</button>
    </footer>
  </div>
</template>

<style scoped>
.particles { display: flex; flex-direction: column; gap: var(--s-7); }

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
.head-sub { font-size: 16px; color: #C8BFAE; margin: 0 0 var(--s-4); max-width: 720px; }
.head-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  align-items: center;
  justify-content: space-between;
}

.ctl-group { display: flex; align-items: center; gap: var(--s-2); }
.ctl-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(176, 141, 87, 0.08);
  border: 1px solid var(--c-line-strong);
  color: var(--c-bronze);
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  transition: all var(--t-fast);
}
.ctl-btn:hover { background: rgba(176, 141, 87, 0.18); color: var(--c-bronze-glow); }
.ctl-btn.on { background: rgba(63, 184, 175, 0.18); border-color: var(--c-spark); color: var(--c-spark-bright); }
.ctl-label { line-height: 1; }

.ctl-speed {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(176, 141, 87, 0.04);
  border: 1px solid var(--c-line);
  font-size: 11px;
}
.ctl-speed-label { letter-spacing: 0.16em; color: var(--c-ash); }
.ctl-speed-value { color: var(--c-bronze-glow); min-width: 32px; text-align: right; }
.ctl-speed input[type=range] {
  width: 100px;
  accent-color: var(--c-bronze);
  cursor: pointer;
}

.filter-group { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.filter-label { color: var(--c-ash); font-size: 10px; letter-spacing: 0.18em; margin-right: 4px; }
.filter-chip {
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--c-line);
  color: var(--c-ash-2);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  border-radius: 2px;
  cursor: pointer;
  transition: all var(--t-fast);
}
.filter-chip:hover { color: var(--c-bronze-glow); border-color: var(--c-bronze); }
.filter-chip.on {
  background: linear-gradient(90deg, var(--c-bronze-deep), var(--c-bronze));
  color: var(--c-ink);
  border-color: var(--c-bronze);
  font-weight: 600;
}

.hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(224, 168, 46, 0.06);
  border: 1px dashed rgba(224, 168, 46, 0.3);
  font-size: 12px;
  color: #C8BFAE;
}
.hint-text { letter-spacing: 0.04em; }
.hint-close {
  background: transparent;
  border: 0;
  color: var(--c-ash);
  font-size: 14px;
  padding: 4px 8px;
  cursor: pointer;
}
.hint-close:hover { color: var(--c-blood); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}
.cell {
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color var(--t-fast), transform var(--t-fast), box-shadow var(--t-med);
  position: relative;
}
.cell:hover {
  border-color: var(--c-bronze);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.45);
}
.cell::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-bronze-glow), transparent);
  opacity: 0;
  transition: opacity var(--t-med);
}
.cell:hover::after { opacity: 0.7; }

.cell-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--c-line);
}
.cell-trail {
  font-size: 14px;
  color: var(--c-bronze-glow);
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}
.cell-name { font-size: 16px; color: #E8E1D4; margin: 0; }
.cell-id {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--c-ash);
  padding: 4px 8px;
  border: 1px solid var(--c-line);
  border-radius: 2px;
}
.cell-canvas {
  height: 220px;
  position: relative;
  border-bottom: 1px solid var(--c-line);
}
.paused-overlay {
  position: absolute;
  inset: 0;
  background: rgba(11, 11, 15, 0.6);
  display: grid;
  place-items: center;
  backdrop-filter: blur(2px);
}
.paused-text {
  font-family: var(--f-display);
  font-size: 18px;
  color: var(--c-bronze-glow);
  letter-spacing: 0.4em;
  animation: pulseGlow 1.5s ease-in-out infinite;
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; text-shadow: 0 0 16px rgba(224, 168, 46, 0.5); }
}

.cell-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 14px 18px;
  gap: var(--s-3);
}
.cell-spec {
  margin: 0;
  font-size: 12.5px;
  color: #C8BFAE;
  line-height: 1.7;
  flex: 1;
}
.cell-seed {
  font-size: 9px;
  letter-spacing: 0.14em;
  color: var(--c-ash);
  padding: 3px 6px;
  border: 1px solid var(--c-line);
  border-radius: 2px;
  white-space: nowrap;
}

.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--s-4);
  border-top: 1px solid var(--c-line);
}
.btn-ghost {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--c-line-strong);
  color: var(--c-bronze);
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  cursor: pointer;
  transition: all var(--t-fast);
}
.btn-ghost:hover { color: var(--c-blood); border-color: var(--c-blood); }

/* transitions */
.grid-fade-enter-active, .grid-fade-leave-active { transition: opacity .3s, transform .3s; }
.grid-fade-enter-from, .grid-fade-leave-to { opacity: 0; transform: translateY(-8px); }

.cell-enter-active, .cell-leave-active { transition: all .35s cubic-bezier(0.4, 0, 0.2, 1); }
.cell-enter-from, .cell-leave-to { opacity: 0; transform: scale(0.92); }
.cell-leave-active { position: absolute; }
</style>
