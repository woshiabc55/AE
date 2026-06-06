<script setup lang="ts">
import { BarChart3, TrendingUp, Globe2, Layers } from 'lucide-vue-next';
import { computed } from 'vue';
import { WORKS } from '@/data/works';
import { GAME_IPS } from '@/data/ips';
import { WORK_TYPE_LABELS, type WorkType } from '@/data/types';

const COLORS = ['#ff2d95', '#00f0ff', '#9d4edd', '#ffd60a', '#39ff14', '#ff6b6b', '#4ecdc4', '#a78bfa', '#f97316', '#06b6d4'];

const typeData = computed(() => {
  const m = new Map<string, number>();
  for (const w of WORKS) m.set(w.type, (m.get(w.type) || 0) + 1);
  return Array.from(m.entries())
    .map(([t, n], i) => ({
      label: WORK_TYPE_LABELS[t as WorkType],
      value: n,
      color: COLORS[Object.keys(WORK_TYPE_LABELS).indexOf(t) % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);
});

const regionData = computed(() => {
  const m = new Map<string, number>();
  for (const w of WORKS) m.set(w.region, (m.get(w.region) || 0) + 1);
  return Array.from(m.entries())
    .map(([r, n]) => ({ label: r, value: n }))
    .sort((a, b) => b.value - a.value);
});

const yearData = computed(() => {
  const m = new Map<number, number>();
  for (const w of WORKS) m.set(w.year, (m.get(w.year) || 0) + 1);
  const arr = Array.from(m.entries()).map(([y, n]) => ({ year: y, n })).sort((a, b) => a.year - b.year);
  const buckets: { year: number; n: number }[] = [];
  for (let y = 1985; y <= 2026; y += 5) {
    const n = arr.filter((a) => a.year >= y && a.year < y + 5).reduce((s, a) => s + a.n, 0);
    buckets.push({ year: y, n });
  }
  return buckets;
});

const topIps = computed(() => {
  const m = new Map<string, number>();
  for (const w of WORKS) m.set(w.ipId, (m.get(w.ipId) || 0) + 1);
  return Array.from(m.entries())
    .map(([id, n]) => ({ id, name: GAME_IPS.find((g) => g.id === id)?.name || id, value: n }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
});

const maxYear = computed(() => Math.max(...yearData.value.map((d) => d.n)));
const maxType = computed(() => typeData.value[0]?.value || 1);
const maxRegion = computed(() => regionData.value[0]?.value || 1);
const maxIp = computed(() => topIps.value[0]?.value || 1);
</script>

<template>
  <div class="container py-10">
    <div class="mb-8">
      <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-1">
        <BarChart3 class="w-3.5 h-3.5" />
        <span>// DATA_DASHBOARD</span>
      </div>
      <h1 class="font-display text-3xl md:text-4xl font-bold text-gradient-neon">
        数据看板
      </h1>
      <p class="text-white/50 mt-2">从多维度俯瞰游戏 IP 衍生作品生态。</p>
    </div>

    <div class="grid md:grid-cols-2 gap-5">
      <!-- 类型分布 -->
      <div class="card-neon p-5">
        <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-4">
          <Layers class="w-3.5 h-3.5" />
          <span>// TYPE_DISTRIBUTION</span>
        </div>
        <div class="space-y-2.5">
          <div v-for="d in typeData" :key="d.label" class="flex items-center gap-3">
            <div class="text-xs text-white/70 w-24 shrink-0">{{ d.label }}</div>
            <div class="flex-1 h-6 bg-white/5 rounded-sm overflow-hidden relative">
              <div
                class="h-full rounded-sm flex items-center justify-end px-2"
                :style="{
                  width: `${(d.value / maxType) * 100}%`,
                  background: `linear-gradient(90deg, ${d.color}55, ${d.color}cc)`,
                }"
              >
                <span class="text-[10px] font-mono font-bold text-white drop-shadow">{{ d.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地区分布 -->
      <div class="card-neon p-5">
        <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-4">
          <Globe2 class="w-3.5 h-3.5" />
          <span>// REGION_DISTRIBUTION</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(d, i) in regionData"
            :key="d.label"
            class="p-3 bg-white/5 border border-white/10 rounded-sm hover:border-neon-cyan/40 transition"
          >
            <div class="flex items-baseline justify-between">
              <div class="text-xs text-white/60 font-mono">// 0{{ i + 1 }}</div>
              <div class="text-[10px] text-white/30 font-mono">{{ ((d.value / maxRegion) * 100).toFixed(0) }}%</div>
            </div>
            <div class="mt-1 font-semibold text-white/90">{{ d.label }}</div>
            <div class="font-display text-2xl font-black text-neon-cyan mt-1">{{ d.value }}</div>
            <div class="mt-2 h-1 bg-white/5 rounded overflow-hidden">
              <div class="bar-fill" :style="{ width: `${(d.value / maxRegion) * 100}%` }" />
            </div>
          </div>
        </div>
      </div>

      <!-- 年份趋势 -->
      <div class="card-neon p-5 md:col-span-2">
        <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-4">
          <TrendingUp class="w-3.5 h-3.5" />
          <span>// YEAR_TREND (5-Year Buckets)</span>
        </div>
        <div class="flex items-end gap-1 h-48 pt-4">
          <div v-for="d in yearData" :key="d.year" class="flex-1 flex flex-col items-center justify-end group">
            <div class="text-[9px] font-mono text-neon-cyan opacity-0 group-hover:opacity-100 transition mb-1">{{ d.n }}</div>
            <div
              class="w-full bg-gradient-to-t from-neon-pink to-neon-cyan rounded-t-sm hover:from-neon-yellow hover:to-neon-pink transition-all"
              :style="{ height: `${Math.max(2, (d.n / maxYear) * 100)}%` }"
            />
            <div class="mt-1 text-[9px] text-white/40 font-mono -rotate-45 origin-top-left whitespace-nowrap">{{ d.year }}</div>
          </div>
        </div>
      </div>

      <!-- Top 10 IP -->
      <div class="card-neon p-5 md:col-span-2">
        <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-4">
          <TrendingUp class="w-3.5 h-3.5" />
          <span>// TOP_10_IPS</span>
        </div>
        <div class="space-y-1.5">
          <div v-for="(d, i) in topIps" :key="d.id" class="flex items-center gap-3 group">
            <div class="text-[10px] text-white/30 font-mono w-5 text-right">#{{ i + 1 }}</div>
            <div class="text-xs text-white/80 w-32 truncate group-hover:text-neon-cyan transition">{{ d.name }}</div>
            <div class="flex-1 h-5 bg-white/5 rounded-sm overflow-hidden relative">
              <div
                class="h-full rounded-sm flex items-center px-2 text-[10px] font-mono font-bold text-white"
                :style="{
                  width: `${(d.value / maxIp) * 100}%`,
                  background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}55, ${COLORS[i % COLORS.length]})`,
                }"
              >
                {{ d.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 card-neon p-5">
      <div class="text-[10px] text-white/40 font-mono mb-2">// DATA_SUMMARY</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div class="text-[10px] text-white/40 font-mono tracking-widest">总衍生作品</div>
          <div class="font-display text-2xl font-black text-neon-cyan">{{ WORKS.length.toLocaleString() }}</div>
        </div>
        <div>
          <div class="text-[10px] text-white/40 font-mono tracking-widest">覆盖 IP</div>
          <div class="font-display text-2xl font-black text-neon-pink">{{ GAME_IPS.length.toLocaleString() }}</div>
        </div>
        <div>
          <div class="text-[10px] text-white/40 font-mono tracking-widest">类型</div>
          <div class="font-display text-2xl font-black text-neon-violet">{{ typeData.length }}</div>
        </div>
        <div>
          <div class="text-[10px] text-white/40 font-mono tracking-widest">地区</div>
          <div class="font-display text-2xl font-black text-neon-yellow">{{ regionData.length }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
