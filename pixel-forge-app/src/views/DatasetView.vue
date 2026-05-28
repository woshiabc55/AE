<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  type DatasetInfo, type AnnotationEntry,
  fetchDatasets, createDataset, deleteDataset, annotateEntry,
  autoLabel, exportDataset, fetchDatasetStats,
} from '../core/datasets'

const datasets = ref<DatasetInfo[]>([])
const selectedId = ref<string | null>(null)
const loading = ref(false)
const showCreateForm = ref(false)
const newDsName = ref('')
const newDsDesc = ref('')
const newDsType = ref('image-text')
const statusMsg = ref('')

const selected = computed(() => datasets.value.find(d => d.id === selectedId.value) || null)

const CHAIN_TYPES: Record<string, string> = {
  preprocess: '预处理',
  encode: '编码',
  tokenize: '分词',
  embed: '嵌入',
  train: '训练',
  evaluate: '评估',
  augment: '增强',
  export: '导出',
  predict: '预测',
  decode: '解码',
  validate: '验证',
}

onMounted(() => { refresh() })

async function refresh() {
  loading.value = true
  try {
    datasets.value = await fetchDatasets()
    if (selectedId.value) {
      const ds = datasets.value.find(d => d.id === selectedId.value)
      if (ds) datasets.value[datasets.value.indexOf(ds)] = ds
    }
    statusMsg.value = `共 ${datasets.value.length} 个数据集`
  } catch {
    statusMsg.value = '连接API失败 (localhost:4000)'
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  if (!newDsName.value.trim()) return
  await createDataset({ name: newDsName.value, description: newDsDesc.value, type: newDsType.value })
  newDsName.value = ''
  newDsDesc.value = ''
  showCreateForm.value = false
  await refresh()
}

async function handleDelete(id: string) {
  await deleteDataset(id)
  if (selectedId.value === id) selectedId.value = null
  await refresh()
}

async function handleAutoLabel() {
  if (!selectedId.value) return
  await autoLabel(selectedId.value, { maxPairs: 10 })
  await refresh()
}

async function handleExport(format: string) {
  if (!selectedId.value) return
  await exportDataset(selectedId.value, format)
  await refresh()
}

async function handleAnnotate(prompt: string, labels: string[], caption: string) {
  if (!selectedId.value) return
  await annotateEntry(selectedId.value, { prompt, labels, caption })
  await refresh()
}

function selectDataset(id: string) {
  selectedId.value = id
}
</script>

<template>
  <div class="ds-page">
    <header class="ds-header">
      <span class="ds-logo">DATASET</span>
      <span class="ds-title">数据集处理 · 标注系统</span>
      <span class="ds-sub">文生图模型训练数据制作</span>
      <span class="spacer"></span>
      <button class="ds-btn accent" @click="showCreateForm = !showCreateForm">{{ showCreateForm ? '取消' : '+ 新建数据集' }}</button>
      <button class="ds-btn" @click="refresh">↻ 刷新</button>
    </header>

    <div class="ds-create" v-if="showCreateForm">
      <input class="ds-input" v-model="newDsName" placeholder="数据集名称..." @keyup.enter="handleCreate">
      <input class="ds-input" v-model="newDsDesc" placeholder="描述（可选）...">
      <select class="ds-select" v-model="newDsType">
        <option value="image-text">图文对</option>
        <option value="image-only">仅图像</option>
        <option value="text-only">仅文本</option>
      </select>
      <button class="ds-btn accent" @click="handleCreate">创建</button>
    </div>

    <div class="ds-body">
      <aside class="ds-sidebar">
        <div class="ds-sidebar-head">数据集列表</div>
        <div v-if="datasets.length === 0" class="ds-empty">暂无数据集</div>
        <div v-for="ds in datasets" :key="ds.id" class="ds-item" :class="{ active: selectedId === ds.id }" @click="selectDataset(ds.id)">
          <span class="ds-item-icon" :style="{ color: ds.type === 'image-text' ? '#ffaa00' : ds.type === 'image-only' ? '#00ff88' : '#44ddff' }">{{ ds.type === 'image-text' ? '◈' : ds.type === 'image-only' ? '▣' : '▤' }}</span>
          <div class="ds-item-text">
            <span class="ds-item-name">{{ ds.name }}</span>
            <span class="ds-item-meta">{{ ds.stats.annotated || 0 }} 标注 · {{ ds.stats.images || 0 }} 图 · {{ ds.stats.texts || 0 }} 文</span>
          </div>
          <button class="ds-del" @click.stop="handleDelete(ds.id)">✕</button>
        </div>
      </aside>

      <main class="ds-main">
        <template v-if="selected">
          <div class="ds-toolbar">
            <span class="ds-badge" :style="{ color: '#ffaa00', borderColor: '#ffaa00' }">{{ selected.name }}</span>
            <span class="ds-meta">类型: {{ selected.type }} | 格式: {{ selected.format }}</span>
            <span class="spacer"></span>
            <button class="ds-btn" @click="handleAutoLabel">⚡ 自动标注</button>
            <button class="ds-btn" @click="handleExport('jsonl')">⬇ JSONL</button>
            <button class="ds-btn" @click="handleExport('json')">⬇ JSON</button>
            <button class="ds-btn" @click="handleExport('csv')">⬇ CSV</button>
          </div>

          <div class="ds-panels">
            <div class="ds-panel">
              <div class="ds-panel-title" style="color:#ffaa00">▣ 标注数据</div>
              <div class="ds-panel-body">
                <div v-if="!selected.annotations || selected.annotations.length === 0" class="ds-empty-panel">
                  暂无标注数据。点击"自动标注"或手动添加。
                </div>
                <div v-for="ann in selected.annotations" :key="ann.id" class="ann-card">
                  <div class="ann-header">
                    <span class="ann-id">{{ ann.id.slice(0, 8) }}</span>
                    <span class="ann-score" :style="{ color: ann.quality?.score > 0.8 ? '#00ff88' : '#ffaa00' }">{{ ((ann.quality?.score || 0) * 100).toFixed(0) }}%</span>
                  </div>
                  <div class="ann-labels">
                    <span v-for="lbl in ann.labels" :key="lbl" class="ann-label">{{ lbl }}</span>
                  </div>
                  <div class="ann-caption">{{ ann.caption }}</div>
                  <div class="ann-prompt">prompt: {{ ann.prompt || '(无)' }}</div>
                  <div class="ann-meta">
                    <span v-if="ann.image">📷 {{ ann.image }}</span>
                    <span v-if="ann.text">📄 {{ ann.text }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="ds-panel">
              <div class="ds-panel-title" style="color:#44ddff">✏ 手动添加标注</div>
              <div class="ds-panel-body">
                <div class="ann-form">
                  <input class="ann-input" v-model="annForm.prompt" placeholder="提示词 prompt...">
                  <input class="ann-input" v-model="annForm.labelsStr" placeholder="标签（逗号分隔）..." @keyup.enter="submitAnnotate">
                  <textarea class="ann-textarea" v-model="annForm.caption" placeholder="描述 caption..." rows="3"></textarea>
                  <button class="ds-btn accent" @click="submitAnnotate">添加标注</button>
                </div>
              </div>
            </div>
          </div>

          <div class="ds-stats-panel">
            <span>图: {{ selected.stats.images }} | 文: {{ selected.stats.texts }} | 标注: {{ selected.stats.annotated || 0 }} | 大小: {{ (selected.stats.sizeBytes / 1024).toFixed(1) }}KB</span>
          </div>
        </template>

        <template v-else>
          <div class="ds-no-selection">
            <span class="ds-no-icon">◈</span>
            <span class="ds-no-text">选择一个数据集以查看标注详情</span>
          </div>
        </template>
      </main>
    </div>

    <footer class="ds-statusbar">
      <span class="ds-indicator" :style="{ background: loading ? '#ffaa00' : '#00ff88' }"></span>
      <span>{{ statusMsg }}</span>
      <span class="sep">|</span>
      <span>API: localhost:4000</span>
    </footer>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      annForm: {
        prompt: '',
        labelsStr: '',
        caption: '',
      },
    }
  },
  methods: {
    async submitAnnotate() {
      const labels = this.annForm.labelsStr.split(',').map(s => s.trim()).filter(Boolean)
      await this.handleAnnotate(this.annForm.prompt, labels, this.annForm.caption)
      this.annForm = { prompt: '', labelsStr: '', caption: '' }
      await this.refresh()
    },
  },
}
</script>

