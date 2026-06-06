<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowRight, Zap, Layers, Cpu, Search, Database, BarChart3 } from 'lucide-vue-next';
import Hero from '@/components/Hero.vue';
import StatsDashboard from '@/components/StatsDashboard.vue';
import HotIPCarousel from '@/components/HotIPCarousel.vue';
import { WORKS } from '@/data/works';
import { WORK_TYPE_LABELS, type WorkType } from '@/data/types';

const typeStats = computed(() => {
  const m = new Map<string, number>();
  for (const w of WORKS) m.set(w.type, (m.get(w.type) || 0) + 1);
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
});
</script>

<template>
  <div class="relative">
    <Hero />

    <section id="stats" class="pb-20 relative">
      <div class="absolute inset-0 bg-grid opacity-30" />
      <div class="container relative">
        <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-6">
          <Database class="w-3.5 h-3.5" />
          <span>// STATISTICS_DASHBOARD</span>
        </div>
        <StatsDashboard />
      </div>
    </section>

    <HotIPCarousel />

    <section class="py-16 relative">
      <div class="container">
        <div class="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div class="flex items-center gap-2 text-neon-pink font-mono text-xs mb-1">
              <Layers class="w-3.5 h-3.5" />
              <span>// TYPE_DISTRIBUTION</span>
            </div>
            <h2 class="font-display text-2xl md:text-3xl font-bold text-gradient-cyan">
              衍生类型分布
            </h2>
          </div>
          <RouterLink to="/browse" class="btn-neon btn-pink text-xs">
            按类型浏览
            <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <RouterLink
            v-for="([t, n], i) in typeStats"
            :key="t"
            :to="`/browse?type=${t}`"
            class="card-neon p-4 group"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="text-xs text-white/50 font-mono">// 0{{ i + 1 }}</div>
              <div class="text-xs font-mono text-neon-cyan">{{ n.toLocaleString() }}</div>
            </div>
            <div class="font-semibold text-white/90 group-hover:text-neon-cyan transition">
              {{ WORK_TYPE_LABELS[t as WorkType] }}
            </div>
            <div class="mt-2 h-1 bg-white/5 rounded overflow-hidden">
              <div class="bar-fill" :style="{ width: `${(n / typeStats[0][1]) * 100}%` }" />
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container">
        <div class="flex items-center gap-2 text-neon-violet font-mono text-xs mb-6">
          <Cpu class="w-3.5 h-3.5" />
          <span>// FEATURES</span>
        </div>
        <h2 class="font-display text-2xl md:text-3xl font-bold text-gradient-neon mb-10">
          企业级性能 / 一站式浏览体验
        </h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="card-neon p-5 border-l-2 border-neon-cyan/30 hover:translate-y-[-3px] transition">
            <div class="w-10 h-10 rounded-sm grid place-items-center bg-white/5 text-neon-cyan mb-3">
              <Search class="w-5 h-5" />
            </div>
            <div class="font-semibold text-lg text-white/90 mb-1">多维检索</div>
            <p class="text-sm text-white/60 leading-relaxed">
              按 IP、类型、年份、地区、标签、关键词精准筛选，<span class="text-neon-cyan">Web Worker 异步</span>，毫秒级响应。
            </p>
          </div>
          <div class="card-neon p-5 border-l-2 border-neon-pink/30 hover:translate-y-[-3px] transition">
            <div class="w-10 h-10 rounded-sm grid place-items-center bg-white/5 text-neon-pink mb-3">
              <Database class="w-5 h-5" />
            </div>
            <div class="font-semibold text-lg text-white/90 mb-1">10 万级承载</div>
            <p class="text-sm text-white/60 leading-relaxed">
              虚拟滚动 + DOM 复用，仅渲染视口内 <span class="text-neon-pink">30-50</span> 节点，60fps 流畅滚动。
            </p>
          </div>
          <div class="card-neon p-5 border-l-2 border-neon-violet/30 hover:translate-y-[-3px] transition">
            <div class="w-10 h-10 rounded-sm grid place-items-center bg-white/5 text-neon-violet mb-3">
              <BarChart3 class="w-5 h-5" />
            </div>
            <div class="font-semibold text-lg text-white/90 mb-1">数据看板</div>
            <p class="text-sm text-white/60 leading-relaxed">
              可视化展示类型分布、地区趋势、年份演进，看见 IP 生态全貌。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container">
        <div class="card-neon p-8 md:p-12 text-center bg-gradient-to-br from-neon-pink/5 via-neon-violet/5 to-neon-cyan/5">
          <Zap class="w-8 h-8 mx-auto text-neon-yellow mb-4" />
          <h2 class="font-display text-2xl md:text-4xl font-bold text-gradient-cyan">
            准备好探索 10 万级游戏 IP 衍生宇宙了吗？
          </h2>
          <p class="mt-4 text-white/60 max-w-xl mx-auto">
            立即进入浏览页，体验企业级 60fps 虚拟滚动；或前往数据看板，俯瞰全球游戏文化衍生版图。
          </p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <RouterLink to="/browse" class="btn-neon">
              <Search class="w-4 h-4" />
              开始浏览
            </RouterLink>
            <RouterLink to="/dashboard" class="btn-neon btn-pink">
              <BarChart3 class="w-4 h-4" />
              数据看板
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
