<script setup lang="ts">
defineProps<{ shape: string; color?: string; index: string; title: string; range: string }>()

// 根据节奏形状生成 SVG 折线
function pathFor(shape: string): string {
  switch (shape) {
    case '双波峰':
      return 'M 0 60 L 30 60 L 50 18 L 80 70 L 110 28 L 140 64 L 170 50 L 200 50'
    case '波浪形':
      return 'M 0 60 C 25 18, 50 100, 75 50 S 125 0, 150 60 S 200 100, 200 60 L 200 50'
    case 'V型反弹':
      return 'M 0 20 L 60 20 L 100 100 L 140 100 L 180 30 L 200 30'
    case '螺旋上升':
    default:
      return 'M 0 100 C 40 100, 60 80, 80 80 S 120 60, 140 60 S 180 30, 200 20'
  }
}
</script>

<template>
  <div class="beat-card" :style="{ '--c': color }">
    <div class="beat-card-head">
      <span class="beat-card-index display">分镜 {{ index }}</span>
      <span class="beat-card-title serif">{{ title }}</span>
    </div>
    <svg class="beat-card-wave" viewBox="0 0 200 120" preserveAspectRatio="none">
      <defs>
        <linearGradient :id="'bg-' + index" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" stroke-opacity="0.18" stroke-dasharray="2 4" />
      <path :d="pathFor(shape) + ' L 200 120 L 0 120 Z'" :fill="'url(#bg-' + index + ')'" />
      <path :d="pathFor(shape)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
    </svg>
    <div class="beat-card-foot">
      <span class="serif">{{ shape }}</span>
      <span class="mono">{{ range }}</span>
    </div>
  </div>
</template>

<style scoped>
.beat-card {
  position: relative;
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  padding: var(--s-4) var(--s-4) var(--s-3);
  color: var(--c);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  transition: transform var(--t-med), box-shadow var(--t-med);
  min-height: 168px;
  display: flex;
  flex-direction: column;
}
.beat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--c) 35%, transparent);
}
.beat-card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.beat-card-index {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.beat-card-title {
  font-size: 13px;
  color: #E8E1D4;
}
.beat-card-wave {
  flex: 1;
  width: 100%;
  margin: var(--s-3) 0;
}
.beat-card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #C8BFAE;
  border-top: 1px dashed color-mix(in srgb, var(--c) 35%, transparent);
  padding-top: var(--s-3);
}
.beat-card-foot .mono {
  color: var(--c-ash);
  font-size: 10px;
  letter-spacing: 0.1em;
}
</style>
