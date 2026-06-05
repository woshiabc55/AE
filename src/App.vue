<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'
import ShortcutLayer from '@/components/ShortcutLayer.vue'

const route = useRoute()

const nav = [
  { to: '/', label: '总览', en: 'Overview', icon: 'overview' },
  { to: '/scene/one', label: '分镜一', en: 'Iron Chain', icon: 'sword' },
  { to: '/scene/two', label: '分镜二', en: 'Blood Trade', icon: 'blade' },
  { to: '/scene/three', label: '分镜三', en: 'Fall & Rise', icon: 'horse' },
  { to: '/scene/four', label: '分镜四', en: 'Kilometre', icon: 'fire' },
  { to: '/motion-bus', label: '动态总线', en: 'Motion Bus', icon: 'bus' },
  { to: '/prompts', label: '提示词库', en: 'Prompts', icon: 'prompt' },
  { to: '/particles', label: '粒子演示', en: 'Particles', icon: 'spark' }
]

const activeKey = computed(() => {
  if (route.name === 'scene') return `/scene/${route.params.id}`
  return route.path
})
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">
          <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
            <path d="M14 8 L46 32 L14 56" stroke="var(--c-bronze)" stroke-width="2.5" fill="none" stroke-linecap="square"/>
            <circle cx="48" cy="32" r="3.4" fill="var(--c-blood)"/>
          </svg>
        </div>
        <div class="brand-text">
          <div class="brand-title display">铁链惊蛰</div>
          <div class="brand-sub">STORYBOARD · 60s</div>
        </div>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: activeKey === item.to }"
        >
          <span class="nav-icon" :data-icon="item.icon" aria-hidden="true"></span>
          <span class="nav-label">
            <span class="nav-zh">{{ item.label }}</span>
            <span class="nav-en">{{ item.en }}</span>
          </span>
          <span class="nav-bar" aria-hidden="true"></span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="serif muted" style="font-size:11px; letter-spacing:.18em;">RUNWAY · PIKA · SORA</div>
        <div class="muted" style="font-size:10px; margin-top:6px; opacity:.6;">v0.1 · 2026</div>
      </div>
    </aside>

    <main class="main">
      <ShortcutLayer />
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}
.sidebar {
  width: 248px;
  flex: 0 0 248px;
  background: linear-gradient(180deg, #0D0D12 0%, #08080B 100%);
  border-right: 1px solid var(--c-line);
  padding: var(--s-6) var(--s-5);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  margin-bottom: var(--s-7);
}
.brand-mark {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: var(--c-ink-2);
  border: 1px solid var(--c-line-strong);
  clip-path: var(--clip-shard);
}
.brand-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--c-bronze-glow);
  letter-spacing: 0.06em;
  line-height: 1;
}
.brand-sub {
  font-family: var(--f-mono);
  font-size: 9px;
  color: var(--c-ash);
  margin-top: 4px;
  letter-spacing: 0.18em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: 10px 12px;
  border-radius: var(--r-2);
  color: var(--c-ash-2);
  font-size: 13px;
  transition: color var(--t-fast), background var(--t-fast);
}
.nav-item:hover { color: #E8E1D4; background: rgba(176, 141, 87, 0.05); }
.nav-item.active {
  color: var(--c-bronze-glow);
  background: linear-gradient(90deg, rgba(176, 141, 87, 0.12), rgba(176, 141, 87, 0));
}
.nav-bar {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--c-bronze-glow);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform var(--t-med);
}
.nav-item.active .nav-bar { transform: scaleY(1); }

.nav-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  position: relative;
  opacity: 0.85;
  flex: 0 0 18px;
}
.nav-icon[data-icon="overview"]::after { content: ''; position: absolute; inset: 3px; border-top: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; }
.nav-icon[data-icon="sword"]::after { content: ''; position: absolute; left: 3px; right: 3px; top: 50%; height: 1.5px; background: currentColor; transform: translateY(-50%) rotate(35deg); transform-origin: center; }
.nav-icon[data-icon="blade"]::after { content: ''; position: absolute; left: 3px; right: 3px; top: 50%; height: 1.5px; background: currentColor; transform: translateY(-50%) rotate(-35deg); }
.nav-icon[data-icon="horse"]::after { content: ''; position: absolute; left: 4px; right: 4px; top: 6px; height: 6px; border-left: 1.5px solid currentColor; border-right: 1.5px solid currentColor; border-top: 1.5px solid currentColor; border-radius: 6px 6px 0 0; }
.nav-icon[data-icon="fire"]::after { content: ''; position: absolute; left: 5px; right: 5px; top: 4px; bottom: 4px; background: currentColor; clip-path: polygon(50% 0, 100% 60%, 60% 100%, 0 50%); }
.nav-icon[data-icon="bus"]::after { content: ''; position: absolute; inset: 4px; border: 1.5px solid currentColor; border-top: none; }
.nav-icon[data-icon="prompt"]::after { content: ''; position: absolute; left: 3px; right: 3px; top: 4px; height: 1.5px; background: currentColor; box-shadow: 0 3px 0 0 currentColor, 0 6px 0 0 currentColor, 0 9px 0 0 currentColor; }
.nav-icon[data-icon="spark"]::after { content: ''; position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; background: currentColor; transform: translate(-50%, -50%) rotate(45deg); }

.nav-label { display: flex; flex-direction: column; line-height: 1.1; }
.nav-zh { font-family: var(--f-serif); font-size: 13px; font-weight: 500; }
.nav-en { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.16em; color: var(--c-ash); margin-top: 2px; }
.nav-item.active .nav-en { color: var(--c-bronze); }

.sidebar-footer {
  margin-top: var(--s-5);
  padding-top: var(--s-4);
  border-top: 1px dashed var(--c-line);
}

.main {
  flex: 1;
  min-width: 0;
  padding: var(--s-7) var(--s-8) var(--s-8);
  position: relative;
  z-index: 2;
}

.page-enter-active, .page-leave-active { transition: opacity .35s, transform .35s; }
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }

@media (max-width: 1024px) {
  .sidebar { width: 200px; flex: 0 0 200px; padding: var(--s-5) var(--s-4); }
  .main { padding: var(--s-5) var(--s-5) var(--s-6); }
}
@media (max-width: 720px) {
  .layout { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: static; flex-direction: row; align-items: center; gap: var(--s-4); padding: var(--s-3) var(--s-4); }
  .brand { margin: 0; }
  .nav { flex-direction: row; flex-wrap: wrap; flex: 1; gap: 0; }
  .nav-item { padding: 6px 10px; }
  .sidebar-footer { display: none; }
  .main { padding: var(--s-4); }
}
</style>
