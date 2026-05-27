<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { VERSIONS } from '../core/versions'
import VersionDetail from '../components/VersionDetail.vue'

interface TabEntry {
  id: string
  label: string
  name: string
  color: string
  path: string
}

const selectedId = ref('v1')
const rightTab = ref('detail')

const selected = computed(() => VERSIONS.find(v => v.id === selectedId.value)!)

const timelineItems = VERSIONS.map((v, i) => ({
  ...v,
  index: i,
  isLast: i === VERSIONS.length - 1,
}))

const openTabs = reactive<TabEntry[]>([])
const activeTabId = ref<string | null>(null)
const fullscreenTabId = ref<string | null>(null)
const longPressTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function openAsTab(version: typeof VERSIONS[number]) {
  const exists = openTabs.find(t => t.id === version.id)
  if (!exists) {
    openTabs.push({
      id: version.id,
      label: version.label,
      name: version.name,
      color: version.color,
      path: version.path,
    })
  }
  activeTabId.value = version.id
  rightTab.value = 'embed'
}

function closeTab(tabId: string, e?: Event) {
  if (e) e.stopPropagation()
  const idx = openTabs.findIndex(t => t.id === tabId)
  if (idx !== -1) openTabs.splice(idx, 1)
  if (activeTabId.value === tabId) {
    activeTabId.value = openTabs.length > 0 ? openTabs[openTabs.length - 1]!.id : null
  }
  if (fullscreenTabId.value === tabId) {
    fullscreenTabId.value = null
  }
}

function selectTab(tabId: string) {
  activeTabId.value = tabId
  selectedId.value = tabId
}

function onTabDoubleClick(tabId: string) {
  fullscreenTabId.value = tabId
}

function onTabMouseDown(tabId: string) {
  longPressTimer.value = setTimeout(() => {
    if (fullscreenTabId.value === tabId) {
      fullscreenTabId.value = null
    }
  }, 600)
}

function onTabMouseUp() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

function onTabTouchStart(tabId: string) {
  longPressTimer.value = setTimeout(() => {
    if (fullscreenTabId.value === tabId) {
      fullscreenTabId.value = null
    }
  }, 600)
}

function onTabTouchEnd() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

function exitFullscreen() {
  fullscreenTabId.value = null
}

const activeTab = computed(() => {
  return openTabs.find(t => t.id === activeTabId.value) || null
})

const fullscreenTab = computed(() => {
  if (!fullscreenTabId.value) return null
  return openTabs.find(t => t.id === fullscreenTabId.value) || null
})
</script>

