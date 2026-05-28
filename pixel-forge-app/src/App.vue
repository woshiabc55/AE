<script setup lang="ts">
import { ref, provide, readonly, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const fullscreen = ref(false)
const showOriginDropdown = ref(false)

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
  { id: 'tool', label: '工具', icon: '◈' },
  { id: 'editor', label: '编辑器', icon: '✏' },
  { id: 'model-editor', label: '模型', icon: '◈' },
  { id: 'dataset', label: '数据', icon: '▣' },
  { id: 'training', label: '训练', icon: '⬡' },
  { id: 'docs', label: '文档', icon: '◈' },
  { id: 'versions', label: '版本', icon: '▶' },
]

const originMenuItems = [
  { id: 'tool', label: '稻锊 · 主要工具', desc: 'MD文档查看 + 图像预览', icon: '◈' },
  { id: 'model-editor', label: '模型编辑器', desc: 'Canvas Pixel 模型编辑', icon: '◈' },
  { id: 'editor', label: '像素编辑器', desc: '像素绘制 + 效果渲染', icon: '✏' },
  { id: 'dataset', label: '数据集标注', desc: '图文→标注数据制作', icon: '▣' },
  { id: 'training', label: '训练管线', desc: 'Node训练 + 空链后端', icon: '⬡' },
  { id: 'versions', label: '版本迭代', desc: 'v1-v7 迭代预览', icon: '▶' },
  { id: 'docs', label: 'MCOP文档', desc: '文档框架浏览', icon: '◈' },
]

function onOriginDblClick() {
  showOriginDropdown.value = !showOriginDropdown.value
}

function onOriginMenuSelect(id: string) {
  showOriginDropdown.value = false
  router.push({ name: id })
}

function closeDropdown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.origin-dropdown') && !target.closest('.nav-logo')) {
    showOriginDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="app-shell" :class="{ 'app-fullscreen': fullscreen }">
    <nav class="app-nav" v-show="!fullscreen">
      <span class="nav-logo" @click="router.push({ name: 'home' })" @dblclick.stop="onOriginDblClick">PF</span>
      <div v-for="item in navItems" :key="item.id" class="nav-item" :class="{ active: route.name === item.id }" @click="router.push({ name: item.id })">
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </nav>
    <main class="app-main">
      <router-view />
    </main>

    <Teleport to="body">
      <div class="origin-dropdown" :class="{ open: showOriginDropdown }">
        <div class="od-header">
          <span class="od-logo">PIXEL FORGE</span>
          <span class="od-sub">稻锊 模型 编辑器</span>
        </div>
        <div class="od-divider"></div>
        <div
          v-for="item in originMenuItems"
          :key="item.id"
          class="od-item"
          @click="onOriginMenuSelect(item.id)"
        >
          <span class="od-icon">{{ item.icon }}</span>
          <div class="od-text">
            <span class="od-label">{{ item.label }}</span>
            <span class="od-desc">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </Teleport>
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
.nav-logo { font-family: 'Press Start 2P', monospace; font-size: 8px; color: #7cff6b; cursor: pointer; padding: 8px 0; text-shadow: 0 0 8px rgba(124,255,107,0.4); user-select: none; }
.nav-logo:hover { text-shadow: 0 0 16px rgba(124,255,107,0.7); }
.nav-item { width: 40px; height: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; border-radius: 3px; transition: all 0.2s; }
.nav-item:hover { background: rgba(0,255,136,0.05); }
.nav-item.active { background: rgba(0,255,136,0.1); }
.nav-icon { font-size: 14px; color: #3a5a3a; }
.nav-item.active .nav-icon { color: #00ff88; }
.nav-item:hover .nav-icon { color: #6a8a6a; }
.nav-label { font-family: 'Press Start 2P', monospace; font-size: 4px; color: #3a5a3a; letter-spacing: 0.5px; }
.nav-item.active .nav-label { color: #00ff88; }
.app-main { flex: 1; overflow: hidden; }

.origin-dropdown {
  position: fixed;
  top: 8px;
  left: 56px;
  z-index: 10001;
  background: #0a0a12;
  border: 1px solid #1a2a1a;
  border-radius: 6px;
  padding: 8px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.08);
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.origin-dropdown.open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}
.od-header {
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.od-logo {
  font-family: 'Press Start 2P', monospace;
  font-size: 7px;
  color: #7cff6b;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(124,255,107,0.3);
}
.od-sub {
  font-family: 'Press Start 2P', monospace;
  font-size: 5px;
  color: #ffaa00;
  letter-spacing: 1px;
}
.od-divider {
  height: 1px;
  background: #1a2a1a;
  margin: 6px 0;
}
.od-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}
.od-item:hover {
  background: rgba(0,255,136,0.06);
}
.od-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}
.od-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.od-label {
  font-family: 'Press Start 2P', monospace;
  font-size: 6px;
  color: #d0ffd0;
  letter-spacing: 1px;
}
.od-desc {
  font-size: 9px;
  color: #3a5a3a;
}
</style>