<script setup lang="ts">
import { useTools } from '@/composables/useTools'
import { Search, X } from 'lucide-vue-next'

const { search, setSearch } = useTools()
</script>

<template>
  <label class="group flex items-center gap-3 w-full max-w-[420px] border-b border-line py-1.5">
    <Search :size="16" class="opacity-70" />
    <input
      :value="search"
      @input="(e) => setSearch((e.target as HTMLInputElement).value)"
      type="text"
      placeholder="搜索工具 / 标签 / 厂商 · e.g. 绘画, OpenAI"
      class="flex-1 bg-transparent outline-none text-[0.95rem] placeholder:text-[var(--muted)] font-sans"
    />
    <button
      v-if="search"
      @click="setSearch('')"
      class="opacity-60 hover:opacity-100"
      aria-label="Clear search"
    >
      <X :size="14" />
    </button>
  </label>
</template>
