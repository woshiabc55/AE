<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useTools } from '@/composables/useTools'
import { RouterLink, useRoute } from 'vue-router'
import ThemeSwitcher from './ThemeSwitcher.vue'
import SearchBar from './SearchBar.vue'

const { favorites } = useTools()
const route = useRoute()

const isHome = computed(() => route.name === 'home')
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line bg-[var(--paper)]/95 backdrop-blur">
    <div class="mx-auto max-w-[1600px] px-6 md:px-10 h-16 flex items-center gap-4 md:gap-8">
      <RouterLink to="/" class="flex items-center gap-3 group" aria-label="AI Toolverse">
        <span class="inline-grid place-items-center w-8 h-8 bg-[var(--ink)] text-[var(--paper)] mono text-[0.7rem]">A/</span>
        <span class="headline text-[1.15rem] md:text-[1.3rem] leading-none">AI TOOLVERSE</span>
        <span class="hidden md:inline issue-num text-[var(--muted)]">Issue No. 24 · Spring</span>
      </RouterLink>

      <div class="hidden md:flex flex-1 justify-center">
        <SearchBar v-if="isHome" />
      </div>

      <div class="flex items-center gap-2 md:gap-3 ml-auto">
        <RouterLink
          to="/favorites"
          class="btn"
          :class="route.name === 'favorites' ? 'btn-primary' : ''"
        >
          <Heart :size="14" :fill="route.name === 'favorites' ? 'currentColor' : 'none'" />
          <span class="hidden sm:inline">Favorites</span>
          <span class="mono text-[0.7rem] opacity-70">({{ favorites.length }})</span>
        </RouterLink>
        <ThemeSwitcher />
      </div>
    </div>

    <div class="md:hidden border-t border-line px-6 py-2">
      <SearchBar v-if="isHome" />
    </div>
  </header>
</template>