<template>
  <div class="versions-page">
    <header class="v-header">
      <h1 class="v-title">▶ 版本迭代设计</h1>
      <span class="v-sub">v1→v7 · MCOP映射 · 嵌套查看 · 双击全屏 · 长按退出</span>
    </header>

    <div class="v-body">
      <aside class="v-timeline">
        <div v-for="item in timelineItems" :key="item.id" class="timeline-item" :class="{ active: selectedId === item.id }" @click="selectedId = item.id">
          <div class="timeline-dot" :style="{ background: selectedId === item.id ? item.color : '#1a2a1a', boxShadow: selectedId === item.id ? '0 0 8px ' + item.color : 'none' }"></div>
          <div class="timeline-connector" v-if="!item.isLast" :class="{ lit: selectedId === item.id }"></div>
          <div class="timeline-content">
            <span class="timeline-label" :style="{ color: selectedId === item.id ? item.color : '#3a5a3a' }">{{ item.label }}</span>
            <span class="timeline-name">{{ item.name }}</span>
            <span class="timeline-desc">{{ item.desc }}</span>
            <span class="timeline-count">{{ item.cumulativeCount }} caps</span>
          </div>
        </div>
      </aside>

      <main class="v-main">
        <div class="v-main-header">
          <span class="v-badge" :style="{ color: selected.color, borderColor: selected.color }">{{ selected.label }}</span>
          <span class="v-name">{{ selected.name }}</span>
          <span class="v-desc-main">{{ selected.desc }}</span>
          <span class="spacer"></span>
          <button class="open-tab-btn" @click="openAsTab(selected)">+ 打开为标签</button>
          <span class="v-ws">workspace: {{ selected.workspace.replace('workspace-', '') }}</span>
        </div>

        <div class="tab-bar" v-if="openTabs.length > 0">
          <div
            v-for="tab in openTabs"
            :key="tab.id"
            class="tab-item"
            :class="{ active: activeTabId === tab.id }"
            :style="{ '--tab-color': tab.color }"
            @click="selectTab(tab.id)"
            @dblclick="onTabDoubleClick(tab.id)"
            @mousedown="onTabMouseDown(tab.id)"
            @mouseup="onTabMouseUp"
            @mouseleave="onTabMouseUp"
            @touchstart="onTabTouchStart(tab.id)"
            @touchend="onTabTouchEnd"
          >
            <span class="tab-dot" :style="{ background: tab.color }"></span>
            <span class="tab-label">{{ tab.label }}</span>
            <span class="tab-close" @click="closeTab(tab.id, $event)">✕</span>
          </div>
        </div>

        <div class="v-main-body">
          <div class="v-left-col">
            <VersionDetail :version="selected" />
          </div>
          <div class="v-right-col">
            <div class="v-right-tabs">
              <div class="v-right-tab" :class="{ active: rightTab === 'detail' }" @click="rightTab = 'detail'">配置</div>
              <div class="v-right-tab" :class="{ active: rightTab === 'embed' }" @click="rightTab = 'embed'">嵌套</div>
            </div>
            <div class="v-right-content">
              <template v-if="rightTab === 'detail'">
                <div class="config-section">
                  <div class="config-title" style="color:#00ff88">迭代配置</div>
                  <div class="config-body">
                    <pre class="config-json">{{ JSON.stringify({
                      version: selected.label,
                      workspace: selected.workspace,
                      pipeline: selected.pipeline.id,
                      scene: selected.scene.id,
                      agents: selected.agents.map(a => a.id),
                      effects: selected.effects.map(e => e.id),
                      events: selected.events.map(e => e.name),
                      skillPacks: selected.skillPacks,
                      newCapabilities: selected.newCapabilities,
                    }, null, 2) }}</pre>
                  </div>
                </div>
                <div class="config-section">
                  <div class="config-title" style="color:#44ddff">能力累积</div>
                  <div class="config-body">
                    <div class="bar-chart">
                      <div v-for="v in VERSIONS" :key="v.id" class="bar-row">
                        <span class="bar-label" :style="{ color: v.color }">{{ v.label }}</span>
                        <div class="bar-track">
                          <div class="bar-fill" :style="{ width: (v.cumulativeCount / 20 * 100) + '%', background: v.color }"></div>
                        </div>
                        <span class="bar-val">{{ v.cumulativeCount }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="rightTab === 'embed'">
                <div class="embed-area" v-if="activeTab">
                  <div class="embed-bar">
                    <span class="embed-dot" :style="{ background: activeTab.color }"></span>
                    <span class="embed-title" :style="{ color: activeTab.color }">{{ activeTab.label }} · {{ activeTab.name }}</span>
                    <span class="embed-hint">双击标签全屏 · 长按退出</span>
                  </div>
                  <iframe
                    :src="activeTab.path + 'index.html'"
                    class="embed-iframe"
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
                <div v-else class="embed-empty">
                  <span class="empty-icon">◈</span>
                  <span>点击上方「+ 打开为标签」加载版本实例</span>
                  <span class="empty-hint">双击标签 → 全屏 · 长按标签 → 退出全屏</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </main>
    </div>

    <Teleport to="body">
      <div v-if="fullscreenTab" class="fullscreen-overlay" @mousedown="onTabMouseDown(fullscreenTab!.id)" @mouseup="onTabMouseUp" @touchstart="onTabTouchStart(fullscreenTab!.id)" @touchend="onTabTouchEnd">
        <div class="fullscreen-bar">
          <span class="fs-dot" :style="{ background: fullscreenTab.color }"></span>
          <span class="fs-title" :style="{ color: fullscreenTab.color }">{{ fullscreenTab.label }} · {{ fullscreenTab.name }}</span>
          <span class="fs-hint">长按任意位置退出全屏</span>
          <span class="spacer"></span>
          <span class="fs-close" @click="exitFullscreen">✕ 退出</span>
        </div>
        <iframe
          :src="fullscreenTab.path + 'index.html'"
          class="fullscreen-iframe"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.versions-page { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }
.v-header { height: 48px; display: flex; align-items: center; padding: 0 20px; gap: 16px; border-bottom: 1px solid #1a2a1a; background: #0a0a12; flex-shrink: 0; }
.v-title { font-family: 'Press Start 2P', monospace; font-size: 10px; color: #ffaa00; letter-spacing: 2px; }
.v-sub { font-size: 10px; color: #3a5a3a; }
.v-body { flex: 1; display: overflow: hidden; display: flex; }

.v-timeline { width: 220px; background: #0a0a12; border-right: 1px solid #1a2a1a; overflow-y: auto; padding: 16px 0; flex-shrink: 0; position: relative; }
.timeline-item { position: relative; padding: 8px 16px 8px 32px; cursor: pointer; transition: background 0.2s; }
.timeline-item:hover { background: rgba(255,255,255,0.02); }
.timeline-item.active { background: rgba(0,255,136,0.04); }
.timeline-dot { position: absolute; left: 14px; top: 14px; width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s; z-index: 2; }
.timeline-connector { position: absolute; left: 17px; top: 26px; width: 2px; height: calc(100% - 18px); background: #1a2a1a; z-index: 1; }
.timeline-connector.lit { background: linear-gradient(to bottom, #00ff88, #1a2a1a); }
.timeline-content { display: flex; flex-direction: column; gap: 2px; }
.timeline-label { font-family: 'Press Start 2P', monospace; font-size: 6px; letter-spacing: 1px; transition: color 0.2s; }
.timeline-name { font-size: 11px; color: #d0ffd0; }
.timeline-desc { font-size: 9px; color: #3a5a3a; }
.timeline-count { font-family: 'Press Start 2P', monospace; font-size: 4px; color: #3a5a3a; letter-spacing: 0.5px; }

.v-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.v-main-header { height: 40px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 10px; flex-shrink: 0; }
.v-badge { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 3px 8px; border: 1px solid; border-radius: 2px; letter-spacing: 1px; }
.v-name { font-size: 13px; color: #d0ffd0; }
.v-desc-main { font-size: 10px; color: #3a5a3a; }
.spacer { flex: 1; }
.v-ws { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; border: 1px solid #1a2a1a; padding: 2px 6px; border-radius: 2px; }

.open-tab-btn { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 4px 10px; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; }
.open-tab-btn:hover { border-color: #00ff88; color: #00ff88; background: rgba(0,255,136,0.05); }

.tab-bar { height: 30px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; display: flex; align-items: stretch; padding: 0 4px; gap: 2px; flex-shrink: 0; overflow-x: auto; }
.tab-item { display: flex; align-items: center; gap: 4px; padding: 0 8px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; user-select: none; }
.tab-item:hover { background: rgba(255,255,255,0.02); }
.tab-item.active { border-bottom-color: var(--tab-color); background: rgba(0,255,136,0.03); }
.tab-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.tab-label { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #6a8a6a; letter-spacing: 0.5px; }
.tab-item.active .tab-label { color: #d0ffd0; }
.tab-close { font-size: 9px; color: #3a5a3a; padding: 0 2px; margin-left: 2px; border-radius: 2px; transition: all 0.2s; }
.tab-close:hover { color: #ff3366; background: rgba(255,51,102,0.1); }

.v-main-body { flex: 1; display: flex; overflow: hidden; }
.v-left-col { flex: 1; overflow-y: auto; padding: 12px; }
.v-right-col { width: 340px; border-left: 1px solid #1a2a1a; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
.v-right-tabs { display: flex; border-bottom: 1px solid #1a2a1a; flex-shrink: 0; }
.v-right-tab { flex: 1; padding: 6px 0; font-family: 'Press Start 2P', monospace; font-size: 5px; text-align: center; color: #3a5a3a; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; border-bottom: 2px solid transparent; }
.v-right-tab:hover { color: #6a8a6a; }
.v-right-tab.active { color: #44ddff; border-bottom-color: #44ddff; background: rgba(68,221,255,0.03); }
.v-right-content { flex: 1; overflow-y: auto; padding: 10px; }

.config-section { margin-bottom: 10px; border: 1px solid #1a2a1a; border-radius: 3px; overflow: hidden; }
.config-title { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 6px 8px; letter-spacing: 1px; background: #0f0f1a; }
.config-body { padding: 8px; border-top: 1px solid #1a2a1a; }
.config-json { background: #0a0a14; border: 1px solid #1a2a1a; border-radius: 3px; padding: 10px; font-family: 'Fira Code', monospace; font-size: 9px; color: #a9b1d6; overflow-x: auto; white-space: pre; margin: 0; }
.bar-chart { display: flex; flex-direction: column; gap: 4px; }
.bar-row { display: flex; align-items: center; gap: 6px; }
.bar-label { font-family: 'Press Start 2P', monospace; font-size: 5px; min-width: 50px; letter-spacing: 0.5px; }
.bar-track { flex: 1; height: 8px; background: #1a2a1a; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s; }
.bar-val { font-size: 10px; color: #6a8a6a; min-width: 20px; text-align: right; }

.embed-area { border: 1px solid #1a2a1a; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; }
.embed-bar { height: 26px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 8px; gap: 6px; }
.embed-dot { width: 5px; height: 5px; border-radius: 50%; }
.embed-title { font-family: 'Press Start 2P', monospace; font-size: 5px; letter-spacing: 1px; }
.embed-hint { font-size: 8px; color: #3a5a3a; margin-left: auto; }
.embed-iframe { width: 100%; height: 400px; border: none; background: #050508; }

.embed-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 10px; color: #3a5a3a; }
.empty-icon { font-size: 36px; opacity: 0.3; }
.empty-hint { font-size: 8px; color: #2a3a2a; }
</style>

<style>
.fullscreen-overlay { position: fixed; inset: 0; z-index: 10000; background: #050508; display: flex; flex-direction: column; animation: fsIn 0.3s ease; }
@keyframes fsIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.fullscreen-bar { height: 36px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 8px; flex-shrink: 0; }
.fs-dot { width: 8px; height: 8px; border-radius: 50%; }
.fs-title { font-family: 'Press Start 2P', monospace; font-size: 7px; letter-spacing: 1px; }
.fs-hint { font-size: 9px; color: #3a5a3a; margin-left: 8px; }
.fs-close { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #3a5a3a; cursor: pointer; padding: 4px 8px; border: 1px solid #1a2a1a; border-radius: 2px; transition: all 0.2s; letter-spacing: 1px; }
.fs-close:hover { border-color: #ff3366; color: #ff3366; }
.fullscreen-iframe { flex: 1; width: 100%; border: none; background: #050508; }
</style>
