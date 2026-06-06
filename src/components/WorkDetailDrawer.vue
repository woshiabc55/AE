<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import { X, Calendar, Globe2, Tag } from 'lucide-vue-next';
import { useAppStore } from '@/stores/app';
import { WORKS } from '@/data/works';
import { WORK_TYPE_LABELS, type WorkType } from '@/data/types';
import { Tv, Film, BookOpen, Library, Drama, Box, ShoppingBag, Music, Gamepad2, Clapperboard } from 'lucide-vue-next';

const store = useAppStore();

const ICON_MAP: Record<WorkType, any> = {
  anime: Tv, movie: Film, manga: BookOpen, novel: Library, stage: Drama,
  figure: Box, goods: ShoppingBag, ost: Music, mobile: Gamepad2, live: Clapperboard,
};

const work = computed(() => WORKS.find((w) => w.id === store.selectedWorkId) || null);
const related = computed(() =>
  work.value ? WORKS.filter((w) => w.ipId === work.value!.ipId && w.id !== work.value!.id).slice(0, 6) : []
);
const Icon = computed(() => (work.value ? ICON_MAP[work.value.type] || Tv : Tv));

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && store.drawerOpen) store.closeDrawer();
}
watch(() => store.drawerOpen, (open) => {
  if (open) window.addEventListener('keydown', onKey);
  else window.removeEventListener('keydown', onKey);
});
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="store.drawerOpen"
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        @click="store.closeDrawer()"
      />
    </Transition>
    <Transition name="slide">
      <aside
        v-if="store.drawerOpen && work"
        class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-strong overflow-y-auto slide-in-right"
      >
        <div
          class="relative h-48 overflow-hidden"
          :style="{ background: `linear-gradient(135deg, ${work.cover}dd 0%, ${work.cover}40 100%)` }"
        >
          <div class="absolute inset-0 bg-grid opacity-40" />
          <button
            @click="store.closeDrawer()"
            class="absolute top-3 right-3 w-9 h-9 grid place-items-center bg-black/40 hover:bg-black/60 backdrop-blur border border-white/20 rounded-sm transition"
          >
            <X class="w-4 h-4" />
          </button>
          <div class="absolute bottom-4 left-4 right-4 flex items-end gap-3">
            <div class="w-14 h-14 rounded-sm bg-black/50 backdrop-blur grid place-items-center border border-white/30">
              <component :is="Icon" class="w-7 h-7 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-mono text-white/70">{{ WORK_TYPE_LABELS[work.type] }}</div>
              <div class="text-lg font-bold text-white line-clamp-2">{{ work.title }}</div>
            </div>
          </div>
        </div>

        <div class="p-5 space-y-4">
          <div>
            <div class="text-[10px] text-white/40 font-mono tracking-widest mb-1">// SOURCE_IP</div>
            <div class="text-neon-pink font-semibold text-lg">{{ work.ipName }}</div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white/5 rounded-sm p-2.5 border border-white/5">
              <div class="text-[10px] text-white/40 font-mono flex items-center gap-1">
                <Calendar class="w-3.5 h-3.5" /> 发行年份
              </div>
              <div class="mt-0.5 font-medium">{{ work.year }}</div>
            </div>
            <div class="bg-white/5 rounded-sm p-2.5 border border-white/5">
              <div class="text-[10px] text-white/40 font-mono flex items-center gap-1">
                <Globe2 class="w-3.5 h-3.5" /> 地区
              </div>
              <div class="mt-0.5 font-medium">{{ work.region }}</div>
            </div>
            <div class="bg-white/5 rounded-sm p-2.5 border border-white/5">
              <div class="text-[10px] text-white/40 font-mono flex items-center gap-1">
                <Tag class="w-3.5 h-3.5" /> 载体
              </div>
              <div class="mt-0.5 font-medium">{{ work.platform }}</div>
            </div>
            <div class="bg-white/5 rounded-sm p-2.5 border border-white/5">
              <div class="text-[10px] text-white/40 font-mono">★ 热度</div>
              <div class="mt-0.5 font-medium text-neon-yellow">{{ work.popularity }}</div>
            </div>
          </div>

          <div>
            <div class="text-[10px] text-white/40 font-mono tracking-widest mb-2">// DESCRIPTION</div>
            <p class="text-sm text-white/80 leading-relaxed">{{ work.description }}</p>
          </div>

          <div v-if="work.tags.length">
            <div class="text-[10px] text-white/40 font-mono tracking-widest mb-2">// TAGS</div>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="t in work.tags" :key="t" class="chip text-neon-cyan">#{{ t }}</span>
            </div>
          </div>

          <div>
            <div class="text-[10px] text-white/40 font-mono tracking-widest mb-1.5">// POPULARITY_INDEX</div>
            <div class="h-2 bg-white/5 rounded overflow-hidden">
              <div class="bar-fill" :style="{ width: `${work.popularity}%` }" />
            </div>
            <div class="mt-1 text-right text-xs font-mono text-white/50">{{ work.popularity }}/100</div>
          </div>

          <div v-if="related.length">
            <div class="text-[10px] text-white/40 font-mono tracking-widest mb-2">// SAME_IP_DERIVATIVES</div>
            <div class="space-y-1.5">
              <div
                v-for="r in related"
                :key="r.id"
                class="flex items-center gap-2 p-2 rounded-sm bg-white/5 hover:bg-white/10 transition text-sm"
              >
                <div
                  class="w-6 h-6 rounded-sm grid place-items-center shrink-0"
                  :style="{ background: r.cover }"
                >
                  <span class="text-[10px] font-mono text-white/90">
                    {{ WORK_TYPE_LABELS[r.type].slice(0, 1) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="truncate">{{ r.title }}</div>
                  <div class="text-[10px] text-white/40 font-mono">{{ r.year }} · {{ r.platform }}</div>
                </div>
                <span class="text-[10px] font-mono text-neon-yellow">★{{ r.popularity }}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-white/10 text-center">
            <div class="text-[10px] text-white/30 font-mono">ID: {{ work.id }} // STABLE</div>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.35s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
