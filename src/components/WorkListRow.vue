<script setup lang="ts">
import { Tv, Film, BookOpen, Library, Drama, Box, ShoppingBag, Music, Gamepad2, Clapperboard } from 'lucide-vue-next';
import type { DerivativeWork, WorkType } from '@/data/types';
import { WORK_TYPE_LABELS } from '@/data/types';
import { useAppStore } from '@/stores/app';

const props = defineProps<{ work: DerivativeWork }>();
const store = useAppStore();

const ICON_MAP: Record<WorkType, any> = {
  anime: Tv, movie: Film, manga: BookOpen, novel: Library, stage: Drama,
  figure: Box, goods: ShoppingBag, ost: Music, mobile: Gamepad2, live: Clapperboard,
};
const Icon = ICON_MAP[props.work.type] || Tv;

function open() { store.openDrawer(props.work.id); }
</script>

<template>
  <button
    @click="open"
    class="card-neon w-full text-left p-3 flex items-center gap-4 group"
  >
    <div
      class="w-16 h-16 shrink-0 rounded-sm grid place-items-center relative overflow-hidden"
      :style="{ background: `linear-gradient(135deg, ${work.cover}cc 0%, ${work.cover}40 100%)` }"
    >
      <component :is="Icon" class="w-6 h-6 text-white" />
      <div class="absolute inset-0 bg-grid opacity-30" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-white/90 line-clamp-1 group-hover:text-neon-cyan transition">
        {{ work.title }}
      </div>
      <div class="text-[11px] text-white/50 font-mono mt-0.5">
        {{ WORK_TYPE_LABELS[work.type] }} // {{ work.ipName }} // {{ work.platform }}
      </div>
      <div class="flex items-center gap-3 text-[10px] text-white/40 font-mono mt-1">
        <span>{{ work.year }}</span>
        <span>{{ work.region }}</span>
        <span class="flex items-center gap-1 text-neon-yellow">★ {{ work.popularity }}</span>
      </div>
    </div>
  </button>
</template>
