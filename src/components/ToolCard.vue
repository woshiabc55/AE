<script setup lang="ts">
import type { AITool } from '@/data/tools'
import { coverUrl, fallbackUrl } from '@/composables/useImage'
import { useTools } from '@/composables/useTools'
import { Heart, ExternalLink, Star } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  tool: AITool
  index: number
  size: 'small' | 'medium' | 'large'
}>()

const emit = defineEmits<{
  (e: 'open', id: string): void
}>()

const { toggleFavorite, isFavorite } = useTools()

const spanClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'span-3'
    case 'medium':
      return 'span-4'
    case 'large':
      return 'span-6'
  }
})

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.dataset.fallback === '1') return
  img.dataset.fallback = '1'
  img.src = fallbackUrl(props.tool)
}
</script>

<template>
  <article
    :class="['tool-card reveal flex flex-col', spanClass]"
    :data-id="tool.id"
    @click="emit('open', tool.id)"
    role="button"
    tabindex="0"
    @keydown.enter="emit('open', tool.id)"
  >
    <div
      class="img-wrap relative"
      :class="{
        'aspect-square': tool.size === 'square',
        'aspect-[4/5]': tool.size === 'portrait',
        'aspect-[4/3]': tool.size === 'landscape',
        'aspect-[9/16]': tool.size === 'tall'
      }"
    >
      <div class="img-fallback absolute inset-0" />
      <img
        :src="coverUrl(tool)"
        :alt="tool.name + ' - ' + tool.tagline"
        loading="lazy"
        decoding="async"
        @error="onImgError"
      />
      <div class="absolute top-3 left-3 flex items-center gap-2">
        <span class="mono text-[0.6rem] tracking-[0.25em] uppercase px-1.5 py-0.5 bg-[var(--paper)] text-[var(--ink)] border border-line">
          № {{ String(index + 1).padStart(3, '0') }}
        </span>
        <span
          v-if="tool.hot"
          class="mono text-[0.6rem] tracking-[0.25em] uppercase px-1.5 py-0.5 bg-[var(--accent)] text-[var(--paper)] inline-flex items-center gap-1"
        >
          <Star :size="9" :fill="'currentColor'" />
          HOT
        </span>
      </div>
      <button
        class="absolute top-3 right-3 w-8 h-8 grid place-items-center bg-[var(--paper)] border border-line hover:bg-[var(--accent)] hover:text-[var(--paper)] transition-colors"
        :aria-label="isFavorite(tool.id) ? 'Remove favorite' : 'Add favorite'"
        @click.stop="toggleFavorite(tool.id)"
      >
        <Heart :size="14" :fill="isFavorite(tool.id) ? 'currentColor' : 'none'" />
      </button>
      <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
        <span class="mono text-[0.62rem] tracking-[0.25em] uppercase px-1.5 py-0.5 bg-[var(--paper)]/85 text-[var(--ink)] border border-line">
          {{ tool.category }}
        </span>
        <span v-if="tool.vendor" class="mono text-[0.62rem] tracking-[0.18em] uppercase px-1.5 py-0.5 bg-[var(--ink)] text-[var(--paper)]">
          {{ tool.vendor }}
        </span>
      </div>
    </div>

    <div class="flex-1 p-4 md:p-5 flex flex-col gap-3 bg-[var(--paper)]">
      <h3 class="headline text-[1.4rem] md:text-[1.6rem] leading-[0.95] tracking-tighter2">
        {{ tool.name }}
      </h3>
      <p class="text-[0.9rem] text-[var(--ink)]/85 leading-snug text-balance italic font-display">
        {{ tool.tagline }}
      </p>
      <div class="mt-auto flex items-center justify-between pt-2 border-t border-line/60">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span
            v-for="tag in tool.tags.slice(0, 3)"
            :key="tag"
            class="mono text-[0.6rem] tracking-[0.16em] uppercase text-[var(--muted)]"
          >
            #{{ tag }}
          </span>
        </div>
        <a
          :href="tool.url"
          target="_blank"
          rel="noopener noreferrer"
          class="hover-underline mono text-[0.7rem] tracking-[0.2em] uppercase inline-flex items-center gap-1"
          @click.stop
        >
          Visit <ExternalLink :size="11" />
        </a>
      </div>
    </div>
  </article>
</template>
