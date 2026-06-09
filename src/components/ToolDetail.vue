<script setup lang="ts">
import type { AITool } from '@/data/tools'
import { coverUrl, fallbackUrl } from '@/composables/useImage'
import { useTools } from '@/composables/useTools'
import { X, ExternalLink, Heart, Hash } from 'lucide-vue-next'
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  toolId: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { getToolById, toggleFavorite, isFavorite } = useTools()

const tool = computed<AITool | null>(() => (props.toolId ? getToolById(props.toolId) || null : null))

const isOpen = computed(() => !!tool.value)

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.dataset.fallback === '1' || !tool.value) return
  img.dataset.fallback = '1'
  img.src = fallbackUrl(tool.value)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(isOpen, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <div class="drawer-mask" :class="{ 'is-open': isOpen }" @click="emit('close')" />
  <aside class="drawer" :class="{ 'is-open': isOpen }" :aria-hidden="!isOpen">
    <template v-if="tool">
      <div class="sticky top-0 z-10 bg-[var(--paper)] border-b border-line flex items-center justify-between px-5 py-3">
        <span class="mono text-[0.7rem] tracking-[0.25em] uppercase">Detail · № {{ tool.id.toUpperCase() }}</span>
        <button class="w-9 h-9 grid place-items-center border border-line" @click="emit('close')" aria-label="Close">
          <X :size="16" />
        </button>
      </div>

      <div class="img-wrap relative aspect-[4/3] bg-[var(--bg-soft)]">
        <div class="img-fallback absolute inset-0" />
        <img :src="coverUrl(tool)" :alt="tool.name" @error="onImgError" />
      </div>

      <div class="p-6 md:p-7 flex flex-col gap-5">
        <div>
          <p class="issue-num text-[var(--muted)]">{{ tool.category }} · {{ tool.vendor || 'INDEPENDENT' }}</p>
          <h2 class="headline text-[2.2rem] md:text-[2.6rem] mt-2 leading-[0.95]">{{ tool.name }}</h2>
          <p class="font-display italic text-[1.05rem] mt-3 text-balance">{{ tool.tagline }}</p>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="t in tool.tags"
            :key="t"
            class="mono text-[0.65rem] tracking-[0.2em] uppercase px-2 py-1 border border-line"
          >
            <Hash :size="10" class="inline-block -mt-0.5" />
            {{ t }}
          </span>
        </div>

        <p class="text-[0.95rem] leading-relaxed text-[var(--ink)]/90 text-balance">
          {{ tool.description }}
        </p>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <a
            :href="tool.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary justify-center"
          >
            访问官网 <ExternalLink :size="14" />
          </a>
          <button
            class="btn justify-center"
            :class="isFavorite(tool.id) ? 'bg-[var(--accent)] text-[var(--paper)] border-[var(--accent)]' : ''"
            @click="toggleFavorite(tool.id)"
          >
            <Heart :size="14" :fill="isFavorite(tool.id) ? 'currentColor' : 'none'" />
            {{ isFavorite(tool.id) ? '已收藏' : '加入收藏' }}
          </button>
        </div>

        <div class="mt-4 pt-5 border-t border-line/60 text-[var(--muted)]">
          <p class="mono text-[0.7rem] tracking-[0.25em] uppercase">Editorial Note</p>
          <p class="font-display italic mt-2 text-[0.95rem]">
            本期收录于《AI 工具宇宙》第 24 期「射击之星」专栏，
            由编辑部人工策展，并配合 AI 配图生成。如发现信息过时，欢迎提交 PR。
          </p>
        </div>
      </div>
    </template>
  </aside>
</template>
