<script setup lang="ts">
import { computed } from 'vue'
import skins from '../data/skins.json'
import { useECharts, type ECOption } from '../composables/useECharts'

const summary = skins.summary

// 品质分布
const tierData = computed(() => {
  const t = summary.tierDistribution
  return [
    { name: '勇者',  value: t.common, itemStyle: { color: '#60A5FA' } },
    { name: '史诗',  value: t.epic,   itemStyle: { color: '#A78BFA' } },
    { name: '传说',  value: t.legend, itemStyle: { color: '#FFD460' } },
    { name: '荣耀',  value: t.glory,  itemStyle: { color: '#FF2E63' } }
  ]
})

// 系列 Top10
const topSeries = computed(() => [...summary.topSeries].sort((a, b) => b.count - a.count).slice(0, 10))

// 年度趋势
const yearly = computed(() => summary.yearlyTrend)

const tierOption = computed<ECOption>(() => ({
  tooltip: {
    trigger: 'item', backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' },
    formatter: '{b}<br/>{c} 款 · {d}%'
  },
  series: [{
    type: 'pie',
    radius: ['52%', '78%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    itemStyle: { borderColor: '#0A0E1A', borderWidth: 3 },
    label: {
      show: true, position: 'outside',
      color: '#E6F1FF', fontFamily: 'Orbitron', fontSize: 11,
      formatter: '{b}\n{c}款'
    },
    labelLine: { lineStyle: { color: '#00E5FF' }, length: 12, length2: 16 },
    data: tierData.value
  }],
  graphic: [{
    type: 'text', left: 'center', top: '45%',
    style: { text: summary.totalSkins, fill: '#FFD460', font: '700 36px Orbitron', textAlign: 'center' }
  }, {
    type: 'text', left: 'center', top: '60%',
    style: { text: 'SKINS · TOTAL', fill: '#8892B0', font: '500 10px Orbitron', textAlign: 'center', letterSpacing: 3 }
  }]
}))

const seriesOption = computed<ECOption>(() => {
  const names = topSeries.value.map((d) => d.series).reverse()
  const values = topSeries.value.map((d) => d.count).reverse()
  return {
    grid: { top: 10, left: 110, right: 40, bottom: 30 },
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
      barWidth: 16,
      itemStyle: {
        borderRadius: [0, 2, 2, 0],
        color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(255,46,99,0.2)' },
            { offset: 1, color: '#FF2E63' }
          ]
        }
      },
      label: { show: true, position: 'right', color: '#FF2E63', fontFamily: 'Orbitron', fontSize: 10 }
    }]
  }
})

const yearOption = computed<ECOption>(() => ({
  grid: { top: 30, left: 50, right: 30, bottom: 50 },
  tooltip: {
    trigger: 'axis', axisPointer: { type: 'cross' },
    backgroundColor: 'rgba(10,14,26,0.92)', borderColor: '#00E5FF', textStyle: { color: '#E6F1FF' }
  },
  xAxis: {
    type: 'category', data: yearly.value.map((d) => d.year),
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
    type: 'line', data: yearly.value.map((d) => d.count),
    smooth: true, symbol: 'circle', symbolSize: 10,
    lineStyle: { width: 3, color: '#A78BFA' },
    itemStyle: { color: '#A78BFA', borderColor: '#0A0E1A', borderWidth: 2 },
    areaStyle: {
      color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(167,139,250,0.36)' },
          { offset: 1, color: 'rgba(167,139,250,0)' }
        ]
      }
    }
  }]
}))

const { elRef: tierEl }   = useECharts(tierOption)
const { elRef: seriesEl } = useECharts(seriesOption)
const { elRef: yearEl }   = useECharts(yearOption)
</script>

<template>
  <div class="grid-2">
    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">皮肤品质分布</div>
        <div class="panel-meta">Common / Epic / Legend / Glory</div>
      </div>
      <div ref="tierEl" class="chart-tall"></div>
    </div>

    <div class="panel">
      <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
      <span class="panel-corner bl"></span><span class="panel-corner br"></span>
      <div class="panel-head">
        <div class="panel-title">系列 Top 10</div>
        <div class="panel-meta">Top Skin Series</div>
      </div>
      <div ref="seriesEl" class="chart-tall"></div>
    </div>
  </div>

  <div class="panel">
    <span class="panel-corner tl"></span><span class="panel-corner tr"></span>
    <span class="panel-corner bl"></span><span class="panel-corner br"></span>
    <div class="panel-head">
      <div class="panel-title">年度皮肤上新趋势</div>
      <div class="panel-meta">Skin Releases · 2015 → 2026</div>
    </div>
    <div ref="yearEl" class="chart"></div>
  </div>
</template>
