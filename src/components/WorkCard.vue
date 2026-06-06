<script setup lang="ts">
import { Tv, Film, BookOpen, Library, Drama, Box, ShoppingBag, Music, Gamepad2, Clapperboard } from 'lucide-vue-next';
import type { DerivativeWork, WorkType } from '@/data/types';
import { WORK_TYPE_LABELS } from '@/data/types';
import { useAppStore } from '@/stores/app';

const props = defineProps<{ work: DerivativeWork; size?: 'normal' | 'compact' | 'mini' }>();
const store = useAppStore();

const ICON_MAP: Record<WorkType, any> = {
  anime: Tv, movie: Film, manga: BookOpen, novel: Library, stage: Drama,
  figure: Box, goods: ShoppingBag, ost: Music, mobile: Gamepad2, live: Clapperboard,
};
const Icon = ICON_MAP[props.work.type] || Tv;

function open() {
  store.openDrawer(props.work.id);
}
</script>

<template>
  <button
    @click="open"
    class="card-neon text-left group block w-full focus:outline-none focus:ring-2 focus:ring-neon-cyan/60"
  >
    <div class="relative h-32 overflow-hidden" :style="{ background: `linear-gradient(135deg, ${work.cover}cc 0%, ${work.cover}40 100%)` }">
      <div class="absolute inset-0 bg-grid opacity-30" />
      <div class="absolute top-2 left-2 w-8 h-8 rounded-sm grid place-items-center bg-black/40 backdrop-blur border border-white/20 text-white">
        <component :is="Icon" class="w-4 h-4" />
      </div>
      <div class="absolute top-2 right-2 chip bg-black/40 backdrop-blur text-white border-white/30">
        {{ WORK_TYPE_LABELS[work.type] }}
      </div>
      <div class="absolute bottom-2 right-2 text-[10px] font-mono text-white/70 bg-black/40 backdrop-blur px-1.5 py-0.5 rounded-sm">
        {{ work.platform }}
      </div>
      <div class="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-mono">
        <span class="text-neon-yellow">★</span>
        <span class="text-white/90 font-bold">{{ work.popularity }}</span>
      </div>
      <div class="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-neon-cyan/30 transition" />
    </div>

    <div class="p-3 space-y-2">
      <div class="font-semibold text-sm text-white/90 line-clamp-1 group-hover:text-neon-cyan transition">
        {{ work.title }}
      </div>
      <div class="text-[11px] text-white/50 font-mono line-clamp-1">
        ← <span class="text-neon-pink">{{ work.ipName }}</span>
      </div>
      <div class="flex items-center gap-3 text-[10px] text-white/40 font-mono">
        <span>{{ work.year }}</span>
        <span>{{ work.region }}</span>
      </div>
      <div v-if="work.tags.length" class="flex items-center gap-1 flex-wrap">
        <span
          v-for="t in work.tags.slice(0, 2)"
          :key="t"
          class="text-[9px] px-1.5 py-0.5 bg-white/5 text-white/50 rounded-sm border border-white/10"
        >
          #{{ t }}
        </span>
        <span v-if="work.tags.length > 2" class="text-[9px] text-white/30 font-mono">
          +{{ work.tags.length - 2 }}
        </span>
      </div>
    </div>
  </button>
</template>