<style scoped>
.ds-page { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }

.ds-header { height: 42px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 10px; flex-shrink: 0; }
.ds-logo { font-family: 'Press Start 2P', monospace; font-size: 9px; color: #ffaa00; text-shadow: 0 0 10px rgba(255,170,0,0.4); letter-spacing: 2px; }
.ds-title { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #d0ffd0; letter-spacing: 1px; }
.ds-sub { font-size: 10px; color: #3a5a3a; }
.spacer { flex: 1; }
.sep { color: #1a2a1a; }
.ds-btn { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 4px 10px; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; }
.ds-btn:hover { border-color: #00ff88; color: #00ff88; }
.ds-btn.accent { border-color: #ffaa00; color: #ffaa00; }
.ds-btn.accent:hover { background: rgba(255,170,0,0.1); }
.ds-create { height: 38px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 8px; flex-shrink: 0; }
.ds-input { height: 24px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 6px; border-radius: 2px; min-width: 140px; }
.ds-input:focus { border-color: #ffaa00; outline: none; }
.ds-select { height: 24px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; }

.ds-body { flex: 1; display: flex; overflow: hidden; }
.ds-sidebar { width: 220px; background: #0a0a12; border-right: 1px solid #1a2a1a; overflow-y: auto; flex-shrink: 0; }
.ds-sidebar-head { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; padding: 8px 10px; letter-spacing: 1px; border-bottom: 1px solid #1a2a1a; }
.ds-empty { padding: 20px; font-size: 10px; color: #2a3a2a; text-align: center; }
.ds-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; cursor: pointer; border-bottom: 1px solid rgba(26,42,26,0.5); transition: all 0.15s; }
.ds-item:hover { background: rgba(255,255,255,0.02); }
.ds-item.active { background: rgba(255,170,0,0.06); border-right: 2px solid #ffaa00; }
.ds-item-icon { font-size: 14px; flex-shrink: 0; }
.ds-item-text { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.ds-item-name { font-size: 10px; color: #d0ffd0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-item-meta { font-size: 8px; color: #3a5a3a; }
.ds-del { font-size: 10px; color: #3a5a3a; background: none; border: none; cursor: pointer; padding: 2px 4px; }
.ds-del:hover { color: #ff3366; }

.ds-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.ds-toolbar { height: 36px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 12px; gap: 8px; flex-shrink: 0; }
.ds-badge { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 2px 8px; border: 1px solid; border-radius: 2px; letter-spacing: 1px; }
.ds-meta { font-size: 9px; color: #3a5a3a; }
.ds-panels { flex: 1; display: flex; overflow: hidden; }
.ds-panel { flex: 1; display: flex; flex-direction: column; border-right: 1px solid #1a2a1a; overflow: hidden; }
.ds-panel:last-child { border-right: none; flex: 0 0 300px; }
.ds-panel-title { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 8px 10px; letter-spacing: 1px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; flex-shrink: 0; }
.ds-panel-body { flex: 1; overflow-y: auto; padding: 8px; }
.ds-empty-panel { padding: 30px; text-align: center; font-size: 10px; color: #2a3a2a; }

.ann-card { border: 1px solid #1a2a1a; border-radius: 3px; padding: 8px; margin-bottom: 6px; background: rgba(255,255,255,0.01); }
.ann-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.ann-id { font-family: 'Fira Code', monospace; font-size: 8px; color: #3a5a3a; }
.ann-score { font-family: 'Press Start 2P', monospace; font-size: 6px; }
.ann-labels { display: flex; gap: 3px; flex-wrap: wrap; margin-bottom: 4px; }
.ann-label { font-family: 'Press Start 2P', monospace; font-size: 4px; padding: 1px 4px; background: rgba(255,170,0,0.1); color: #ffaa00; border-radius: 1px; letter-spacing: 0.5px; }
.ann-caption { font-size: 10px; color: #d0ffd0; margin-bottom: 3px; }
.ann-prompt { font-size: 9px; color: #3a5a3a; font-style: italic; margin-bottom: 3px; }
.ann-meta { display: flex; gap: 8px; font-size: 8px; color: #3a5a3a; }

.ann-form { display: flex; flex-direction: column; gap: 6px; }
.ann-input { height: 24px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 6px; border-radius: 2px; }
.ann-input:focus { border-color: #44ddff; outline: none; }
.ann-textarea { background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 6px; border-radius: 2px; resize: vertical; }
.ann-textarea:focus { border-color: #44ddff; outline: none; }

.ds-stats-panel { height: 24px; background: #0a0a12; border-top: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 12px; font-size: 9px; color: #3a5a3a; flex-shrink: 0; }

.ds-no-selection { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
.ds-no-icon { font-size: 48px; color: #1a2a1a; }
.ds-no-text { font-family: 'Press Start 2P', monospace; font-size: 7px; color: #3a5a3a; letter-spacing: 1px; }

.ds-statusbar { height: 22px; background: #0a0a12; border-top: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 12px; font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; gap: 12px; flex-shrink: 0; }
.ds-indicator { width: 6px; height: 6px; border-radius: 50%; }
</style>