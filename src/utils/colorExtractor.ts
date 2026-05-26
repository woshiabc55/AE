import type { ColorBlock } from '@/types'

export function extractColorsFromImage(
  imageData: ImageData,
  numColors: number = 8
): ColorBlock[] {
  const pixels = imageData.data
  const colorMap: Record<string, number> = {}
  const step = 32
  let totalPixels = 0

  for (let i = 0; i < pixels.length; i += 16) {
    const r = Math.round(pixels[i] / step) * step
    const g = Math.round(pixels[i + 1] / step) * step
    const b = Math.round(pixels[i + 2] / step) * step
    const a = pixels[i + 3]
    if (a < 128) continue
    const key = `${r},${g},${b}`
    colorMap[key] = (colorMap[key] || 0) + 1
    totalPixels++
  }

  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, numColors)
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number)
      return {
        hex: rgbToHex(r, g, b),
        rgb: [r, g, b],
        percentage: Math.round((count / totalPixels) * 10000) / 100,
      }
    })
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => {
        const clamped = Math.min(255, Math.max(0, v))
        return clamped.toString(16).padStart(2, '0')
      })
      .join('')
  )
}

export function loadImageToCanvas(
  file: File
): Promise<{ canvas: HTMLCanvasElement; imageData: ImageData }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 400
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve({ canvas, imageData })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

export function extractFrameFromVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): ImageData {
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}
