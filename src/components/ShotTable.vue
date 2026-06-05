<script setup lang="ts">
import type { ShotRow } from '@/stores/storyboard'

defineProps<{ rows: ShotRow[]; color: string }>()
const active = defineModel<number | null>('active', { default: null })
</script>

<template>
  <div class="shot-table-wrap" :style="{ '--c': color }">
    <div class="shot-table-header">
      <span class="col col-time">时间</span>
      <span class="col">动态标注</span>
      <span class="col">视觉导向</span>
      <span class="col col-content">画面内容</span>
      <span class="col col-fx">特效 / 粒子轨迹</span>
    </div>
    <div class="shot-table-body">
      <div
        class="shot-table-row"
        v-for="(row, i) in rows"
        :key="i"
        :class="{ active: active === i }"
        @mouseenter="active = i"
        @mouseleave="active = null"
      >
        <div class="col col-time">
          <span class="time-pill mono">{{ row.time }}</span>
        </div>
        <div class="col">
          <span class="action-text">{{ row.action }}</span>
        </div>
        <div class="col">
          <span class="visual-text">{{ row.visual }}</span>
        </div>
        <div class="col col-content">
          <span class="content-text">{{ row.content }}</span>
        </div>
        <div class="col col-fx">
          <span class="fx-text">{{ row.fx }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shot-table-wrap {
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  border-radius: 4px;
  overflow: hidden;
}
.shot-table-header, .shot-table-row {
  display: grid;
  grid-template-columns: 100px 1.1fr 1.1fr 1.3fr 1.6fr;
  gap: 0;
  align-items: stretch;
}
.shot-table-header {
  background: linear-gradient(90deg, color-mix(in srgb, var(--c) 22%, var(--c-ink-3)) 0%, var(--c-ink-3) 100%);
  border-bottom: 1px solid var(--c-line-strong);
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--c) 75%, white);
}
.shot-table-header .col {
  padding: 14px 18px;
  border-right: 1px solid rgba(255,255,255,0.04);
}
.shot-table-header .col:last-child { border-right: 0; }

.shot-table-row {
  border-bottom: 1px solid rgba(255,255,255,0.04);
  position: relative;
  transition: background var(--t-fast);
}
.shot-table-row:last-child { border-bottom: 0; }
.shot-table-row:hover,
.shot-table-row.active {
  background: color-mix(in srgb, var(--c) 8%, transparent);
}
.shot-table-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--c);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--t-med);
  box-shadow: 0 0 12px color-mix(in srgb, var(--c) 50%, transparent);
}
.shot-table-row:hover::before,
.shot-table-row.active::before { transform: scaleY(1); }

.col {
  padding: 14px 16px;
  border-right: 1px solid rgba(255,255,255,0.03);
  font-size: 12.5px;
  line-height: 1.55;
  color: #D6CFBD;
}
.col:last-child { border-right: 0; }
.col-time { display: flex; align-items: center; }
.time-pill {
  display: inline-block;
  padding: 4px 8px;
  background: color-mix(in srgb, var(--c) 20%, transparent);
  color: color-mix(in srgb, var(--c) 80%, white);
  border: 1px solid color-mix(in srgb, var(--c) 35%, transparent);
  border-radius: 2px;
  font-size: 11px;
  letter-spacing: 0.05em;
  font-weight: 500;
  transition: all var(--t-fast);
}
.shot-table-row:hover .time-pill,
.shot-table-row.active .time-pill {
  background: var(--c);
  color: var(--c-ink);
  font-weight: 600;
}
.action-text { color: #E8E1D4; font-weight: 500; }
.visual-text { color: color-mix(in srgb, var(--c) 70%, white); }
.content-text { color: #C8BFAE; }
.fx-text { color: var(--c-spark-bright); font-size: 12px; }

@media (max-width: 1024px) {
  .shot-table-header { display: none; }
  .shot-table-row { grid-template-columns: 1fr; gap: 0; }
  .col { border-right: 0; border-bottom: 1px dashed rgba(255,255,255,0.05); }
  .col:last-child { border-bottom: 0; }
}
</style>
