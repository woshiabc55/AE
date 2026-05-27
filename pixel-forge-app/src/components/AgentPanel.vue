<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getAllAgents, getAgentsByLayer, getLayerColor, onAnyAgentMessage, type Agent, type AgentMessage } from '../core/agents'

const props = defineProps<{
  visible: boolean
  versionPath: string
  versionLabel: string
  versionColor: string
}>()

const emit = defineEmits<{
  close: []
}>()

const selectedLayer = ref<Agent['layer'] | 'all'>('all')
const messages = ref<AgentMessage[]>([])
const maxMessages = 50
let unsub: (() => void) | null = null

const agents = computed(() => {
  if (selectedLayer.value === 'all') return getAllAgents()
  return getAgentsByLayer(selectedLayer.value)
})

const layerGroups = computed(() => {
  const groups: { layer: Agent['layer']; color: string; count: number }[] = [
    { layer: 'core', color: getLayerColor('core'), count: getAgentsByLayer('core').length },
    { layer: 'effect', color: getLayerColor('effect'), count: getAgentsByLayer('effect').length },
    { layer: 'arch', color: getLayerColor('arch'), count: getAgentsByLayer('arch').length },
  ]
  return groups
})

onMounted(() => {
  unsub = onAnyAgentMessage((msg) => {
    messages.value.unshift(msg)
    if (messages.value.length > maxMessages) {
      messages.value = messages.value.slice(0, maxMessages)
    }
  })
})

onUnmounted(() => {
  if (unsub) unsub()
})

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="agent-fullscreen" :class="{ open: visible }" @keydown="handleKeydown" tabindex="-1">
      <div class="af-bar">
        <span class="af-dot" :style="{ background: versionColor }"></span>
        <span class="af-title" :style="{ color: versionColor }">⬡ GENT · {{ versionLabel }}</span>
        <span class="af-path">{{ versionPath }}</span>
        <span class="spacer"></span>
        <div class="af-layers">
          <span class="af-layer" :class="{ active: selectedLayer === 'all' }" @click="selectedLayer = 'all'">ALL</span>
          <span v-for="g in layerGroups" :key="g.layer" class="af-layer" :class="{ active: selectedLayer === g.layer }" :style="{ '--layer-color': g.color }" @click="selectedLayer = g.layer">{{ g.layer.toUpperCase() }}({{ g.count }})</span>
        </div>
        <span class="af-close" @click="emit('close')">✕</span>
      </div>

      <div class="af-body">
        <div class="af-left">
          <div class="af-iframe-wrap">
            <iframe
              :src="versionPath + 'index.html'"
              class="af-iframe"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
        </div>

        <div class="af-right">
          <div class="af-section">
            <div class="af-section-title" style="color:#a29bfe">⬡ AGENT · 模块代理</div>
            <div class="af-section-body">
              <div class="agent-list">
                <div v-for="agent in agents" :key="agent.id" class="agent-row" :style="{ borderLeftColor: getLayerColor(agent.layer) }">
                  <span class="agent-status" :style="{ background: agent.active ? getLayerColor(agent.layer) : '#1a2a1a' }"></span>
                  <span class="agent-id" :style="{ color: getLayerColor(agent.layer) }">{{ agent.id }}</span>
                  <span class="agent-name">{{ agent.name }}</span>
                  <span class="agent-layer-badge" :class="agent.layer">{{ agent.layer }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="af-section">
            <div class="af-section-title" style="color:#ffaa00">⚡ MESSAGE · 通信日志</div>
            <div class="af-section-body af-msg-body">
              <div v-if="messages.length === 0" class="msg-empty">等待消息...</div>
              <div v-for="(msg, i) in messages" :key="i" class="msg-row">
                <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
                <span class="msg-from" :style="{ color: '#a29bfe' }">{{ msg.from }}</span>
                <span class="msg-arrow">→</span>
                <span class="msg-to" :style="{ color: '#44ddff' }">{{ msg.to }}</span>
                <span class="msg-event">{{ msg.event }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.agent-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #050508;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
  pointer-events: none;
}
.agent-fullscreen.open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}
.af-bar {
  height: 44px;
  background: #0a0a12;
  border-bottom: 1px solid #1a2a1a;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  flex-shrink: 0;
}
.af-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity: 1; box-shadow: 0 0 4px currentColor; } 50% { opacity: 0.5; box-shadow: 0 0 12px currentColor; } }
.af-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  letter-spacing: 2px;
}
.af-path {
  font-family: 'Fira Code', monospace;
  font-size: 9px;
  color: #3a5a3a;
}
.af-layers {
  display: flex;
  gap: 4px;
}
.af-layer {
  font-family: 'Press Start 2P', monospace;
  font-size: 5px;
  padding: 3px 8px;
  border: 1px solid #1a2a1a;
  border-radius: 2px;
  color: #3a5a3a;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
}
.af-layer:hover {
  border-color: #3a5a3a;
  color: #6a8a6a;
}
.af-layer.active {
  border-color: var(--layer-color, #00ff88);
  color: var(--layer-color, #00ff88);
  background: rgba(0,255,136,0.05);
}
.af-close {
  font-size: 16px;
  color: #3a5a3a;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
  transition: all 0.2s;
}
.af-close:hover {
  color: #ff3366;
  background: rgba(255,51,102,0.1);
}
.af-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.af-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.af-iframe-wrap {
  flex: 1;
  position: relative;
}
.af-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #050508;
}
.af-right {
  width: 380px;
  border-left: 1px solid #1a2a1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}
.af-section {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #1a2a1a;
}
.af-section-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 6px;
  padding: 8px 12px;
  letter-spacing: 1px;
  background: #0a0a12;
  flex-shrink: 0;
}
.af-section-body {
  padding: 8px 12px;
  overflow-y: auto;
}
.af-msg-body {
  max-height: 300px;
}
.agent-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.agent-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-left: 3px solid;
  background: rgba(255,255,255,0.01);
  border-radius: 0 2px 2px 0;
}
.agent-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.agent-id {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  min-width: 80px;
}
.agent-name {
  font-size: 10px;
  color: #d0ffd0;
  flex: 1;
}
.agent-layer-badge {
  font-family: 'Press Start 2P', monospace;
  font-size: 4px;
  padding: 1px 4px;
  border-radius: 1px;
  letter-spacing: 0.5px;
}
.agent-layer-badge.core { background: rgba(162,155,254,0.15); color: #a29bfe; }
.agent-layer-badge.effect { background: rgba(255,107,157,0.15); color: #ff6b9d; }
.agent-layer-badge.arch { background: rgba(68,221,255,0.15); color: #44ddff; }

.msg-empty {
  font-size: 10px;
  color: #2a3a2a;
  text-align: center;
  padding: 20px 0;
}
.msg-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  font-size: 9px;
  border-bottom: 1px solid rgba(26,42,26,0.5);
}
.msg-time {
  font-family: 'Fira Code', monospace;
  font-size: 8px;
  color: #2a3a2a;
  min-width: 90px;
}
.msg-from {
  font-family: 'Fira Code', monospace;
  font-size: 9px;
  min-width: 60px;
}
.msg-arrow {
  color: #3a5a3a;
  font-size: 10px;
}
.msg-to {
  font-family: 'Fira Code', monospace;
  font-size: 9px;
  min-width: 60px;
}
.msg-event {
  font-family: 'Fira Code', monospace;
  font-size: 9px;
  color: #ffaa00;
}
</style>
