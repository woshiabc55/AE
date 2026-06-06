<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ChevronDown, X, Search, SlidersHorizontal } from 'lucide-vue-next';
import { useAppStore } from '@/stores/app';
import { WORK_TYPE_LABELS, WORK_TYPE_LIST, REGION_LIST } from '@/data/types';
import type { WorkType, Region } from '@/data/types';
import { GAME_IPS } from '@/data/ips';

const store = useAppStore();
const ipQuery = ref('');

const ipList = computed(() => {
  const q = ipQuery.value.trim().toLowerCase();
  if (!q) return GAME_IPS.slice(0, 30);
  return GAME_IPS.filter(
    (g) => g.name.toLowerCase().includes(q) || g.nameEn.toLowerCase().includes(q)
  ).slice(0, 30);
});

const hasFilter = computed(() => store.activeFilterCount > 0);
</script>

<template>
  <div class="glass rounded-sm p-4 md:p-5 space-y-4 sticky top-20 z-30">
    <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs">
      <SlidersHorizontal class="w-3.5 h-3.5" />
      <span>// FILTERS</span>
      <span v-if="hasFilter" class="text-neon-yellow">[{{ store.activeFilterCount }}]</span>
      <button
        v-if="hasFilter"
        @click="store.resetFilters()"
        class="ml-auto flex items-center gap-1 text-white/40 hover:text-neon-pink text-[10px] tracking-widest"
      >
        <X class="w-3 h-3" /> RESET
      </button>
    </div>

    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan" />
      <input
        :value="store.query"
        @input="(e) => store.setQuery((e.target as HTMLInputElement).value)"
        placeholder="搜索作品名 / IP / 标签..."
        class="w-full bg-ink-700/60 border border-white/10 focus:border-neon-cyan/60 focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2 text-sm rounded-sm font-mono placeholder:text-white/30 transition"
      />
    </div>

    <div>
      <div class="text-[10px] text-white/40 font-mono tracking-widest mb-1.5">类型</div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="t in WORK_TYPE_LIST"
          :key="t"
          @click="store.toggleType(t as WorkType)"
          :class="[
            'text-xs px-2.5 py-1 rounded-sm border transition',
            store.types.includes(t as WorkType)
              ? 'border-neon-pink bg-neon-pink/10 text-neon-pink shadow-neon-pink'
              : 'border-white/10 text-white/60 hover:border-neon-cyan/40 hover:text-neon-cyan'
          ]"
        >
          {{ WORK_TYPE_LABELS[t as WorkType] }}
        </button>
      </div>
    </div>

    <div>
      <div class="text-[10px] text-white/40 font-mono tracking-widest mb-1.5">地区</div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="r in REGION_LIST"
          :key="r"
          @click="store.toggleRegion(r as Region)"
          :class="[
            'text-xs px-2.5 py-1 rounded-sm border transition',
            store.regions.includes(r as Region)
              ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-neon-cyan'
              : 'border-white/10 text-white/60 hover:border-neon-cyan/40 hover:text-neon-cyan'
          ]"
        >
          {{ r }}
        </button>
      </div>
    </div>

    <details class="group">
      <summary class="flex items-center justify-between cursor-pointer text-white/80 text-xs font-mono py-1 list-none">
        <span class="flex items-center gap-2">
          <span>// 选择 IP</span>
          <span v-if="store.ipIds.length" class="text-neon-yellow">({{ store.ipIds.length }})</span>
        </span>
        <ChevronDown class="w-3.5 h-3.5 group-open:rotate-180 transition" />
      </summary>
      <div class="mt-2 space-y-2">
        <input
          v-model="ipQuery"
          placeholder="搜索 IP 名..."
          class="w-full bg-ink-700/40 border border-white/10 outline-none px-2.5 py-1.5 text-xs rounded-sm font-mono placeholder:text-white/30"
        />
        <div class="max-h-56 overflow-y-auto pr-1 space-y-1">
          <button
            v-for="ip in ipList"
            :key="ip.id"
            @click="store.toggleIp(ip.id)"
            :class="[
              'w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-xs text-left transition',
              store.ipIds.includes(ip.id)
                ? 'bg-neon-violet/15 text-neon-violet border border-neon-violet/30'
                : 'hover:bg-white/5 text-white/70 border border-transparent'
            ]"
          >
            <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: ip.color }" />
            <span class="truncate flex-1">{{ ip.name }}</span>
            <span class="text-[10px] text-white/30 font-mono">{{ ip.region }}</span>
          </button>
        </div>
      </div>
    </details>

    <div>
      <div class="text-[10px] text-white/40 font-mono tracking-widest mb-1.5">
        年份 {{ store.yearRange[0] }} - {{ store.yearRange[1] }}
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input
          type="number"
          :value="store.yearRange[0]"
          min="1985"
          :max="store.yearRange[1]"
          @change="(e) => store.setYearRange([Number((e.target as HTMLInputElement).value), store.yearRange[1]])"
          class="w-full bg-ink-700/40 border border-white/10 outline-none px-2 py-1.5 text-xs font-mono rounded-sm"
        />
        <input
          type="number"
          :value="store.yearRange[1]"
          :min="store.yearRange[0]"
          max="2026"
          @change="(e) => store.setYearRange([store.yearRange[0], Number((e.target as HTMLInputElement).value)])"
          class="w-full bg-ink-700/40 border border-white/10 outline-none px-2 py-1.5 text-xs font-mono rounded-sm"
        />
      </div>
      <input
        type="range"
        min="1985"
        max="2026"
        :value="store.yearRange[1]"
        @input="(e) => store.setYearRange([store.yearRange[0], Number((e.target as HTMLInputElement).value)])"
        class="w-full mt-2 accent-neon-cyan"
      />
    </div>
  </div>
</template>
