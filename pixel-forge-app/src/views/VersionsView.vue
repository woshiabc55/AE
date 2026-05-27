<script setup lang="ts">
import { ref, computed } from 'vue'
import { VERSIONS } from '../core/versions'
import VersionEmbed from '../components/VersionEmbed.vue'
import VersionDetail from '../components/VersionDetail.vue'

const selectedId = ref('v1')
const baseUrl = window.location.origin + ':8081'

const selected = computed(() => VERSIONS.find(v => v.id === selectedId.value)!)

const timelineItems = VERSIONS.map((v, i) => ({
  ...v,
  index: i,
  isLast: i === VERSIONS.length - 1,
}))

const rightTab = ref('detail')
</script>

<template>
  <div class="versions-page">
    <header class="v-header">
      <h1 class="v-title">▶ 版本迭代设计</h1>
      <span class="v-sub">v1→v7 七个迭代版本 · MCOP文档映射 · 前端嵌套查看</span>
    </header>

    <div class="v-body">
      <aside class="v-timeline">
        <div class="timeline-line"></div>
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
          <span class="v-ws">workspace: {{ selected.workspace.replace('workspace-', '') }}</span>
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
                <VersionEmbed :version="selected" :base-url="baseUrl" />
              </template>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.versions-page { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }
.v-header { height: 48px; display: flex; align-items: center; padding: 0 20px; gap: 16px; border-bottom: 1px solid #1a2a1a; background: #0a0a12; flex-shrink: 0; }
.v-title { font-family: 'Press Start 2P', monospace; font-size: 10px; color: #ffaa00; letter-spacing: 2px; }
.v-sub { font-size: 10px; color: #3a5a3a; }
.v-body { flex: 1; display: flex; overflow: hidden; }

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
</style>
