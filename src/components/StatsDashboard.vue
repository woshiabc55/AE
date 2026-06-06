<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Gamepad2, Globe2, Calendar, Sparkles } from 'lucide-vue-next';
import { GAME_IPS } from '@/data/ips';
import { TOTAL_WORKS } from '@/data/works';
import { generateLargeDataset } from '@/composables/useLargeDataset';
import Counter from './Counter.vue';

const totalWorks = ref(TOTAL_WORKS);
onMounted(() => {
  // 异步计算 10 万级数据集规模
  setTimeout(() => {
    totalWorks.value = generateLargeDataset(100_000).length;
  }, 50);
});

const stats = computed(() => {
  const regions = new Set(GAME_IPS.map((g) => g.region));
  return {
    ips: GAME_IPS.length,
    works: totalWorks.value,
    regions: regions.size,
  };
});

const items = computed(() => [
  { icon: Gamepad2, label: 'IP 数量', value: stats.value.ips, accent: 'from-neon-cyan to-neon-pink', iconColor: 'text-neon-cyan' },
  { icon: Sparkles, label: '衍生作品 (10万级)', value: stats.value.works, accent: 'from-neon-pink to-neon-violet', iconColor: 'text-neon-pink' },
  { icon: Globe2, label: '覆盖地区', value: stats.value.regions, accent: 'from-neon-violet to-neon-yellow', iconColor: 'text-neon-violet' },
  { icon: Calendar, label: '架构目标', value: 100, suffix: ' K', accent: 'from-neon-yellow to-neon-cyan', iconColor: 'text-neon-yellow' },
]);
</script>

<template>
  <section class="container">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(it, i) in items"
        :key="it.label"
        class="card-neon p-5 group hover:translate-y-[-2px] transition-transform"
        :style="{ animationDelay: `${i * 80}ms` }"
      >
        <div class="flex items-center justify-between mb-3">
          <div :class="['w-10 h-10 rounded-sm grid place-items-center border border-current/30', it.iconColor]">
            <component :is="it.icon" class="w-5 h-5" />
          </div>
          <div class="font-mono text-[10px] text-white/30">// 0{{ i + 1 }}</div>
        </div>
        <div :class="['font-display text-3xl md:text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent', it.accent]">
          <Counter :end="it.value" :suffix="it.suffix || ''" />
        </div>
        <div class="mt-1 text-sm text-white/60 font-medium">{{ it.label }}</div>
        <div class="mt-3 h-1 bg-white/5 rounded overflow-hidden">
          <div class="bar-fill" :style="{ width: `${Math.min(100, 40 + i * 15)}%` }" />
        </div>
      </div>
    </div>
  </section>
</template>
