<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue'
import { VERSIONS } from '../core/versions'
import VersionDetail from '../components/VersionDetail.vue'
import AgentPanel from '../components/AgentPanel.vue'

const selectedId = ref('v1')
const loadedId = ref<string | null>(null)
const showDetail = ref(false)

const fullscreen = inject<Ref<boolean>>('fullscreen', ref(false))
const enterFullscreen = inject<() => void>('enterFullscreen', () => {})
const exitFullscreen = inject<() => void>('exitFullscreen', () => {})

const selected = computed(() => VERSIONS.find(v => v.id === selectedId.value)!)

const loadedVersion = computed(() => {
  if (!loadedId.value) return null
  return VERSIONS.find(v => v.id === loadedId.value) || null
})

const timelineItems = VERSIONS.map((v, i) => ({
  ...v,
  index: i,
  isLast: i === VERSIONS.length - 1,
}))

function loadVersion(version: typeof VERSIONS[number]) {
  loadedId.value = version.id
}

function unloadVersion() {
  loadedId.value = null
}

function onTimelineClick(version: typeof VERSIONS[number]) {
  selectedId.value = version.id
  loadVersion(version)
}

function onTimelineDblClick(version: typeof VERSIONS[number]) {
  loadedId.value = version.id
  enterFullscreen()
}

function closeAgentPanel() {
  exitFullscreen()
  setTimeout(() => {
    loadedId.value = null
  }, 400)
}

const monitorTab = computed(() => {
  if (!loadedId.value) return null
  const v = VERSIONS.find(ver => ver.id === loadedId.value)
  return v ? { id: v.id, label: v.label, name: v.name, color: v.color, path: v.path } : null
})
</script>

<template>
  <div class="versions-page">
    <header class="v-header">
      <h1 class="v-title">▶ 版本迭代设计</h1>
      <span class="v-sub">v1→v7 · 点击载入 · 双击全屏</span>
    </header>

    <div class="v-body">
      <aside class="v-timeline">
        <div class="timeline-head">版本选择</div>
        <div v-for="item in timelineItems" :key="item.id" class="timeline-item" :class="{ active: selectedId === item.id, loaded: loadedId === item.id }" @click="onTimelineClick(item)" @dblclick="onTimelineDblClick(item)">
          <div class="timeline-dot" :style="{ background: selectedId === item.id ? item.color : '#1a2a1a', boxShadow: selectedId === item.id ? '0 0 8px ' + item.color : 'none' }"></div>
          <div class="timeline-connector" v-if="!item.isLast" :class="{ lit: selectedId === item.id }"></div>
          <div class="timeline-content">
            <span class="timeline-label" :style="{ color: selectedId === item.id ? item.color : '#3a5a3a' }">{{ item.label }}</span>
            <span class="timeline-name">{{ item.name }}</span>
            <span class="timeline-desc">{{ item.desc }}</span>
            <span class="timeline-count">{{ item.cumulativeCount }} caps</span>
          </div>
          <span v-if="loadedId === item.id" class="timeline-loaded">◉</span>
        </div>
      </aside>

      <div class="v-loader">
        <div class="loader-head">
          <span class="loader-title">载入版本</span>
        </div>
        <div class="loader-list">
          <div
            v-for="v in VERSIONS"
            :key="v.id"
            class="loader-item"
            :class="{ active: loadedId === v.id, selected: selectedId === v.id }"
            :style="{ '--v-color': v.color }"
            @click="loadVersion(v)"
            @dblclick="onTimelineDblClick(v)"
          >
            <span class="loader-dot" :style="{ background: v.color }"></span>
            <span class="loader-label">{{ v.label }}</span>
            <span v-if="loadedId === v.id" class="loader-badge">LIVE</span>
          </div>
        </div>
        <div class="loader-info" v-if="selected">
          <div class="loader-info-row">
            <span class="loader-info-key">版本</span>
            <span class="loader-info-val" :style="{ color: selected.color }">{{ selected.label }}</span>
          </div>
          <div class="loader-info-row">
            <span class="loader-info-key">名称</span>
            <span class="loader-info-val">{{ selected.name }}</span>
          </div>
          <div class="loader-info-row">
            <span class="loader-info-key">空间</span>
            <span class="loader-info-val">{{ selected.workspace.replace('workspace-', '') }}</span>
          </div>
          <div class="loader-info-row">
            <span class="loader-info-key">能力</span>
            <span class="loader-info-val">{{ selected.cumulativeCount }}</span>
          </div>
          <button class="detail-toggle" @click="showDetail = !showDetail">{{ showDetail ? '◁ 收起' : '▷ 详情' }}</button>
        </div>
      </div>

      <main class="v-main">
        <div class="v-main-header" v-if="loadedVersion">
          <span class="v-badge" :style="{ color: loadedVersion.color, borderColor: loadedVersion.color }">{{ loadedVersion.label }}</span>
          <span class="v-name">{{ loadedVersion.name }}</span>
          <span class="v-desc-main">{{ loadedVersion.desc }}</span>
          <span class="spacer"></span>
          <button class="unload-btn" @click="unloadVersion">✕ 关闭</button>
          <button class="fullscreen-btn" @click="onTimelineDblClick(loadedVersion)">◉ 全屏</button>
        </div>
        <div class="v-main-header" v-else>
          <span class="v-hint-main">← 选择版本载入</span>
        </div>

        <div class="v-main-body">
          <div class="v-viewport" v-if="loadedVersion">
            <iframe
              :src="loadedVersion.path + 'index.html'"
              class="v-iframe"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
          <div class="v-empty" v-else>
            <span class="empty-icon">▶</span>
            <span class="empty-text">点击左侧版本载入预览</span>
            <span class="empty-hint">单击 → 主镜头载入 · 双击 → 全屏GENT</span>
          </div>

          <div class="v-detail-panel" :class="{ open: showDetail }" v-if="loadedVersion">
            <div class="detail-panel-bar">
              <span class="detail-panel-title" :style="{ color: loadedVersion.color }">{{ loadedVersion.label }} · 配置</span>
              <span class="spacer"></span>
              <span class="detail-panel-close" @click="showDetail = false">◁</span>
            </div>
            <div class="detail-panel-body">
              <VersionDetail :version="loadedVersion" />
            </div>
          </div>
        </div>
      </main>
    </div>

    <AgentPanel
      :visible="!!monitorTab"
      :version-path="monitorTab?.path ?? ''"
      :version-label="monitorTab?.label ?? ''"
      :version-color="monitorTab?.color ?? '#00ff88'"
      @close="closeAgentPanel"
    />
  </div>
