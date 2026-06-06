<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <div class="scan-line" />
    <Navbar />
    <main class="flex-1 relative z-10">
      <RouterView />
    </main>
    <footer class="border-t border-white/5 py-6 mt-12">
      <div class="container flex flex-wrap items-center justify-between gap-3 text-xs text-white/40 font-mono">
        <div>
          <span class="text-neon-cyan">NEON.FRAME</span> // GAME_IP_DERIVATIVES_ARCHIVE
        </div>
        <div class="flex items-center gap-4">
          <span>© 2026</span>
          <span class="text-neon-pink">v3.0.0</span>
          <span>BUILD 20260608</span>
          <span class="text-neon-violet">VUE_3</span>
        </div>
      </div>
    </footer>
  </div>
</template>
