<script setup lang="ts">
import { Sparkles, Cpu, ArrowDown } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import Counter from './Counter.vue';
import { TOTAL_WORKS } from '@/data/works';
</script>

<template>
  <section class="relative pt-16 pb-24 overflow-hidden">
    <div class="absolute inset-0 bg-radial-fade" />
    <div class="absolute inset-0 bg-grid opacity-50" />
    <div class="absolute inset-0 noise" />

    <div class="absolute -top-32 -left-32 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl" />
    <div class="absolute top-32 -right-32 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon-violet/10 rounded-full blur-3xl" />

    <div class="container relative">
      <div class="flex flex-col items-center text-center max-w-5xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-neon-cyan/40 bg-neon-cyan/5 rounded-sm">
          <span class="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
          <span class="font-mono text-[10px] tracking-widest text-neon-cyan">
            DATABASE_v3.0 // RELEASED 2026-06-08 // VUE_3
          </span>
        </div>

        <h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
          <span class="block text-glow text-neon-cyan">GAME IP</span>
          <span class="block mt-1 text-gradient-neon">DERIVATIVES</span>
          <span class="block mt-1 text-white/90 text-3xl md:text-4xl lg:text-5xl">
            衍生作品 <span class="text-neon-pink">资料库</span>
          </span>
        </h1>

        <p class="mt-6 max-w-2xl text-base md:text-lg text-white/60 leading-relaxed">
          面向 <span class="text-neon-cyan font-medium">10 万级</span> 企业级规模，
          全球首个开源、现代化的 <span class="text-neon-cyan font-medium">游戏 IP 衍生作品</span> 浏览平台。
          覆盖动画、漫画、电影、小说、舞台剧、手办、周边、音乐、真人剧等
          <span class="text-neon-pink font-medium"> {{ TOTAL_WORKS.toLocaleString() }}+ </span>
          款真实条目，<span class="text-neon-violet font-medium">355+ </span> 个 IP。
        </p>

        <div class="mt-10 grid grid-cols-3 gap-4 md:gap-12">
          <div class="flex flex-col items-center">
            <div class="font-display text-3xl md:text-5xl font-black text-neon-pink">
              <Counter :end="TOTAL_WORKS" />
              <span class="text-white/40 text-2xl md:text-3xl">+</span>
            </div>
            <div class="mt-1 font-mono text-[10px] md:text-xs text-white/40 tracking-widest">DERIVATIVES</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="font-display text-3xl md:text-5xl font-black text-neon-cyan">
              <Counter :end="355" />
              <span class="text-white/40 text-2xl md:text-3xl">+</span>
            </div>
            <div class="mt-1 font-mono text-[10px] md:text-xs text-white/40 tracking-widest">GAME_IPS</div>
          </div>
          <div class="flex flex-col items-center">
            <div class="font-display text-3xl md:text-5xl font-black text-neon-violet">
              <Counter :end="100" />
              <span class="text-white/40 text-2xl md:text-3xl">K+</span>
            </div>
            <div class="mt-1 font-mono text-[10px] md:text-xs text-white/40 tracking-widest">SCALE_TARGET</div>
          </div>
        </div>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <RouterLink to="/browse" class="btn-neon group">
            <Sparkles class="w-4 h-4 group-hover:rotate-12 transition" />
            开始浏览
          </RouterLink>
          <RouterLink to="/dashboard" class="btn-neon btn-pink group">
            <Cpu class="w-4 h-4 group-hover:scale-110 transition" />
            数据看板
          </RouterLink>
          <a href="#stats" class="flex items-center gap-1 text-sm text-white/50 hover:text-white transition">
            <span class="font-mono">// 向下滚动</span>
            <ArrowDown class="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
