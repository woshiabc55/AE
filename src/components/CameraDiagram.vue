<script setup lang="ts">
import type { CameraMove } from '@/stores/storyboard'

defineProps<{ moves: CameraMove[]; color: string }>()

const moveDesc: Record<string, string> = {
  '前冲式推轨': '镜头沿轨道向角色方向前推，强化紧张感与空间纵深。',
  '甩镜 90°': '镜头快速甩动 90°，常用于急转场或转场衔接。',
  '长焦拉远': '长焦镜头从主体拉远，压缩前后景，呈现人→马→地平线的层级。',
  '手持乱点': '随机抖动拍摄，营造混乱、临场、即兴的战场氛围。',
  '低角度仰冲': '极低视角仰拍主体，凸显英雄感与压迫感。',
  '贴地横移': '镜头贴近地面横向移动，捕捉马蹄、刀锋等近景动作。',
  '360° 环绕': '镜头围绕角色 360° 旋转，呈现动作的完整时空。',
  '3 镜头硬切': '三个不同景别的镜头快速硬切，制造节奏张力。',
  '慢动作特写': '升格慢动作配合极近景，突出关键瞬间。',
  '鸟瞰俯冲': '从高处俯冲而下，模拟战场的垂直纵深。',
  '微距面部': '极近距离特写面部肌肉、汗珠、血沫等微观细节。',
  '长焦侧拍': '长焦镜头从侧面拍摄，压缩景深，强化剪影。',
  '地面跟拍': '镜头贴近地面跟随主体翻滚、爬起的动作。',
  '子弹时间': '冻结时间的慢镜头，捕捉关键闪避、命中瞬间。',
  '硬切特写': '无过渡的硬切特写，制造视觉冲击。',
  '环轨逆时针': '镜头围绕主体逆时针环绕，强调旋转动作。',
  '快速剪辑': '4 个镜头快速跳跃剪辑，强化战斗节奏。',
  '侧环低角度': '低角度侧向环绕拍摄，强调环境的压迫感。',
  '急速变焦': '焦距急速拉伸，制造空间畸变与视觉冲击。',
  '马背跟拍': '镜头从马背位置跟拍主体，呈现颠簸的第一视角。',
  '无人机拉升': '无人机垂直拉升至 100m，呈现宏大场面。',
  '定格': '画面静止一帧，强调绝对静止的瞬间张力。'
}

function iconPath(icon: string) {
  switch (icon) {
    case 'push': return 'M 20 60 L 100 60 M 80 40 L 100 60 L 80 80'
    case 'whip': return 'M 10 30 Q 60 100 110 30 M 90 25 L 110 30 L 95 50'
    case 'pull': return 'M 20 60 L 100 60 M 40 40 L 20 60 L 40 80'
    case 'shake': return 'M 20 60 L 30 40 L 40 70 L 55 35 L 70 65 L 85 40 L 100 60'
    case 'tilt': return 'M 20 100 L 60 50 L 100 10 M 80 18 L 100 10 L 92 30'
    case 'dolly': return 'M 20 60 L 100 60 M 90 50 L 100 60 L 90 70'
    case 'orbit': return 'M 100 20 A 40 40 0 1 1 60 60 M 56 50 L 60 60 L 70 56'
    case 'cut': return 'M 20 20 L 40 60 L 20 100 M 60 20 L 80 60 L 60 100 M 100 20 L 100 100'
    case 'macro': return 'M 60 20 A 40 40 0 1 1 60 100 A 40 40 0 1 1 60 20 M 50 60 L 70 60 M 60 50 L 60 70'
    case 'dive': return 'M 20 20 L 100 100 M 80 80 L 100 100 L 80 105'
    case 'face': return 'M 60 30 A 20 20 0 1 1 60 70 A 20 20 0 1 1 60 30 M 53 50 L 67 50 M 55 65 L 65 60'
    case 'side': return 'M 20 60 L 100 60 M 90 50 L 100 60 L 90 70'
    case 'ground': return 'M 10 90 L 30 80 L 50 92 L 70 75 L 100 88 M 80 80 L 100 88 L 92 100'
    case 'bullet': return 'M 20 60 L 100 60 M 50 30 L 60 60 L 50 90 M 70 30 L 80 60 L 70 90'
    case 'jump': return 'M 10 80 L 35 50 L 60 70 L 85 40 L 110 60'
    case 'low': return 'M 20 100 L 100 100 M 60 40 L 100 100 M 50 30 L 60 40 L 50 50'
    case 'zoom': return 'M 60 25 L 100 100 M 60 25 L 40 60 M 60 25 L 80 60'
    case 'horseback': return 'M 20 80 Q 35 60 50 80 Q 65 60 80 80 M 50 80 L 50 95 M 80 80 L 80 95'
    case 'drone': return 'M 20 60 L 100 60 M 50 40 L 70 60 L 50 80 M 70 40 L 50 60 L 70 80'
    case 'still': return 'M 60 20 L 60 100 M 20 60 L 100 60 M 50 50 L 70 70 M 70 50 L 50 70'
    default: return 'M 20 60 L 100 60'
  }
}

const active = defineModel<number | null>('active', { default: null })
</script>

<template>
  <div class="cam-grid">
    <div
      v-for="(m, i) in moves"
      :key="i"
      class="cam-cell"
      :class="{ active: active === i }"
      :style="{ '--c': color }"
      @mouseenter="active = i"
      @mouseleave="active = null"
    >
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
      <div class="cam-cell-desc serif">{{ moveDesc[m.label] || '运镜图示' }}</div>
    </div>
  </div>
</template>

<style scoped>
.cam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}
.cam-cell {
  position: relative;
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
  padding: 12px 12px 14px;
  color: var(--c);
  text-align: center;
  transition: transform var(--t-fast), border-color var(--t-fast), box-shadow var(--t-med);
  cursor: default;
}
.cam-cell.active,
.cam-cell:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--c) 60%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--c) 35%, transparent);
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
.cam-cell-desc {
  margin-top: 6px;
  font-size: 10.5px;
  color: #A39A8A;
  line-height: 1.5;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
}
.cam-cell.active .cam-cell-desc,
.cam-cell:hover .cam-cell-desc {
  max-height: 80px;
  opacity: 1;
  margin-top: 8px;
  border-top: 1px dashed var(--c-line);
  padding-top: 6px;
}
</style>
