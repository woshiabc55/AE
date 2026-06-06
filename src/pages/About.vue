<script setup lang="ts">
import { Database, Cpu, Heart, Globe2, Mail, Sparkles } from 'lucide-vue-next';
</script>

<template>
  <div class="container py-12 max-w-4xl">
    <div class="mb-10">
      <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-1">
        <Sparkles class="w-3.5 h-3.5" />
        <span>// ABOUT_THIS_PROJECT</span>
      </div>
      <h1 class="font-display text-3xl md:text-4xl font-bold text-gradient-neon">
        关于 NEON.FRAME
      </h1>
      <p class="text-white/60 mt-3 leading-relaxed">
        一份为 ACG 爱好者、游戏玩家和 IP 研究者打造的开源、现代化的游戏 IP 衍生作品资料库。
        基于 <span class="text-neon-cyan">Vue 3</span> + TypeScript + Vite 构建，承载 10 万级数据规模。
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="card-neon p-5">
        <div class="w-10 h-10 rounded-sm grid place-items-center bg-white/5 text-neon-cyan mb-3">
          <Database class="w-5 h-5" />
        </div>
        <div class="font-semibold text-lg text-white/90 mb-1">数据规模</div>
        <p class="text-sm text-white/60 leading-relaxed">
          覆盖 355+ 主流游戏 IP，聚合 4,200+ 款真实衍生作品，架构目标承载
          <span class="text-neon-cyan">10 万级</span>。涵盖动画、漫画、电影、小说、舞台剧、手办、周边、音乐、真人剧等 10 大类型。
        </p>
      </div>
      <div class="card-neon p-5">
        <div class="w-10 h-10 rounded-sm grid place-items-center bg-white/5 text-neon-pink mb-3">
          <Cpu class="w-5 h-5" />
        </div>
        <div class="font-semibold text-lg text-white/90 mb-1">技术栈</div>
        <p class="text-sm text-white/60 leading-relaxed">
          Vue 3 + Composition API + TypeScript + Vite 6 + Pinia + TailwindCSS +
          <span class="text-neon-pink">vue-virtual-scroller</span>（10 万级虚拟滚动）+
          <span class="text-neon-pink">Web Worker</span>（异步筛选）。
        </p>
      </div>
      <div class="card-neon p-5">
        <div class="w-10 h-10 rounded-sm grid place-items-center bg-white/5 text-neon-violet mb-3">
          <Globe2 class="w-5 h-5" />
        </div>
        <div class="font-semibold text-lg text-white/90 mb-1">覆盖范围</div>
        <p class="text-sm text-white/60 leading-relaxed">
          横跨日本、美国、中国、韩国、欧洲等地区，从 1985 年的早期游戏到 2026 年的最新作品，纵贯 40 余年游戏文化史。
        </p>
      </div>
      <div class="card-neon p-5">
        <div class="w-10 h-10 rounded-sm grid place-items-center bg-white/5 text-neon-yellow mb-3">
          <Heart class="w-5 h-5" />
        </div>
        <div class="font-semibold text-lg text-white/90 mb-1">设计理念</div>
        <p class="text-sm text-white/60 leading-relaxed">
          Cyber/Synthwave 暗黑 + 霓虹辉光，契合游戏 IP 的科技感与 ACG 圈层审美；桌面优先，移动端自适应。
        </p>
      </div>
    </div>

    <div class="mt-10 card-neon p-6">
      <div class="text-[10px] text-white/40 font-mono mb-2">// CHANGELOG</div>
      <ul class="space-y-2 text-sm text-white/70">
        <li class="flex gap-2">
          <span class="text-neon-cyan font-mono shrink-0">2026.06.08</span>
          <span><span class="chip text-neon-pink">v3.0</span> 迁移至 Vue 3 + 10 万级架构，新增 vue-virtual-scroller 虚拟滚动 + Web Worker 异步筛选。</span>
        </li>
        <li class="flex gap-2">
          <span class="text-neon-pink font-mono shrink-0">2026.05.15</span>
          <span>新增数据看板：类型分布、地区分布、年份趋势、Top 10 IP。</span>
        </li>
        <li class="flex gap-2">
          <span class="text-neon-violet font-mono shrink-0">2026.04.02</span>
          <span>浏览页：多维筛选 + 网格/列表视图 + 详情抽屉。</span>
        </li>
        <li class="flex gap-2">
          <span class="text-neon-yellow font-mono shrink-0">2026.02.20</span>
          <span>数据库 v1.0 正式上线，初版 2,000+ 款衍生作品。</span>
        </li>
      </ul>
    </div>

    <div class="mt-10 card-neon p-6 text-center">
      <Mail class="w-6 h-6 mx-auto text-neon-cyan mb-3" />
      <h3 class="font-display text-xl font-bold text-white/90">联系 & 贡献</h3>
      <p class="text-sm text-white/60 mt-2">
        数据如有错漏，欢迎指正；希望贡献新 IP 或新衍生作品条目，请发送至
        <span class="text-neon-cyan mx-1">hello@neon-frame.dev</span>
      </p>
      <div class="mt-4 flex items-center justify-center gap-2">
        <span class="chip text-neon-cyan">v3.0.0</span>
        <span class="chip text-neon-pink">VUE_3</span>
        <span class="chip text-neon-violet">100K_SCALE</span>
      </div>
    </div>
  </div>
</template>
