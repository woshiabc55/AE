<script setup lang="ts">
import type { CameraMove } from '@/stores/storyboard'

defineProps<{ moves: CameraMove[]; color: string }>()

// 根据 icon 返回 SVG path
function iconPath(icon: string) {
  switch (icon) {
    case 'push':
      return 'M 20 60 L 100 60 M 80 40 L 100 60 L 80 80'
    case 'whip':
      return 'M 10 30 Q 60 100 110 30 M 90 25 L 110 30 L 95 50'
    case 'pull':
      return 'M 20 60 L 100 60 M 40 40 L 20 60 L 40 80'
    case 'shake':
      return 'M 20 60 L 30 40 L 40 70 L 55 35 L 70 65 L 85 40 L 100 60'
    case 'tilt':
      return 'M 20 100 L 60 50 L 100 10 M 80 18 L 100 10 L 92 30'
    case 'dolly':
      return 'M 20 60 L 100 60 M 90 50 L 100 60 L 90 70'
    case 'orbit':
      return 'M 100 20 A 40 40 0 1 1 60 60 M 56 50 L 60 60 L 70 56'
    case 'cut':
      return 'M 20 20 L 40 60 L 20 100 M 60 20 L 80 60 L 60 100 M 100 20 L 100 100'
    case 'macro':
      return 'M 60 20 A 40 40 0 1 1 60 100 A 40 40 0 1 1 60 20 M 50 60 L 70 60 M 60 50 L 60 70'
    case 'dive':
      return 'M 20 20 L 100 100 M 80 80 L 100 100 L 80 105'
    case 'face':
      return 'M 60 30 A 20 20 0 1 1 60 70 A 20 20 0 1 1 60 30 M 53 50 L 67 50 M 55 65 L 65 60'
    case 'side':
      return 'M 20 60 L 100 60 M 90 50 L 100 60 L 90 70'
    case 'ground':
      return 'M 10 90 L 30 80 L 50 92 L 70 75 L 100 88 M 80 80 L 100 88 L 92 100'
    case 'bullet':
      return 'M 20 60 L 100 60 M 50 30 L 60 60 L 50 90 M 70 30 L 80 60 L 70 90'
    case 'jump':
      return 'M 10 80 L 35 50 L 60 70 L 85 40 L 110 60'
    case 'low':
      return 'M 20 100 L 100 100 M 60 40 L 100 100 M 50 30 L 60 40 L 50 50'
    case 'zoom':
      return 'M 60 25 L 100 100 M 60 25 L 40 60 M 60 25 L 80 60'
    case 'horseback':
      return 'M 20 80 Q 35 60 50 80 Q 65 60 80 80 M 50 80 L 50 95 M 80 80 L 80 95'
    case 'drone':
      return 'M 20 60 L 100 60 M 50 40 L 70 60 L 50 80 M 70 40 L 50 60 L 70 80'
    case 'still':
      return 'M 60 20 L 60 100 M 20 60 L 100 60 M 50 50 L 70 70 M 70 50 L 50 70'
    default:
      return 'M 20 60 L 100 60'
  }
}
</script>

<template>
  <div class="cam-grid">
    <div v-for="(m, i) in moves" :key="i" class="cam-cell" :style="{ '--c': color }">
      <div class="cam-cell-num mono">0{{ i + 1 }}</div>
      <svg class="cam-cell-svg" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker :id="'arr-' + i" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 5 3 L 0 6 Z" fill="currentColor" />
          </marker>
        </defs>
        <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="2 4" />
        <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="2 4" />
        <path :d="iconPath(m.icon)" stroke="currentColor" stroke-width="1.5" fill="none" :marker-end="'url(#arr-' + i + ')'" stroke-linecap="round" />
      </svg>
      <div class="cam-cell-label">{{ m.label }}</div>
    </div>
  </div>
</template>

<style scoped>
.cam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}
.cam-cell {
  position: relative;
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  padding: 12px 12px 10px;
  color: var(--c);
  text-align: center;
  transition: transform var(--t-fast), border-color var(--t-fast);
}
.cam-cell:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--c) 45%, transparent);
}
.cam-cell-num {
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 9px;
  letter-spacing: 0.16em;
  color: var(--c-ash);
}
.cam-cell-svg {
  width: 100%;
  height: 80px;
  display: block;
}
.cam-cell-label {
  margin-top: 6px;
  font-family: var(--f-serif);
  font-size: 12px;
  color: #E8E1D4;
  letter-spacing: 0.04em;
}
</style>
