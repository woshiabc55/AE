<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { TrendingUp, Sparkles, Flame, ChevronRight } from 'lucide-vue-next';
import { GAME_IPS } from '@/data/ips';
import { WORKS } from '@/data/works';
import { topNByIpCount } from '@/utils/format';

const top = computed(() => {
  const list = topNByIpCount(WORKS, 16);
  return list
    .map((x) => ({ ...x, ip: GAME_IPS.find((g) => g.id === x.id)! }))
    .filter((x) => x.ip);
});
const loop = computed(() => [...top.value, ...top.value]);
</script>

<template>
  <section class="relative py-16 overflow-hidden">
    <div class="container">
      <div class="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <div class="flex items-center gap-2 text-neon-pink font-mono text-xs mb-1">
            <Flame class="w-3.5 h-3.5" />
            <span>// TOP_RANKING</span>
          </div>
          <h2 class="font-display text-2xl md:text-3xl font-bold text-gradient-cyan">
            衍生最丰富的 IP TOP 16
          </h2>
        </div>
        <RouterLink to="/browse" class="btn-neon btn-pink text-xs">
          查看全部
          <ChevronRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </div>

    <div class="relative">
      <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink-900 to-transparent z-10 pointer-events-none" />
      <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink-900 to-transparent z-10 pointer-events-none" />
      <div class="flex gap-4 animate-marquee w-max pl-4 pr-4">
        <RouterLink
          v-for="(x, i) in loop"
          :key="`${x.id}-${i}`"
          :to="`/browse?ip=${x.id}`"
          class="group relative w-56 shrink-0 card-neon block"
        >
          <div
            class="h-32 relative overflow-hidden"
            :style="{ background: `linear-gradient(135deg, ${x.ip.color}aa 0%, ${x.ip.color}33 100%)` }"
          >
            <div class="absolute inset-0 bg-grid opacity-50" />
            <div class="absolute top-2 right-2 chip text-white border-white/30 bg-black/30">
              <TrendingUp class="w-3 h-3" /> #{{ x.count }}
            </div>
            <div class="absolute bottom-2 left-3 font-display text-3xl font-black text-white/90 leading-none">
              {{ x.ip.name.length > 4 ? x.ip.name.slice(0, 4) : x.ip.name }}
            </div>
            <Sparkles class="absolute top-2 left-2 w-4 h-4 text-white/60 group-hover:text-neon-yellow transition" />
          </div>
          <div class="p-3">
            <div class="font-semibold text-sm text-white/90 line-clamp-1">{{ x.ip.name }}</div>
            <div class="font-mono text-xs text-neon-cyan/80 mt-1 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
              {{ x.count }} 款衍生作品
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
