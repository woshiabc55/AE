import type { AITool } from '@/data/tools'

const IMAGE_BASE = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'
const FALLBACK = 'https://picsum.photos/seed'

type ImageSize = 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9'

const sizeMap: Record<AITool['size'], ImageSize> = {
  square: 'square_hd',
  portrait: 'portrait_4_3',
  landscape: 'landscape_4_3',
  tall: 'portrait_16_9'
}

function buildPrompt(tool: AITool): string {
  // 杂志感 + 未来感 + 抽象
  return `${tool.promptKeywords}, editorial magazine photography, futuristic, abstract, dramatic lighting, no text, cinematic, 8k, no watermark`
}

export function coverUrl(tool: AITool): string {
  const prompt = encodeURIComponent(buildPrompt(tool))
  const size = sizeMap[tool.size] || 'square_hd'
  return `${IMAGE_BASE}?prompt=${prompt}&image_size=${size}`
}

export function fallbackUrl(tool: AITool): string {
  const w = 1200
  const h = tool.size === 'portrait' ? 1600 : tool.size === 'landscape' ? 800 : tool.size === 'tall' ? 1800 : 1200
  return `${FALLBACK}/${tool.id}/${w}/${h}`
}
