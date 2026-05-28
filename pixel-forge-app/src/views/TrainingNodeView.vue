<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  type PipelineInfo, type TrainingNodeInfo, type ChainInfo,
  fetchPipeline, createNode, deleteNode, connectNodes, runPipeline,
  fetchChains, createChain, deleteChain, addChainLink, executeChain,
  NODE_TYPES, CHAIN_LINK_TYPES,
} from '../core/training'

const activeTab = ref<'pipeline' | 'chain'>('pipeline')

const pipeline = ref<PipelineInfo | null>(null)
const chains = ref<ChainInfo[]>([])
const running = ref(false)
const statusMsg = ref('')
const newNodeType = ref('preprocess')
const newNodeName = ref('')
const connectFrom = ref('')
const connectTo = ref('')

const newChainName = ref('')
const newChainLinkType = ref('preprocess')
const newChainLinkName = ref('')

const logPanelNode = ref<TrainingNodeInfo | null>(null)

onMounted(() => {
  refresh()
})

async function refresh() {
  try {
    pipeline.value = await fetchPipeline()
    chains.value = await fetchChains()
    statusMsg.value = `节点: ${pipeline.value?.nodes.length || 0} | 空链: ${chains.value.length || 0}`
  } catch {
    statusMsg.value = '连接API失败 (localhost:4000)'
  }
}

async function handleCreateNode() {
  if (!newNodeName.value.trim()) return
  await createNode({ name: newNodeName.value, type: newNodeType.value })
  newNodeName.value = ''
  await refresh()
}

async function handleDeleteNode(id: string) {
  await deleteNode(id)
  await refresh()
}

async function handleConnect() {
  if (!connectFrom.value || !connectTo.value) return
  const result = await connectNodes(connectFrom.value, connectTo.value)
  if (!result.ok) statusMsg.value = '连接失败'
  await refresh()
}

async function handleRunPipeline() {
  running.value = true
  statusMsg.value = '训练管线运行中...'
  try {
    await runPipeline(100)
    await refresh()
    statusMsg.value = '训练完成!'
  } catch {
    statusMsg.value = '运行失败'
  } finally {
    running.value = false
  }
}

async function handleCreateChain() {
  if (!newChainName.value.trim()) return
  await createChain({ name: newChainName.value })
  newChainName.value = ''
  await refresh()
}

async function handleDeleteChain(id: string) {
  await deleteChain(id)
  await refresh()
}

async function handleAddLink(chainId: string) {
  if (!newChainLinkName.value.trim()) return
  await addChainLink(chainId, { name: newChainLinkName.value, type: newChainLinkType.value })
  newChainLinkName.value = ''
  await refresh()
}

async function handleExecuteChain(chainId: string) {
  running.value = true
  statusMsg.value = '空链执行中...'
  try {
    await executeChain(chainId, { images: [1, 2, 3], texts: ['sample'] })
    await refresh()
    statusMsg.value = '空链执行完成!'
  } catch {
    statusMsg.value = '执行失败'
  } finally {
    running.value = false
  }
}

function showLogs(node: TrainingNodeInfo) {
  logPanelNode.value = node
}

function getNodeColor(type: string) {
  return NODE_TYPES.find(t => t.id === type)?.color || '#3a5a3a'
}

function getLinkTypeColor(type: string) {
  return CHAIN_LINK_TYPES.find(t => t.id === type)?.color || '#3a5a3a'
}
</script>

