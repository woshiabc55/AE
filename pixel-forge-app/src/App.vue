<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const fullscreen = ref(false)

function enterFullscreen() {
  fullscreen.value = true
}

function exitFullscreen() {
  fullscreen.value = false
}

provide('fullscreen', readonly(fullscreen))
provide('enterFullscreen', enterFullscreen)
provide('exitFullscreen', exitFullscreen)

const navItems = [
  { id: 'home', label: '首页', icon: '⌂' },
  { id: 'editor', label: '编辑器', icon: '✏' },
  { id: 'docs', label: '文档', icon: '◈' },
  { id: 'versions', label: '版本', icon: '▶' },
]
</script>

<template>
  <div class="app-shell" :class="{ 'app-fullscreen': fullscreen }">
    <nav class="app-nav" v-show="!fullscreen">
      <span class="nav-logo" @click="router.push({ name: 'home' })">PF</span>
      <div v-for="item in navItems" :key="item.id" class="nav-item" :class="{ active: route.name === item.id }" @click="router.push({ name: item.id })">
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </nav>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&family=Fira+Code:wght@400;500&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { width: 100%; height: 100%; overflow: hidden; }
body { background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }
body::before { content: ''; position: fixed; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px); pointer-events: none; z-index: 9999; }
body::after { content: ''; position: fixed; inset: 0; background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%); pointer-events: none; z-index: 9998; }
</style>

<style scoped>
.app-shell { display: flex; height: 100%; position: relative; z-index: 1; transition: all 0.3s ease; }
.app-shell.app-fullscreen .app-main { width: 100%; flex: 1; }
.app-nav { width: 48px; background: #0a0a12; border-right: 1px solid #1a2a1a; display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 4px; flex-shrink: 0; transition: width 0.3s ease, opacity 0.3s ease; }
.nav-logo { font-family: 'Press Start 2P', monospace; font-size: 8px; color: #7cff6b; cursor: pointer; padding: 8px 0; text-shadow: 0 0 8px rgba(124,255,107,0.4); }
.nav-item { width: 40px; height: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; border-radius: 3px; transition: all 0.2s; }
.nav-item:hover { background: rgba(0,255,136,0.05); }
.nav-item.active { background: rgba(0,255,136,0.1); }
.nav-icon { font-size: 14px; color: #3a5a3a; }
.nav-item.active .nav-icon { color: #00ff88; }
.nav-item:hover .nav-icon { color: #6a8a6a; }
.nav-label { font-family: 'Press Start 2P', monospace; font-size: 4px; color: #3a5a3a; letter-spacing: 0.5px; }
.nav-item.active .nav-label { color: #00ff88; }
.app-main { flex: 1; overflow: hidden; }
</style>
