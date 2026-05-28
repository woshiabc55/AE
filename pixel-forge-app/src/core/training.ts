export interface TrainingNodeConfig {
  name?: string
  type?: string
  input?: string | null
  output?: string | null
  params?: Record<string, unknown>
  batchSize?: number
  epochs?: number
  learningRate?: number
  modelArch?: string
  augmentations?: string[]
  filters?: Record<string, unknown>
}

export interface TrainingNodeInfo {
  id: string
  name: string
  type: string
  status: 'idle' | 'running' | 'completed' | 'failed' | 'paused'
  config: TrainingNodeConfig
  metrics: TrainingMetrics
  logs: TrainingLog[]
  nextNodes: { id: string; name: string; type: string }[]
}

export interface TrainingMetrics {
  startTime: string | null
  endTime: string | null
  duration: number
  samplesProcessed: number
  loss: number | null
  accuracy: number | null
}

export interface TrainingLog {
  timestamp: string
  level: string
  msg: string
}

export interface PipelineInfo {
  name: string
  status: string
  created: string
  nodes: TrainingNodeInfo[]
}

export interface ChainLink {
  id: string
  name: string
  type: string
  config: Record<string, unknown>
  status: string
  input: Record<string, unknown> | null
  output: Record<string, unknown> | null
}

export interface ChainInfo {
  id: string
  name: string
  links: ChainLink[]
  status: string
  ctx: Record<string, unknown>
  created: string
  completed: string | null
}

export interface ChainStats {
  totalChains: number
  totalLinks: number
  running: number
  completed: number
}

const API_BASE = '/api'

export async function fetchPipeline(): Promise<PipelineInfo> {
  const res = await fetch(`${API_BASE}/nodes`)
  return res.json()
}

export async function createNode(config: TrainingNodeConfig): Promise<TrainingNodeInfo> {
  const res = await fetch(`${API_BASE}/nodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  return res.json()
}

export async function deleteNode(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/nodes/${id}`, { method: 'DELETE' })
  return res.json()
}

export async function connectNodes(from: string, to: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/nodes/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  })
  return res.json()
}

export async function runPipeline(datasetSize = 100): Promise<{ ok: boolean; nodes?: number; status?: string }> {
  const res = await fetch(`${API_BASE}/nodes/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ datasetSize }),
  })
  return res.json()
}

export async function fetchChains(): Promise<ChainInfo[]> {
  const res = await fetch(`${API_BASE}/chains`)
  return res.json()
}

export async function createChain(config: { name: string; links?: ChainLink[] }): Promise<ChainInfo> {
  const res = await fetch(`${API_BASE}/chains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  return res.json()
}

export async function deleteChain(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/chains/${id}`, { method: 'DELETE' })
  return res.json()
}

export async function addChainLink(chainId: string, linkDef: { name: string; type: string; config?: Record<string, unknown> }): Promise<{ ok: boolean; link: ChainLink }> {
  const res = await fetch(`${API_BASE}/chains/${chainId}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(linkDef),
  })
  return res.json()
}

export async function executeChain(chainId: string, input: Record<string, unknown> = {}): Promise<{ ok: boolean; result: Record<string, unknown>; links: number }> {
  const res = await fetch(`${API_BASE}/chains/${chainId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  })
  return res.json()
}

export const NODE_TYPES: { id: string; name: string; color: string; desc: string }[] = [
  { id: 'preprocess', name: '预处理', color: '#44ddff', desc: '图像归一化+文本清洗' },
  { id: 'encode', name: '编码', color: '#a29bfe', desc: 'CLIP/ViT 特征提取' },
  { id: 'tokenize', name: '分词', color: '#ff6b9d', desc: '文本Token化处理' },
  { id: 'embed', name: '嵌入', color: '#7cff6b', desc: '向量空间映射' },
  { id: 'train', name: '训练', color: '#ffaa00', desc: '模型参数优化' },
  { id: 'evaluate', name: '评估', color: '#00ff88', desc: '精度/损失计算' },
  { id: 'augment', name: '增强', color: '#ff3366', desc: '数据增广' },
  { id: 'export', name: '导出', color: '#44ddff', desc: '模型导出ONNX/PB' },
]

export const CHAIN_LINK_TYPES: { id: string; name: string; color: string }[] = [
  { id: 'preprocess', name: '预处理', color: '#44ddff' },
  { id: 'encode', name: '编码', color: '#a29bfe' },
  { id: 'tokenize', name: '分词', color: '#ff6b9d' },
  { id: 'embed', name: '嵌入', color: '#7cff6b' },
  { id: 'predict', name: '预测', color: '#ffaa00' },
  { id: 'decode', name: '解码', color: '#00ff88' },
  { id: 'validate', name: '验证', color: '#ff3366' },
]