<template>
  <div class="tn-page">
    <header class="tn-header">
      <span class="tn-logo">TRAINING</span>
      <span class="tn-title">数字模型 · Node训练管线</span>
      <span class="tn-sub">云端空链后端</span>
      <span class="spacer"></span>
      <div class="tn-tabs">
        <span class="tn-tab" :class="{ active: activeTab === 'pipeline' }" @click="activeTab = 'pipeline'">训练管线</span>
        <span class="tn-tab" :class="{ active: activeTab === 'chain' }" @click="activeTab = 'chain'">空链处理</span>
      </div>
      <button class="tn-btn" @click="refresh">↻ 刷新</button>
    </header>

    <div class="tn-body" v-if="activeTab === 'pipeline'">
      <div class="tn-create-bar">
        <select class="tn-select" v-model="newNodeType">
          <option v-for="t in NODE_TYPES" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <input class="tn-input" v-model="newNodeName" placeholder="节点名称..." @keyup.enter="handleCreateNode">
        <button class="tn-btn accent" @click="handleCreateNode">+ 添加节点</button>
        <span class="tn-sep"></span>
        <span class="tn-label">连接:</span>
        <select class="tn-select-sm" v-model="connectFrom">
          <option value="">--源--</option>
          <option v-for="n in pipeline?.nodes || []" :key="n.id" :value="n.id">{{ n.name }}</option>
        </select>
        <span class="tn-arrow">→</span>
        <select class="tn-select-sm" v-model="connectTo">
          <option value="">--目标--</option>
          <option v-for="n in pipeline?.nodes || []" :key="n.id" :value="n.id">{{ n.name }}</option>
        </select>
        <button class="tn-btn" @click="handleConnect">连接</button>
        <span class="spacer"></span>
        <button class="tn-btn run" :class="{ running }" @click="handleRunPipeline" :disabled="running">{{ running ? '⏳ 运行中...' : '▶ 运行管线' }}</button>
      </div>

      <div class="tn-main">
        <div class="tn-graph">
          <div v-if="!pipeline || pipeline.nodes.length === 0" class="tn-empty">
            <span class="tn-empty-icon">⬡</span>
            <span>添加节点构建训练管线</span>
          </div>
          <div v-for="node in pipeline?.nodes || []" :key="node.id" class="tn-node-wrap">
            <div class="tn-node" :style="{ borderColor: getNodeColor(node.type) }" @click="showLogs(node)">
              <span class="tn-node-dot" :style="{ background: node.status === 'completed' ? '#00ff88' : node.status === 'running' ? '#ffaa00' : '#1a2a1a' }"></span>
              <span class="tn-node-type" :style="{ color: getNodeColor(node.type) }">{{ NODE_TYPES.find(t => t.id === node.type)?.name || node.type }}</span>
              <span class="tn-node-name">{{ node.name }}</span>
              <span class="tn-node-metrics" v-if="node.metrics.loss !== null">
                loss: {{ node.metrics.loss?.toFixed(4) }} | acc: {{ ((node.metrics.accuracy || 0) * 100).toFixed(1) }}%
              </span>
              <button class="tn-node-del" @click.stop="handleDeleteNode(node.id)">✕</button>
            </div>
            <div v-if="node.nextNodes.length" class="tn-connector">
              <span v-for="next in node.nextNodes" :key="next.id" class="tn-conn-label" :style="{ color: getNodeColor(next.type) }">→ {{ next.name }}</span>
            </div>
          </div>
        </div>

        <div class="tn-log-panel" v-if="logPanelNode">
          <div class="tn-log-head">
            <span :style="{ color: getNodeColor(logPanelNode.type) }">{{ logPanelNode.name }} · 日志</span>
            <span class="tn-log-close" @click="logPanelNode = null">✕</span>
          </div>
          <div class="tn-log-body">
            <div v-if="logPanelNode.logs.length === 0" class="tn-log-empty">无日志</div>
            <div v-for="(log, i) in logPanelNode.logs" :key="i" class="tn-log-row">
              <span class="tn-log-time">{{ log.timestamp.slice(11, 23) }}</span>
              <span class="tn-log-level" :style="{ color: log.level === 'error' ? '#ff3366' : '#3a5a3a' }">{{ log.level }}</span>
              <span class="tn-log-msg">{{ log.msg }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tn-body" v-if="activeTab === 'chain'">
      <div class="tn-create-bar">
        <input class="tn-input" v-model="newChainName" placeholder="空链名称..." @keyup.enter="handleCreateChain">
        <button class="tn-btn accent" @click="handleCreateChain">+ 创建空链</button>
      </div>
      <div class="tn-main">
        <div class="tn-chain-list">
          <div v-if="chains.length === 0" class="tn-empty">
            <span class="tn-empty-icon">⛓</span>
            <span>创建空链处理管线</span>
          </div>
          <div v-for="chain in chains" :key="chain.id" class="chain-card">
            <div class="chain-card-head">
              <span class="chain-name" :style="{ color: '#44ddff' }">{{ chain.name }}</span>
              <span class="chain-status" :style="{ color: chain.status === 'completed' ? '#00ff88' : '#ffaa00' }">{{ chain.status }}</span>
              <span class="tn-node-del" @click="handleDeleteChain(chain.id)">✕</span>
            </div>
            <div class="chain-links">
              <div v-for="link in chain.links" :key="link.id" class="chain-link" :style="{ borderColor: getLinkTypeColor(link.type) }">
                <span class="chain-link-type" :style="{ color: getLinkTypeColor(link.type) }">{{ link.type }}</span>
                <span class="chain-link-name">{{ link.name }}</span>
                <span class="chain-link-status" :style="{ color: link.status === 'completed' ? '#00ff88' : '#3a5a3a' }">● {{ link.status }}</span>
              </div>
            </div>
            <div class="chain-actions">
              <select class="tn-select-sm" v-model="newChainLinkType">
                <option v-for="t in CHAIN_LINK_TYPES" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
              <input class="tn-input-sm" v-model="newChainLinkName" placeholder="环节名称..." @keyup.enter="handleAddLink(chain.id)">
              <button class="tn-btn" @click="handleAddLink(chain.id)">+ 添加</button>
              <button class="tn-btn run" @click="handleExecuteChain(chain.id)" :disabled="running" style="margin-left:auto">{{ running ? '⏳' : '▶ 执行' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="tn-statusbar">
      <span class="tn-indicator" :style="{ background: running ? '#ffaa00' : '#00ff88' }"></span>
      <span>{{ statusMsg }}</span>
      <span class="tn-sep">|</span>
      <span>云端API: localhost:4000</span>
    </footer>
  </div>
</template>

<style scoped>
.tn-page { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }

.tn-header { height: 42px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 10px; flex-shrink: 0; }
.tn-logo { font-family: 'Press Start 2P', monospace; font-size: 9px; color: #a29bfe; text-shadow: 0 0 10px rgba(162,155,254,0.4); letter-spacing: 2px; }
.tn-title { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #d0ffd0; letter-spacing: 1px; }
.tn-sub { font-size: 10px; color: #3a5a3a; }
.spacer { flex: 1; }
.tn-tabs { display: flex; gap: 2px; }
.tn-tab { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 4px 10px; color: #3a5a3a; cursor: pointer; border: 1px solid #1a2a1a; border-radius: 2px; transition: all 0.2s; letter-spacing: 1px; }
.tn-tab:hover { color: #6a8a6a; }
.tn-tab.active { color: #a29bfe; border-color: #a29bfe; background: rgba(162,155,254,0.06); }
.tn-btn { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 4px 10px; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; }
.tn-btn:hover { border-color: #00ff88; color: #00ff88; }
.tn-btn.accent { border-color: #a29bfe; color: #a29bfe; }
.tn-btn.accent:hover { background: rgba(162,155,254,0.1); }
.tn-btn.run { border-color: #ffaa00; color: #ffaa00; }
.tn-btn.run:hover { background: rgba(255,170,0,0.1); }
.tn-btn.run.running { opacity: 0.6; }
.tn-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.tn-sep { width: 1px; height: 18px; background: #1a2a1a; margin: 0 4px; }

.tn-create-bar { height: 38px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 10px; gap: 6px; flex-shrink: 0; }
.tn-select { height: 24px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; }
.tn-select-sm { height: 22px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 9px; padding: 0 4px; border-radius: 2px; min-width: 80px; }
.tn-input { height: 24px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 6px; border-radius: 2px; min-width: 120px; }
.tn-input:focus { border-color: #a29bfe; outline: none; }
.tn-input-sm { height: 22px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 9px; padding: 0 6px; border-radius: 2px; width: 100px; }
.tn-input-sm:focus { border-color: #a29bfe; outline: none; }
.tn-label { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; }
.tn-arrow { color: #3a5a3a; font-size: 12px; }

.tn-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.tn-main { flex: 1; display: flex; overflow: hidden; }

.tn-graph { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-wrap: wrap; gap: 12px; align-content: flex-start; }
.tn-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #2a3a2a; font-size: 10px; }
.tn-empty-icon { font-size: 40px; color: #1a2a1a; }

.tn-node-wrap { display: flex; flex-direction: column; gap: 4px; }
.tn-node { display: flex; flex-direction: column; gap: 3px; padding: 10px 14px; border: 1px solid; border-radius: 6px; background: rgba(10,10,18,0.9); cursor: pointer; transition: all 0.2s; min-width: 160px; max-width: 220px; }
.tn-node:hover { box-shadow: 0 0 12px rgba(162,155,254,0.1); transform: translateY(-2px); }
.tn-node-dot { width: 6px; height: 6px; border-radius: 50%; }
.tn-node-type { font-family: 'Press Start 2P', monospace; font-size: 5px; letter-spacing: 1px; }
.tn-node-name { font-size: 11px; color: #d0ffd0; }
.tn-node-metrics { font-size: 8px; color: #3a5a3a; }
.tn-node-del { font-size: 8px; color: #3a5a3a; background: none; border: none; cursor: pointer; align-self: flex-end; padding: 2px; margin-top: -6px; margin-right: -6px; }
.tn-node-del:hover { color: #ff3366; }
.tn-connector { display: flex; gap: 4px; padding: 0 14px; }
.tn-conn-label { font-family: 'Press Start 2P', monospace; font-size: 4px; letter-spacing: 0.5px; }

.tn-log-panel { width: 320px; border-left: 1px solid #1a2a1a; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
.tn-log-head { padding: 8px 12px; font-family: 'Press Start 2P', monospace; font-size: 6px; letter-spacing: 1px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1a2a1a; background: #0a0a12; }
.tn-log-close { color: #3a5a3a; cursor: pointer; font-size: 12px; }
.tn-log-close:hover { color: #ff3366; }
.tn-log-body { flex: 1; overflow-y: auto; padding: 6px; }
.tn-log-empty { padding: 20px; text-align: center; color: #2a3a2a; font-size: 10px; }
.tn-log-row { display: flex; gap: 6px; padding: 2px 0; font-size: 8px; border-bottom: 1px solid rgba(26,42,26,0.3); }
.tn-log-time { font-family: 'Fira Code', monospace; font-size: 7px; color: #2a3a2a; }
.tn-log-level { font-family: 'Press Start 2P', monospace; font-size: 5px; min-width: 36px; }
.tn-log-msg { font-size: 8px; color: #6a8a6a; }

.tn-chain-list { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
.chain-card { border: 1px solid #1a2a1a; border-radius: 4px; overflow: hidden; }
.chain-card-head { padding: 8px 12px; display: flex; align-items: center; gap: 10px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; }
.chain-name { font-family: 'Press Start 2P', monospace; font-size: 6px; letter-spacing: 1px; }
.chain-status { font-family: 'Press Start 2P', monospace; font-size: 5px; letter-spacing: 1px; }
.chain-links { padding: 6px 12px; display: flex; flex-wrap: wrap; gap: 6px; }
.chain-link { display: flex; align-items: center; gap: 5px; padding: 3px 8px; border: 1px solid; border-radius: 3px; font-size: 9px; }
.chain-link-type { font-family: 'Press Start 2P', monospace; font-size: 5px; letter-spacing: 0.5px; }
.chain-link-name { color: #d0ffd0; }
.chain-link-status { font-size: 8px; }
.chain-actions { padding: 6px 12px; display: flex; align-items: center; gap: 6px; border-top: 1px solid rgba(26,42,26,0.5); background: rgba(10,10,18,0.5); }

.tn-statusbar { height: 22px; background: #0a0a12; border-top: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 12px; font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; gap: 12px; flex-shrink: 0; }
.tn-indicator { width: 6px; height: 6px; border-radius: 50%; }
</style>