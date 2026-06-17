<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './layouts/AppSidebar.vue'

const route = useRoute()
const title = computed(() => (route.meta?.title as string) || '数据驾驶舱')
const subtitle = computed(() => (route.meta?.subtitle as string) || '')
const now = computed(() => {
  const d = new Date()
  return d.toISOString().slice(0, 19).replace('T', ' ')
})
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="app-main">
      <header class="page-header">
        <div>
          <h1 class="page-title">{{ title }}</h1>
          <div class="page-subtitle">{{ subtitle }}</div>
        </div>
        <div class="page-meta">
          <span class="dot"></span>
          <span>SYNC · {{ now }} UTC</span>
        </div>
      </header>
      <RouterView />
    </main>
  </div>
</template>
