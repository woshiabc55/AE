<script setup lang="ts">
import { useStoryboardStore } from '@/stores/storyboard'
import ParticleCanvas from '@/components/ParticleCanvas.vue'

const store = useStoryboardStore()
</script>

<template>
  <div class="particles">
    <header class="head fade-up">
      <div class="head-meta mono">PARTICLE TRAILS · 6 TYPES</div>
      <h1 class="head-title display">粒子轨迹演示</h1>
      <p class="head-sub serif">按分镜脚本中的 6 类粒子轨迹，可在 Canvas 中循环预览，用于校准提示词细节。</p>
    </header>

    <section class="grid">
      <article v-for="p in store.particles" :key="p.id" class="cell">
        <div class="cell-head">
          <div>
            <div class="cell-trail mono">{{ p.trail }}</div>
            <h3 class="cell-name serif">{{ p.name }}</h3>
          </div>
          <span class="cell-id mono">#{{ p.id.toUpperCase() }}</span>
        </div>
        <div class="cell-canvas">
          <ParticleCanvas :type="(p.id as any)" />
        </div>
        <p class="cell-spec">{{ p.spec }}</p>
      </article>
    </section>
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
.head-sub { font-size: 16px; color: #C8BFAE; margin: 0; max-width: 720px; }

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
  transition: border-color var(--t-fast), transform var(--t-fast);
}
.cell:hover {
  border-color: var(--c-bronze);
  transform: translateY(-3px);
}
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
.cell-spec {
  margin: 0;
  padding: 14px 18px;
  font-size: 12.5px;
  color: #C8BFAE;
  line-height: 1.7;
}
</style>
