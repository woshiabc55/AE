<script setup lang="ts">
import { computed } from 'vue'
import type { Shot } from '@/stores/storyboard'

const props = defineProps<{ shot: Shot }>()

// 抽象的 key visual 插画：每镜用不同主题的几何 SVG
const visual = computed(() => props.shot.id)
</script>

<template>
  <div class="key-visual" :style="{ '--c': shot.color }">
    <!-- Shot 1: 武士背对，刀柄 + 烟尘螺旋 -->
    <svg v-if="visual === 'one'" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="kv1-smoke" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stop-color="#E0A82E" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#B08D57" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="kv1-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E6F0FF" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#6B7280" stop-opacity="0.3"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="#0F0F14"/>
      <!-- 远山 -->
      <path d="M 0 180 L 80 130 L 160 150 L 240 110 L 320 140 L 400 120 L 400 240 L 0 240 Z" fill="#1A1A22" opacity="0.8"/>
      <!-- 螺旋烟尘 -->
      <g transform="translate(200, 200)">
        <ellipse rx="120" ry="60" fill="url(#kv1-smoke)"/>
        <path d="M 0 0 Q -20 -30, 0 -50 Q 30 -70, 0 -90 Q -25 -100, 0 -120" stroke="#E0A82E" stroke-width="1.5" fill="none" stroke-opacity="0.5"/>
        <path d="M 0 0 Q 20 -30, 0 -50 Q -30 -70, 0 -90 Q 25 -100, 0 -120" stroke="#B08D57" stroke-width="1.5" fill="none" stroke-opacity="0.5"/>
      </g>
      <!-- 武士剪影 -->
      <g transform="translate(180, 90)">
        <!-- 头盔 -->
        <path d="M 0 0 L 0 30 L 40 30 L 40 0 Q 40 -10, 30 -15 L 10 -15 Q 0 -10, 0 0" fill="#1A1A22"/>
        <!-- 肩甲 -->
        <path d="M -25 30 L 0 30 L 5 60 L -30 60 Z M 40 30 L 65 30 L 70 60 L 35 60 Z" fill="#2A2A33"/>
        <!-- 刀柄 -->
        <rect x="58" y="40" width="14" height="50" fill="url(#kv1-blade)"/>
        <rect x="58" y="40" width="14" height="50" fill="none" stroke="#E0A82E" stroke-width="0.5" stroke-opacity="0.6"/>
      </g>
      <!-- 装饰：箭头轨迹 -->
      <g opacity="0.5">
        <path d="M 60 40 L 100 100 L 150 140" stroke="#3FB8AF" stroke-width="0.8" fill="none" stroke-dasharray="2 3"/>
      </g>
    </svg>

    <!-- Shot 2: 血雾 + 旋身 + 战友交错 -->
    <svg v-else-if="visual === 'two'" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="kv2-blood" cx="50%" cy="55%" r="40%">
          <stop offset="0%" stop-color="#C5302B" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#7A1B17" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#0F0F14"/>
      <!-- 同心圆冲击 -->
      <g transform="translate(200, 130)">
        <circle r="30" fill="none" stroke="#C5302B" stroke-width="1" stroke-opacity="0.6"/>
        <circle r="60" fill="none" stroke="#C5302B" stroke-width="0.8" stroke-opacity="0.4"/>
        <circle r="90" fill="none" stroke="#C5302B" stroke-width="0.6" stroke-opacity="0.25"/>
        <circle r="120" fill="none" stroke="#C5302B" stroke-width="0.4" stroke-opacity="0.15"/>
        <circle r="80" fill="url(#kv2-blood)"/>
      </g>
      <!-- 两个人影交错 -->
      <g transform="translate(140, 80)">
        <path d="M 0 0 Q 10 -5, 20 0 L 25 30 L -5 30 Z" fill="#2A2A33"/>
        <line x1="35" y1="20" x2="55" y2="40" stroke="#E6F0FF" stroke-width="2"/>
      </g>
      <g transform="translate(220, 80)" opacity="0.65">
        <path d="M 0 0 Q 10 -5, 20 0 L 25 30 L -5 30 Z" fill="#1A1A22" stroke="#3FB8AF" stroke-width="0.5" stroke-dasharray="2 2"/>
        <line x1="-15" y1="20" x2="-35" y2="40" stroke="#E6F0FF" stroke-width="1.5" opacity="0.5"/>
      </g>
      <!-- 血滴抛物线 -->
      <g>
        <circle cx="180" cy="120" r="2" fill="#1A0606"/>
        <circle cx="195" cy="135" r="2.5" fill="#1A0606"/>
        <circle cx="215" cy="125" r="2" fill="#1A0606"/>
        <circle cx="170" cy="140" r="1.5" fill="#1A0606"/>
      </g>
      <!-- 红色声波 -->
      <g stroke="#C5302B" stroke-width="0.6" fill="none" opacity="0.7">
        <path d="M 50 200 Q 100 180, 150 200 T 250 200 T 350 200"/>
      </g>
    </svg>

    <!-- Shot 3: 坠马 + V 型 + 箭矢 -->
    <svg v-else-if="visual === 'three'" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="kv3-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2A1A1A"/>
          <stop offset="100%" stop-color="#0F0F14"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#kv3-sky)"/>
      <!-- 地平线 -->
      <line x1="0" y1="160" x2="400" y2="160" stroke="#7A7368" stroke-width="0.6" stroke-dasharray="4 4" opacity="0.5"/>
      <!-- 远山 -->
      <path d="M 0 160 L 100 130 L 200 145 L 300 125 L 400 140 L 400 160 Z" fill="#1A1A22" opacity="0.6"/>
      <!-- 坠马剪影 -->
      <g transform="translate(100, 100)">
        <path d="M 0 0 L 30 -5 L 40 20 L 50 30 L 25 35 L 15 25 L 0 25 Z" fill="#1A1A22" stroke="#7A7368" stroke-width="0.5"/>
        <line x1="40" y1="5" x2="55" y2="-10" stroke="#E6F0FF" stroke-width="1.5"/>
      </g>
      <!-- 翻滚的人 -->
      <g transform="translate(240, 130) rotate(45)">
        <circle r="6" fill="#1A1A22" stroke="#7A7368" stroke-width="0.5"/>
        <line x1="0" y1="6" x2="0" y2="20" stroke="#1A1A22" stroke-width="3"/>
      </g>
      <!-- V 型反弹箭头 -->
      <g transform="translate(200, 180)">
        <path d="M -80 0 L -40 -40 L 0 0 L 40 40 L 80 0" stroke="#3FB8AF" stroke-width="1.5" fill="none" stroke-opacity="0.7"/>
        <circle cx="-40" cy="-40" r="3" fill="#3FB8AF"/>
        <circle cx="40" cy="40" r="3" fill="#3FB8AF"/>
      </g>
      <!-- 箭矢 -->
      <g transform="translate(320, 90)">
        <line x1="0" y1="0" x2="20" y2="0" stroke="#E6F0FF" stroke-width="1.5"/>
        <polygon points="22,0 16,-2 16,2" fill="#E6F0FF"/>
        <line x1="-30" y1="0" x2="0" y2="0" stroke="#3FB8AF" stroke-width="0.6" stroke-dasharray="2 2"/>
      </g>
      <!-- 沙尘 -->
      <g opacity="0.4">
        <circle cx="120" cy="200" r="3" fill="#7A7368"/>
        <circle cx="140" cy="195" r="2" fill="#7A7368"/>
        <circle cx="160" cy="205" r="2.5" fill="#7A7368"/>
        <circle cx="200" cy="200" r="2" fill="#7A7368"/>
        <circle cx="220" cy="210" r="3" fill="#7A7368"/>
      </g>
    </svg>

    <!-- Shot 4: 勒马 + 千米火弹 + 黑边灰烬 -->
    <svg v-else viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="kv4-fire" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stop-color="#E0A82E" stop-opacity="0.7"/>
          <stop offset="40%" stop-color="#C5302B" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#7A1B17" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="kv4-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2A0A0A"/>
          <stop offset="60%" stop-color="#0F0F14"/>
          <stop offset="100%" stop-color="#000"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#kv4-sky)"/>
      <!-- 千米火弹 -->
      <g transform="translate(200, 200)">
        <circle r="180" fill="url(#kv4-fire)"/>
        <ellipse rx="180" ry="40" fill="#7A1B17" opacity="0.4"/>
        <ellipse rx="120" ry="20" fill="#C5302B" opacity="0.5"/>
        <ellipse rx="60" ry="10" fill="#E0A82E" opacity="0.7"/>
      </g>
      <!-- 勒马剪影 + 刀指天 -->
      <g transform="translate(190, 130)">
        <!-- 马 -->
        <path d="M 0 0 Q 20 -5, 30 0 L 35 25 L 25 25 L 20 15 L 10 15 L 5 25 L -5 25 Z" fill="#000"/>
        <line x1="5" y1="25" x2="3" y2="40" stroke="#000" stroke-width="2"/>
        <line x1="25" y1="25" x2="27" y2="40" stroke="#000" stroke-width="2"/>
        <!-- 武士 -->
        <circle cx="20" cy="-10" r="4" fill="#000"/>
        <line x1="20" y1="-5" x2="20" y2="10" stroke="#000" stroke-width="2"/>
        <line x1="18" y1="-2" x2="22" y2="20" stroke="#000" stroke-width="2"/>
        <!-- 刀指天 -->
        <line x1="22" y1="0" x2="32" y2="-30" stroke="#C5302B" stroke-width="2.5"/>
        <line x1="22" y1="0" x2="32" y2="-30" stroke="#fff" stroke-width="0.6"/>
      </g>
      <!-- 灰烬飘落 -->
      <g fill="#A39A8A">
        <rect x="80" y="40" width="1.5" height="2.5" opacity="0.7"/>
        <rect x="120" y="60" width="1" height="2" opacity="0.5"/>
        <rect x="200" y="30" width="1.5" height="2.5" opacity="0.6"/>
        <rect x="260" y="50" width="1" height="2" opacity="0.5"/>
        <rect x="320" y="70" width="1.5" height="2.5" opacity="0.6"/>
        <rect x="340" y="40" width="1" height="2" opacity="0.4"/>
        <rect x="60" y="80" width="1" height="2" opacity="0.5"/>
        <rect x="160" y="100" width="1.5" height="2.5" opacity="0.6"/>
        <rect x="280" y="90" width="1" height="2" opacity="0.5"/>
      </g>
      <!-- 黑边 letterbox -->
      <rect x="0" y="0" width="400" height="14" fill="#000"/>
      <rect x="0" y="226" width="400" height="14" fill="#000"/>
      <!-- 灰烬内部黑边 -->
      <g fill="#5A5550">
        <rect x="40" y="6" width="0.8" height="1.5"/>
        <rect x="120" y="8" width="0.8" height="1.5"/>
        <rect x="240" y="5" width="0.8" height="1.5"/>
        <rect x="80" y="232" width="0.8" height="1.5"/>
        <rect x="220" y="234" width="0.8" height="1.5"/>
        <rect x="340" y="232" width="0.8" height="1.5"/>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.key-visual {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--c-line);
  overflow: hidden;
  background: var(--c-ink-2);
}
.key-visual svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
