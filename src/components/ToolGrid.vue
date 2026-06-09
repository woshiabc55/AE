<script setup lang="ts">
import type { AITool } from '@/data/tools'
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import ToolCard from './ToolCard.vue'

const props = defineProps<{
  tools: AITool[]
  emptyText?: string
}>()

const emit = defineEmits<{
  (e: 'open', id: string): void
}>()

const containerRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function attachObserver() {
  if (!containerRef.value) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '120px 0px', threshold: 0.05 }
  )
  containerRef.value.querySelectorAll('.reveal').forEach((el) => observer?.observe(el))
}

function sizeFor(tool: AITool, idx: number): 'small' | 'medium' | 'large' {
  // 不规则排布：每隔几张放一张大卡
  if (tool.size === 'portrait' || tool.size === 'tall') return 'small'
  if (tool.hot) return 'large'
  if (tool.size === 'landscape') return 'medium'
  // 模式：A B A C A B A D ... 大卡间隔出现
  const r = idx % 7
  if (r === 3) return 'large'
  if (r === 5) return 'medium'
  return 'small'
}

onMounted(() => {
  nextTick(attachObserver)
})

watch(
  () => props.tools,
  () => {
    nextTick(attachObserver)
  }
)

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const empty = computed(() => props.tools.length === 0)
</script>

<template>
  <div ref="containerRef" class="magazine-grid">
    <template v-if="!empty">
      <ToolCard
        v-for="(tool, idx) in tools"
        :key="tool.id"
        :tool="tool"
        :index="idx"
        :size="sizeFor(tool, idx)"
        @open="(id) => emit('open', id)"
      />
    </template>

    <div
      v-else
      class="col-span-12 py-24 text-center border border-dashed border-line"
    >
      <p class="headline text-[2.2rem] md:text-[3rem]">NO MATCHES</p>
      <p class="mono mt-3 text-[var(--muted)]">{{ emptyText || '试试别的关键词或切换分类' }}</p>
    </div>
  </div>
</template>