</template>

<style scoped>
.versions-page { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }
.v-header { height: 48px; display: flex; align-items: center; padding: 0 20px; gap: 16px; border-bottom: 1px solid #1a2a1a; background: #0a0a12; flex-shrink: 0; }
.v-title { font-family: 'Press Start 2P', monospace; font-size: 10px; color: #ffaa00; letter-spacing: 2px; }
.v-sub { font-size: 10px; color: #3a5a3a; }
.v-body { flex: 1; overflow: hidden; display: flex; position: relative; }

.v-timeline { width: 200px; background: #0a0a12; border-right: 1px solid #1a2a1a; overflow-y: auto; flex-shrink: 0; }
.timeline-head { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #3a5a3a; padding: 10px 12px; letter-spacing: 1px; border-bottom: 1px solid #1a2a1a; background: #0f0f1a; }
.timeline-item { position: relative; padding: 8px 12px 8px 28px; cursor: pointer; transition: background 0.2s; }
.timeline-item:hover { background: rgba(255,255,255,0.02); }
.timeline-item.active { background: rgba(0,255,136,0.04); }
.timeline-item.loaded { background: rgba(255,170,0,0.04); }
.timeline-dot { position: absolute; left: 12px; top: 12px; width: 6px; height: 6px; border-radius: 50%; transition: all 0.3s; z-index: 2; }
.timeline-connector { position: absolute; left: 14px; top: 22px; width: 2px; height: calc(100% - 16px); background: #1a2a1a; z-index: 1; }
.timeline-connector.lit { background: linear-gradient(to bottom, #00ff88, #1a2a1a); }
.timeline-content { display: flex; flex-direction: column; gap: 1px; }
.timeline-label { font-family: 'Press Start 2P', monospace; font-size: 5px; letter-spacing: 1px; transition: color 0.2s; }
.timeline-name { font-size: 10px; color: #d0ffd0; }
.timeline-desc { font-size: 8px; color: #3a5a3a; }
.timeline-count { font-family: 'Press Start 2P', monospace; font-size: 4px; color: #3a5a3a; letter-spacing: 0.5px; }
.timeline-loaded { position: absolute; right: 8px; top: 10px; font-size: 8px; color: #ffaa00; animation: blink 1.5s ease-in-out infinite; }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

.v-loader { width: 140px; background: #0a0a12; border-right: 1px solid #1a2a1a; display: flex; flex-direction: column; flex-shrink: 0; }
.loader-head { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; padding: 8px 10px; letter-spacing: 1px; border-bottom: 1px solid #1a2a1a; background: #0f0f1a; }
.loader-list { flex-shrink: 0; }
.loader-item { display: flex; align-items: center; gap: 6px; padding: 6px 10px; cursor: pointer; transition: all 0.2s; border-left: 2px solid transparent; }
.loader-item:hover { background: rgba(255,255,255,0.02); }
.loader-item.selected { border-left-color: var(--v-color); background: rgba(0,255,136,0.03); }
.loader-item.active { background: rgba(255,170,0,0.06); border-left-color: #ffaa00; }
.loader-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.loader-label { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #6a8a6a; letter-spacing: 0.5px; }
.loader-item.active .loader-label { color: #ffaa00; }
.loader-badge { font-family: 'Press Start 2P', monospace; font-size: 4px; color: #ffaa00; background: rgba(255,170,0,0.1); padding: 1px 3px; border-radius: 1px; letter-spacing: 0.5px; margin-left: auto; }
.loader-info { flex: 1; padding: 8px 10px; border-top: 1px solid #1a2a1a; display: flex; flex-direction: column; gap: 4px; }
.loader-info-row { display: flex; justify-content: space-between; align-items: center; }
.loader-info-key { font-family: 'Press Start 2P', monospace; font-size: 4px; color: #3a5a3a; letter-spacing: 0.5px; }
.loader-info-val { font-size: 9px; color: #d0ffd0; }
.detail-toggle { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 4px 0; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; margin-top: 4px; width: 100%; }
.detail-toggle:hover { border-color: #00ff88; color: #00ff88; }

.v-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.v-main-header { height: 40px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 10px; flex-shrink: 0; }
.v-badge { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 3px 8px; border: 1px solid; border-radius: 2px; letter-spacing: 1px; }
.v-name { font-size: 13px; color: #d0ffd0; }
.v-desc-main { font-size: 10px; color: #3a5a3a; }
.spacer { flex: 1; }
.v-hint-main { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #2a3a2a; letter-spacing: 1px; }

.unload-btn { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 4px 8px; background: transparent; border: 1px solid #1a2a1a; color: #3a5a3a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; }
.unload-btn:hover { border-color: #ff3366; color: #ff3366; }
.fullscreen-btn { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 4px 8px; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; }
.fullscreen-btn:hover { border-color: #ffaa00; color: #ffaa00; }

.v-main-body { flex: 1; display: flex; overflow: hidden; position: relative; }

.v-viewport { flex: 1; position: relative; background: #050508; }
.v-iframe { width: 100%; height: 100%; border: none; background: #050508; }

.v-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: #050508; }
.empty-icon { font-size: 48px; color: #1a2a1a; }
.empty-text { font-family: 'Press Start 2P', monospace; font-size: 7px; color: #3a5a3a; letter-spacing: 1px; }
.empty-hint { font-size: 9px; color: #2a3a2a; }

.v-detail-panel { position: absolute; top: 0; right: 0; width: 360px; height: 100%; background: #0a0a12; border-left: 1px solid #1a2a1a; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); z-index: 10; }
.v-detail-panel.open { transform: translateX(0); }
.detail-panel-bar { height: 32px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 12px; gap: 8px; flex-shrink: 0; }
.detail-panel-title { font-family: 'Press Start 2P', monospace; font-size: 6px; letter-spacing: 1px; }
.detail-panel-close { font-size: 12px; color: #3a5a3a; cursor: pointer; padding: 2px 4px; transition: all 0.2s; }
.detail-panel-close:hover { color: #ff3366; }
.detail-panel-body { flex: 1; overflow-y: auto; padding: 8px; }
</style>
