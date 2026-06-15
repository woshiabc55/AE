// 图像生成工具
// 统一通过 Trae Text-to-Image 接口获取作品占位图
const SIZE_PRESETS = {
  cover: 'landscape_16_9',
  thumb: 'square',
  portrait: 'portrait_4_3',
} as const

export type ImageSize = keyof typeof SIZE_PRESETS

export function buildImageUrl(prompt: string, size: ImageSize = 'cover') {
  const params = new URLSearchParams({
    prompt,
    image_size: SIZE_PRESETS[size],
  })
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?${params.toString()}`
}
