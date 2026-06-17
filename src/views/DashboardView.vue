<script setup lang="ts">
import { computed, ref } from 'vue'
import heroes from '../data/heroes.json'
import skins from '../data/skins.json'
import games from '../data/games.json'
import type { Hero, Game, HeroRole } from '../types'
import { ROLE_COLORS, ROLE_LABELS, countBy, avgRating, CATEGORY_COLORS, PLATFORM_COLORS } from '../utils/data'
import { useECharts, type ECOption } from '../composables/useECharts'

const heroList = heroes as Hero[]
const skinSummary = skins
const gameList = games as Game[]

const totalHeroes = heroList.length
const totalSkins = skinSummary.summary.totalSkins
const totalGames = gameList.length
const avgScore = avgRating(gameList)

// 六大职业分布
const roleDist = computed(() => {
  const counts = countBy(heroList, (h: Hero) => h.role)
  return (Object.keys(ROLE_LABELS) as HeroRole[]).map((r) => ({
    name: ROLE_LABELS[r],
    value: counts[r] || 0,
    color: ROLE_COLORS[r]
  }))
})

// 皮肤品质分布
const tierData = computed(() => {
  const t = skinSummary.summary.tierDistribution
  return [
    { name: '勇者',  value: t.common, color: '#60A5FA' },
    { name: '史诗',  value: t.epic,   color: '#A78BFA' },
    { name: '传说',  value: t.legend, color: '#FFD460' },
    { name: '荣耀',  value: t.glory,  color: '#FF2E63' }
  ]
})

// 平台分布
const platformData = computed(() => {
  const counts = countBy(gameList, (g: Game) => g.platform)
  return [
    { name: '手游',  value: counts.mobile  || 0, color: PLATFORM_COLORS.mobile  },
    { name: '端游',  value: counts.pc      || 0, color: PLATFORM_COLORS.pc      },
    { name: '主机',  value: counts.console || 0, color: PLATFORM_COLORS.console }
  ]
})

// 类型树图
const categoryData = computed(() => {
  const counts = countBy(gameList, (g: Game) => g.category)
  return Object.entries(counts)
    .map(([cat, n], i) => ({ name: cat, value: n, itemStyle: { color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] } }))
    .sort((a, b) => b.value - a.value)
})

// ECharts options
const roseOption = computed<ECOption>(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  legend: { show: true, bottom: 0, textStyle: { color: '#8892B0', fontFamily: 'Orbitron' } },
  series: [{
    type: 'pie',
    radius: ['28%', '70%'],
    center: ['50%', '46%'],
    roseType: 'area',
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2 },
    label: { color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11 },
    data: roleDist.value
  }]
}))

const tierOption = computed<ECOption>(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  series: [{
    type: 'pie',
    radius: ['55%', '78%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 3 },
    label: { show: true, position: 'outside', color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11, formatter: '{b}\n{d}%' },
    labelLine: { lineStyle: { color: '#00E5FF' } },
    data: tierData.value
  }],
  graphic: [{
    type: 'text',
    left: 'center',
    top: '46%',
    style: { text: totalSkins, fill: '#FFD460', fontSize: 28, font: '700 28px Orbitron', textAlign: 'center' }
  }, {
    type: 'text',
    left: 'center',
    top: '58%',
    style: { text: 'TOTAL SKINS', fill: '#8892B0', fontSize: 10, font: '500 10px Orbitron', textAlign: 'center', letterSpacing: 3 }
  }]
}))

const platformOption = computed<ECOption>(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  legend: { show: true, bottom: 0, textStyle: { color: '#8892B0', fontFamily: 'Orbitron' } },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['50%', '46%'],
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2 },
    label: { color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11 },
    data: platformData.value
  }]
}))

const treemapOption = computed<ECOption>(() => ({
  tooltip: { backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' } },
  series: [{
    type: 'treemap',
    roam: false,
    breadcrumb: { show: false },
    nodeClick: false,
    label: { show: true, color: '#fff', fontFamily: 'Orbitron', fontSize: 12 },
    upperLabel: { show: true, color: '#E6F1FF', height: 24, fontFamily: 'Orbitron', fontSize: 10 },
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 2, gapWidth: 2 },
    levels: [{
      itemStyle: { borderWidth: 0, gapWidth: 6, borderColor: '#0A0E1A' },
      upperLabel: { show: false }
    }],
    data: categoryData.value
  }]
}))

const { elRef: roseEl }   = useECharts(roseOption)
const { elRef: tierEl }   = useECharts(tierOption)
const { elRef: platEl }   = useECharts(platformOption)
const { elRef: treeEl }   = useECharts(treemapOption)

const timestamp = ref(new Date().toISOString().slice(0, 10))
</script>

<template>
  <!-- KPI -->
  <div class="kpi-grid">
    <div class="kpi-card kpi-1">
      <div class="kpi-label">王者荣耀 · 英雄总数</div>
      <div class="kpi-value">{{ totalHeroes }}<span class="unit">HEROES</span></div>
      <div class="kpi-trend"><span class="arrow">▲</span> S43 赛季更新中</div>
    </div>
    <div class="kpi-card kpi-2">
      <div class="kpi-label">皮肤累计</div>
      <div class="kpi-value">{{ totalSkins }}<span class="unit">SKINS</span></div>
      <div class="kpi-trend"><span class="arrow">▲</span> 4 大品质 · 18 大系列</div>
    </div>
    <div class="kpi-card kpi-3">
      <div class="kpi-label">覆盖流行游戏</div>
      <div class="kpi-value">{{ totalGames }}<span class="unit">TITLES</span></div>
      <div class="kpi-trend"><span class="arrow">▲</span> 手游 + 端游 · 多类型</div>
    </div>
    <div class="kpi-card kpi-4">
      <div class="kpi-label">流行游戏 · 平均评分</div>
      <div class="kpi-value">{{ avgScore }}<span class="unit">/ 10</span></div>
      <div class="kpi-trend"><span class="arrow">▲</span> 数据截至 {{ timestamp }}</div>
    </div>
  </div>

  <div class="section-title">CORE METRICS · 核心分布</div>

  <div class="grid-1-2">
    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">英雄 · 六大职业分布</div>
        <div class="panel-meta">Nightingale Rose</div>
      </div>
      <div ref="roseEl" class="chart"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">皮肤 · 品质分布</div>
        <div class="panel-meta">Doughnut · Centered Total</div>
      </div>
      <div ref="tierEl" class="chart"></div>
    </div>
  </div>

  <div class="section-title">GAMES SPECTRUM · 游戏总览</div>

  <div class="grid-1-2">
    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">平台分布</div>
        <div class="panel-meta">Mobile / PC / Console</div>
      </div>
      <div ref="platEl" class="chart"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">类型热度</div>
        <div class="panel-meta">Treemap · Area-Encoded</div>
      </div>
      <div ref="treeEl" class="chart-tall" style="height: 360px;"></div>
    </div>
  </div>
</template>
