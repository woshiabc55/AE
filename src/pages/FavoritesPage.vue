<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import ToolGrid from '@/components/ToolGrid.vue'
import ToolDetail from '@/components/ToolDetail.vue'
import { useTools } from '@/composables/useTools'
import { ref } from 'vue'
import { Heart, ArrowLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const { favoriteTools } = useTools()
const activeId = ref<string | null>(null)
function openDetail(id: string) {
  activeId.value = id
}
function closeDetail() {
  activeId.value = null
}
</script>

<template>
  <div>
    <AppHeader />

    <main class="mx-auto max-w-[1600px] px-6 md:px-10 py-10 md:py-16">
      <div class="flex items-end justify-between flex-wrap gap-4 mb-8 md:mb-12">
        <div>
          <p class="issue-num text-[var(--muted)] flex items-center gap-2">
            <Heart :size="12" /> SECTION · FAVORITES
          </p>
          <h1 class="headline text-[clamp(2.4rem,7vw,5rem)] mt-2">
            Your <span class="headline-italic">Picks</span>
          </h1>
          <p class="font-display italic text-[1.1rem] mt-3 max-w-[58ch] text-balance">
            你已经从本期杂志里挑出了 {{ favoriteTools.length }} 件值得反复翻阅的工具。
          </p>
        </div>
        <RouterLink to="/" class="btn">
          <ArrowLeft :size="14" /> 回到首页
        </RouterLink>
      </div>

      <ToolGrid
        :tools="favoriteTools"
        empty-text="还没有收藏，去首页挑几个吧"
        @open="openDetail"
      />
    </main>

    <ToolDetail :tool-id="activeId" @close="closeDetail" />
  </div>
</template>
