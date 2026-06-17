<script setup lang="ts">
import { computed, ref } from 'vue'
import games from '../data/games.json'
import type { Game, GamePlatform, GameRegion } from '../types'
import { PLATFORM_COLORS, PLATFORM_LABELS, CATEGORY_COLORS } from '../utils/data'

const gameList = games as Game[]

const platforms: ('all' | GamePlatform)[] = ['all', 'mobile', 'pc', 'console']
const regions:   ('all' | GameRegion)[]   = ['all', 'cn', 'global', 'both']

const platform = ref<'all' | GamePlatform>('all')
const region   = ref<'all' | GameRegion>('all')
const keyword  = ref('')

const categories = computed(() => Array.from(new Set(gameList.map((g) => g.category))).sort())
const activeCategory = ref<string>('all')

const filtered = computed(() => {
  return gameList.filter((g) => {
    if (platform.value !== 'all' && g.platform !== platform.value) return false
    if (region.value   !== 'all' && g.region   !== region.value)   return false
    if (activeCategory.value !== 'all' && g.category !== activeCategory.value) return false
    if (keyword.value.trim()) {
      const k = keyword.value.trim().toLowerCase()
      if (!g.name.toLowerCase().includes(k)) return false
    }
    return true
  })
})

function categoryColor(cat: string) {
  const idx = categories.value.indexOf(cat)
  return CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
}
function platformColor(pf: GamePlatform) {
  return PLATFORM_COLORS[pf]
}
function regionLabel(r: GameRegion) {
  return r === 'cn' ? '中国' : r === 'global' ? '全球' : '双区'
}
</script>

<template>
  <!-- 平台筛选 -->
  <div class="filter-bar">
    <span class="filter-label">平台</span>
    <button
      v-for="p in platforms" :key="p"
      class="filter-chip" :class="{ active: platform === p }"
      @click="platform = p"
    >{{ p === 'all' ? '全部' : PLATFORM_LABELS[p] }}</button>
  </div>

  <!-- 地区筛选 -->
  <div class="filter-bar">
    <span class="filter-label">地区</span>
    <button
      v-for="r in regions" :key="r"
      class="filter-chip" :class="{ active: region === r }"
      @click="region = r"
    >{{ r === 'all' ? '全部' : regionLabel(r) }}</button>
  </div>

  <!-- 类型筛选 -->
  <div class="filter-bar">
    <span class="filter-label">类型</span>
    <button
      class="filter-chip" :class="{ active: activeCategory === 'all' }"
      @click="activeCategory = 'all'"
    >全部</button>
    <button
      v-for="cat in categories" :key="cat"
      class="filter-chip" :class="{ active: activeCategory === cat }"
      @click="activeCategory = cat"
    >{{ cat }}</button>
  </div>

  <!-- 搜索 -->
  <div class="filter-bar">
    <span class="filter-label">搜索</span>
    <input
      v-model="keyword"
      class="filter-chip"
      style="min-width: 240px; cursor: text;"
      placeholder="按名称筛选..."
    />
    <span class="text-mono text-muted" style="margin-left: auto;">
      {{ filtered.length }} / {{ gameList.length }} TITLES
    </span>
  </div>

  <!-- 卡片网格 -->
  <div class="game-grid">
    <article
      v-for="g in filtered" :key="g.id"
      class="game-card"
      :style="{ '--card-accent': categoryColor(g.category) }"
    >
      <div class="game-name">{{ g.name }}</div>
      <div class="game-meta">
        <span class="tag cat">{{ g.category }}</span>
        <span class="tag pf">{{ PLATFORM_LABELS[g.platform] }}</span>
        <span class="tag reg">{{ regionLabel(g.region) }}</span>
      </div>
      <div class="game-stats">
        <div class="game-stat">
          <div class="game-stat-label">RATING</div>
          <div class="game-stat-value text-amber">{{ g.rating.toFixed(1) }}</div>
        </div>
        <div class="game-stat">
          <div class="game-stat-label">PEAK CCU</div>
          <div class="game-stat-value text-cyan">
            {{ g.peakCCU.toLocaleString() }}<span class="small"> 万</span>
          </div>
        </div>
        <div class="game-stat">
          <div class="game-stat-label">RELEASE</div>
          <div class="game-stat-value text-mono">{{ g.releaseYear }}</div>
        </div>
      </div>
    </article>
  </div>

  <div v-if="filtered.length === 0" class="text-mono text-muted" style="text-align: center; padding: 60px 0; letter-spacing: 0.2em;">
    // NO MATCHING TITLES //
  </div>
</template>
