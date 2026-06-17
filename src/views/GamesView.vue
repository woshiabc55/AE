<script setup lang="ts">
import { computed } from 'vue'
import games from '../data/games.json'
import type { Game, GamePlatform } from '../types'
import {
  PLATFORM_LABELS, PLATFORM_COLORS,
  CATEGORY_COLORS, countBy
} from '../utils/data'
import { useECharts, type ECOption } from '../composables/useECharts'

const gameList = games as Game[]

// 平台分布
const platformData = computed(() => {
  const counts = countBy(gameList, (g: Game) => g.platform)
  return (['mobile', 'pc', 'console'] as GamePlatform[]).map((p) => ({
    name: PLATFORM_LABELS[p],
    value: counts[p] || 0,
    itemStyle: { color: PLATFORM_COLORS[p] }
  }))
})

// 类型
const categoryData = computed(() => {
  const counts = countBy(gameList, (g: Game) => g.category)
  return Object.entries(counts)
    .map(([name, value], i) => ({ name, value, itemStyle: { color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] } }))
    .sort((a, b) => b.value - a.value)
})
// 地区
const regionData = computed(() => {
  const counts = countBy(gameList, (g: Game) => g.region)
  return [
    { name: '中国',   value: counts.cn     || 0, itemStyle: { color: '#00E5FF' } },
    { name: '全球',   value: counts.global || 0, itemStyle: { color: '#FF2E63' } },
    { name: '双区',   value: counts.both   || 0, itemStyle: { color: '#A78BFA' } }
  ]
})

// 评分 vs 在线人数(散点)
const scatterData = computed(() => {
  const byCategory: Record<string, [number, number, string][]> = {}
  gameList.forEach((g) => {
    if (!byCategory[g.category]) byCategory[g.category] = []
    byCategory[g.category].push([g.rating, g.peakCCU, g.name])
  })
  return Object.entries(byCategory).map(([cat, points], i) => ({
    name: cat,
    type: 'scatter',
    symbolSize: (val: number[]) => Math.max(10, Math.min(36, Math.sqrt(val[1]) * 1.2)),
    itemStyle: { color: CATEGORY_COLORS[i % CATEGORY_COLORS.length], opacity: 0.78, borderColor: '#0A0E1A', borderWidth: 1 },
    data: points
  }))
})

const platformOption = computed<ECOption>(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  legend: { show: true, bottom: 0, textStyle: { color: '#8892B0', fontFamily: 'Orbitron', fontSize: 11 } },
  series: [{
    type: 'pie',
    radius: ['45%', '72%'],
    center: ['50%', '46%'],
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2 },
    label: { color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11, formatter: '{b}\n{c} 款' },
    data: platformData.value
  }]
}))

const categoryOption = computed<ECOption>(() => ({
  tooltip: { backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  series: [{
    type: 'treemap',
    roam: false,
    breadcrumb: { show: false },
    nodeClick: false,
    label: { show: true, color: '#fff', fontFamily: 'Orbitron', fontSize: 12 },
    upperLabel: { show: true, color: '#E6F1FF', height: 24, fontFamily: 'Orbitron', fontSize: 10 },
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2, gapWidth: 2 },
    levels: [{ itemStyle: { borderWidth: 0, gapWidth: 6, borderColor: '#0A0E1A' }, upperLabel: { show: false } }],
    data: categoryData.value
  }]
}))

const regionOption = computed<ECOption>(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  series: [{
    type: 'pie',
    radius: '70%',
    center: ['50%', '50%'],
    roseType: 'radius',
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2 },
    label: { color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11 },
    data: regionData.value
  }]
}))

const scatterOption = computed<ECOption>(() => ({
  grid: { top: 30, left: 60, right: 30, bottom: 50 },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' },
    formatter: (p: any) => `<b>${p.data[2]}</b><br/>评分 ${p.data[0]} · 峰值 ${p.data[1]} 万`
  },
  legend: {
    type: 'scroll', bottom: 0, textStyle: { color: '#8892B0', fontFamily: 'Orbitron', fontSize: 10 }
  },
  xAxis: {
    type: 'value', name: '评分', min: 7, max: 10,
    nameTextStyle: { color: '#8892B0', fontFamily: 'Orbitron', fontSize: 10 },
    axisLine: { lineStyle: { color: '#1A2238' } },
    axisLabel: { color: '#5B6478', fontFamily: 'JetBrains Mono', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(0,229,255,0.06)' } }
  },
  yAxis: {
    type: 'log', name: '峰值(万人)', min: 100,
    nameTextStyle: { color: '#8892B0', fontFamily: 'Orbitron', fontSize: 10 },
    axisLine: { lineStyle: { color: '#1A2238' } },
    axisLabel: { color: '#5B6478', fontFamily: 'JetBrains Mono', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(0,229,255,0.06)' } }
  },
  series: scatterData.value as any
}))

const { elRef: platformEl } = useECharts(platformOption)
const { elRef: categoryEl } = useECharts(categoryOption)
const { elRef: regionEl }   = useECharts(regionOption)
const { elRef: scatterEl }  = useECharts(scatterOption)
</script>

<template>
  <div class="grid-3">
    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">平台分布</div>
        <div class="panel-meta">Platform Share</div>
      </div>
      <div ref="platformEl" class="chart"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">类型热度 · 树图</div>
        <div class="panel-meta">Category Treemap</div>
      </div>
      <div ref="categoryEl" class="chart"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">地区分布</div>
        <div class="panel-meta">Region</div>
      </div>
      <div ref="regionEl" class="chart"></div>
    </div>
  </div>

  <div class="panel">
    <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
    <span class="panel-corner bl"></span><span class="panel-corner br"></span>
    <div class="panel-head">
      <div class="panel-title">评分 × 峰值在线人数(对数)</div>
      <div class="panel-meta">Rating vs Peak CCU · log scale</div>
    </div>
    <div ref="scatterEl" class="chart-tall"></div>
  </div>
</template>
