<script setup lang="ts">
import { CATEGORIES } from '@/data/categories'
import { useTools } from '@/composables/useTools'

const { category, setCategory } = useTools()
</script>

<template>
  <nav class="border-y border-line">
    <div class="mx-auto max-w-[1600px] px-6 md:px-10">
      <div class="flex items-center gap-3 py-3 overflow-x-auto no-scrollbar">
        <span class="issue-num text-[var(--muted)] hidden md:inline-flex shrink-0">FILTER ·</span>
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          class="chip shrink-0"
          :class="category === cat.id ? 'is-active' : ''"
          @click="setCategory(cat.id)"
        >
          <span>{{ cat.name }}</span>
          <span class="ml-2 opacity-60">/ {{ cat.en }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
