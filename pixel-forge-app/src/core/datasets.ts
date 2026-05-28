export interface DatasetInfo {
  id: string
  name: string
  description: string
  type: 'image-text' | 'image-only' | 'text-only'
  format: 'jsonl' | 'json' | 'csv'
  tags: string[]
  created: string
  updated: string
  stats: DatasetStats
  annotations: AnnotationEntry[]
  exportReady: boolean
}

export interface DatasetStats {
  total: number
  images: number
  texts: number
  annotated: number
  sizeBytes: number
}

export interface AnnotationEntry {
  id: string
  image: string | null
  text: string | null
  prompt: string
  labels: string[]
  caption: string
  params: Record<string, unknown>
  quality: AnnotationQuality
  created: string
}

export interface AnnotationQuality {
  score: number
  notes: string
}

export interface AutoLabelOptions {
  maxPairs?: number
  promptTemplate?: string
}

export interface ApiResponse<T = unknown> {
  ok: boolean
  error?: string
  [key: string]: T | boolean | string | undefined
}

const API_BASE = '/api'

export async function fetchDatasets(): Promise<DatasetInfo[]> {
  const res = await fetch(`${API_BASE}/datasets`)
  return res.json()
}

export async function fetchDataset(id: string): Promise<DatasetInfo> {
  const res = await fetch(`${API_BASE}/datasets/${id}`)
  return res.json()
}

export async function createDataset(config: {
  name: string; description?: string; type?: string; tags?: string[]
}): Promise<DatasetInfo> {
  const res = await fetch(`${API_BASE}/datasets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  return res.json()
}

export async function deleteDataset(id: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/datasets/${id}`, { method: 'DELETE' })
  return res.json()
}

export async function annotateEntry(id: string, annotation: Partial<AnnotationEntry>): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/datasets/${id}/annotate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(annotation),
  })
  return res.json()
}

export async function autoLabel(id: string, options?: AutoLabelOptions): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/datasets/${id}/auto-label`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options || {}),
  })
  return res.json()
}

export async function exportDataset(id: string, format: string = 'jsonl'): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/datasets/${id}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format }),
  })
  return res.json()
}

export async function fetchDatasetStats(): Promise<{
  totalDatasets: number; totalAnnotations: number; totalImages: number
  totalTexts: number; totalSize: number
}> {
  const res = await fetch(`${API_BASE}/datasets/stats`)
  return res.json()
}

export async function uploadImage(datasetId: string, file: File): Promise<ApiResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/images`, {
    method: 'POST',
    body: formData,
  })
  return res.json()
}

export async function addText(datasetId: string, name: string, content: string): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/texts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content }),
  })
  return res.json()
}