<script setup lang="ts">
import { computed } from 'vue'
import heroes from '../data/heroes.json'
import type { Hero, HeroRole } from '../types'
import { ROLE_COLORS, ROLE_LABELS, topHeroesByPopularity, countBy, CATEGORY_COLORS } from '../utils/data'
import { useECharts, type ECOption } from '../composables/useECharts'

const heroList = heroes as Hero[]

// 1. 职业分布玫瑰图
const roleDist = computed(() => {
  const counts = countBy(heroList, (h: Hero) => h.role)
  return (Object.keys(ROLE_LABELS) as HeroRole[]).map((r) => ({
    name: ROLE_LABELS[r],
    value: counts[r] || 0,
    itemStyle: { color: ROLE_COLORS[r] }
  }))
})

// 2. 热度 Top15
const top15 = computed(() => topHeroesByPopularity(heroList, 15))

// 3. 性别分布
const genderDist = computed(() => {
  const counts = countBy(heroList, (h: Hero) => h.gender)
  return [
    { name: '男', value: counts.male   || 0, itemStyle: { color: '#00E5FF' } },
    { name: '女', value: counts.female || 0, itemStyle: { color: '#FF2E63' } },
    { name: '其他', value: counts.other || 0, itemStyle: { color: '#A78BFA' } }
  ]
})

// 4. 阵营 Top10
const factionDist = computed(() => {
  const counts = countBy(heroList, (h: Hero) => h.faction)
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
})

// 5. 年度新增趋势
const yearlyTrend = computed(() => {
  const counts = countBy(heroList, (h: Hero) => h.releaseYear)
  return Object.entries(counts)
    .map(([y, v]) => ({ year: Number(y), value: v }))
    .sort((a, b) => a.year - b.year)
})

const roseOption = computed<ECOption>(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  legend: { show: true, bottom: 0, textStyle: { color: '#8892B0', fontFamily: 'Orbitron', fontSize: 11 } },
  series: [{
    type: 'pie',
    radius: ['20%', '75%'],
    center: ['50%', '46%'],
    roseType: 'radius',
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2 },
    label: { color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11, formatter: '{b}\n{c}' },
    data: roleDist.value
  }]
}))

const top15Option = computed<ECOption>(() => {
  const labels = top15.value.map((h) => h.name).reverse()
  const values = top15.value.map((h) => h.popularity).reverse()
  return {
    grid: { top: 10, left: 60, right: 30, bottom: 30, containLabel: false },
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' }
    },
    xAxis: {
      type: 'value', max: 100,
      axisLine: { lineStyle: { color: '#1A2238' } },
      axisLabel: { color: '#5B6478', fontFamily: 'JetBrains Mono', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,229,255,0.06)' } }
    },
    yAxis: {
      type: 'category', data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#E6F1FF', fontFamily: 'Noto Sans SC', fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: values,
      barWidth: 14,
      itemStyle: {
        borderRadius: [0, 2, 2, 0],
        color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(0,229,255,0.3)' },
            { offset: 1, color: '#00E5FF' }
          ]
        }
      },
      label: {
        show: true, position: 'right', color: '#00E5FF',
        fontFamily: 'Orbitron', fontSize: 10
      }
    }]
  }
})

const genderOption = computed<ECOption>(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  legend: { show: true, bottom: 0, textStyle: { color: '#8892B0', fontFamily: 'Orbitron', fontSize: 11 } },
  series: [{
    type: 'pie',
    radius: ['45%', '72%'],
    center: ['50%', '46%'],
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2 },
    label: { color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11 },
    data: genderDist.value
  }]
}))

const factionOption = computed<ECOption>(() => {
  const names = factionDist.value.map((d) => d.name).reverse()
  const values = factionDist.value.map((d) => d.value).reverse()
  return {
    grid: { top: 10, left: 80, right: 30, bottom: 30 },
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' }
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#1A2238' } },
      axisLabel: { color: '#5B6478', fontFamily: 'JetBrains Mono', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(0,229,255,0.06)' } }
    },
    yAxis: {
      type: 'category', data: names,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: '#E6F1FF', fontFamily: 'Noto Sans SC', fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: values,
      barWidth: 12,
      itemStyle: {
        borderRadius: [0, 2, 2, 0],
        color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(167,139,250,0.3)' },
            { offset: 1, color: '#A78BFA' }
          ]
        }
      },
      label: { show: true, position: 'right', color: '#A78BFA', fontFamily: 'Orbitron', fontSize: 10 }
    }]
  }
})

const yearOption = computed<ECOption>(() => ({
  grid: { top: 20, left: 50, right: 30, bottom: 40 },
  tooltip: {
    trigger: 'axis', axisPointer: { type: 'cross' },
    backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' }
  },
  xAxis: {
    type: 'category', data: yearlyTrend.value.map((d) => d.year),
    axisLine: { lineStyle: { color: '#1A2238' } },
    axisLabel: { color: '#8892B0', fontFamily: 'JetBrains Mono', fontSize: 10 }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#1A2238' } },
    axisLabel: { color: '#5B6478', fontFamily: 'JetBrains Mono', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(0,229,255,0.06)' } }
  },
  series: [{
    type: 'line',
    data: yearlyTrend.value.map((d) => d.value),
    smooth: true,
    symbol: 'circle', symbolSize: 8,
    lineStyle: { width: 2.5, color: '#FFD460' },
    itemStyle: { color: '#FFD460', borderColor: '#0A0E1A', borderWidth: 2 },
    areaStyle: {
      color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(255,212,96,0.32)' },
          { offset: 1, color: 'rgba(255,212,96,0)' }
        ]
      }
    }
  }]
}))

const { elRef: roseEl }    = useECharts(roseOption)
const { elRef: top15El }   = useECharts(top15Option)
const { elRef: genderEl }  = useECharts(genderOption)
const { elRef: factionEl } = useECharts(factionOption)
const { elRef: yearEl }    = useECharts(yearOption)
</script>

<template>
  <div class="grid-2">
    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">六大职业 · 数量玫瑰图</div>
        <div class="panel-meta">Nightingale</div>
      </div>
      <div ref="roseEl" class="chart"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">热度 Top 15</div>
        <div class="panel-meta">Popularity Index · 0-100</div>
      </div>
      <div ref="top15El" class="chart"></div>
    </div>
  </div>

  <div class="grid-3">
    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">性别分布</div>
        <div class="panel-meta">M / F / Other</div>
      </div>
      <div ref="genderEl" class="chart-short" style="height: 320px;"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">阵营 Top 10</div>
        <div class="panel-meta">Faction Count</div>
      </div>
      <div ref="factionEl" class="chart-short" style="height: 320px;"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">年度新增</div>
        <div class="panel-meta">Heroes Released per Year</div>
      </div>
      <div ref="yearEl" class="chart-short" style="height: 320px;"></div>
    </div>
  </div>
</template>
