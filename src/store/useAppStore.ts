import { create } from 'zustand'
import type { ColorBlock, ExtractedFrame, UploadedFile, SkillItem } from '@/types'

interface AppState {
  uploadedFiles: UploadedFile[]
  selectedFileId: string | null
  extractedColors: ColorBlock[]
  frameTimeline: ExtractedFrame[]
  videoSyncEnabled: boolean
  captureFrequency: number
  scriptCode: string
  skillsQuery: string

  addUploadedFile: (file: UploadedFile) => void
  removeUploadedFile: (id: string) => void
  selectFile: (id: string | null) => void
  setExtractedColors: (colors: ColorBlock[]) => void
  setFrameTimeline: (frames: ExtractedFrame[]) => void
  addFrame: (frame: ExtractedFrame) => void
  setVideoSyncEnabled: (enabled: boolean) => void
  setCaptureFrequency: (freq: number) => void
  setScriptCode: (code: string) => void
  setSkillsQuery: (query: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  uploadedFiles: [],
  selectedFileId: null,
  extractedColors: [],
  frameTimeline: [],
  videoSyncEnabled: false,
  captureFrequency: 2,
  scriptCode: `// C3 创意脚本 - PID语言\n// 从图片提取色块并可视化\n\nfunction extractColors(imageData, numColors = 8) {\n  const pixels = imageData.data;\n  const colorMap = {};\n  \n  for (let i = 0; i < pixels.length; i += 4) {\n    const r = Math.round(pixels[i] / 32) * 32;\n    const g = Math.round(pixels[i+1] / 32) * 32;\n    const b = Math.round(pixels[i+2] / 32) * 32;\n    const key = \`\${r},\${g},\${b}\`;\n    colorMap[key] = (colorMap[key] || 0) + 1;\n  }\n  \n  return Object.entries(colorMap)\n    .sort((a, b) => b[1] - a[1])\n    .slice(0, numColors)\n    .map(([key, count]) => {\n      const [r, g, b] = key.split(',').map(Number);\n      return { rgb: [r, g, b], count };\n    });\n}\n\nconsole.log("C3 脚本已加载");`,
  skillsQuery: '',

  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),

  removeUploadedFile: (id) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
      selectedFileId: state.selectedFileId === id ? null : state.selectedFileId,
    })),

  selectFile: (id) => set({ selectedFileId: id }),

  setExtractedColors: (colors) => set({ extractedColors: colors }),

  setFrameTimeline: (frames) => set({ frameTimeline: frames }),

  addFrame: (frame) =>
    set((state) => ({ frameTimeline: [...state.frameTimeline, frame] })),

  setVideoSyncEnabled: (enabled) => set({ videoSyncEnabled: enabled }),

  setCaptureFrequency: (freq) => set({ captureFrequency: freq }),

  setScriptCode: (code) => set({ scriptCode: code }),

  setSkillsQuery: (query) => set({ skillsQuery: query }),
}))

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 'pid-color-extract',
    name: '色块提取器',
    description: '从图片中提取主色调色块，支持量化精度调节',
    tags: ['色块', '提取', 'PID'],
    code: `function extractDominantColors(canvas, numColors = 8) {\n  const ctx = canvas.getContext('2d');\n  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n  const pixels = imageData.data;\n  const colorMap = {};\n  const step = 32;\n  for (let i = 0; i < pixels.length; i += 4) {\n    const r = Math.round(pixels[i] / step) * step;\n    const g = Math.round(pixels[i+1] / step) * step;\n    const b = Math.round(pixels[i+2] / step) * step;\n    const key = \`\${r},\${g},\${b}\`;\n    colorMap[key] = (colorMap[key] || 0) + 1;\n  }\n  return Object.entries(colorMap)\n    .sort((a, b) => b[1] - a[1])\n    .slice(0, numColors)\n    .map(([key, count]) => {\n      const [r, g, b] = key.split(',').map(Number);\n      return { rgb: [r, g, b], count };\n    });\n}`,
    category: 'toolchain',
  },
  {
    id: 'pid-video-sync',
    name: '视频流同步器',
    description: '实时提取视频帧色块，与视频流同步显示',
    tags: ['视频', '同步', '帧'],
    code: `function syncVideoFrames(video, canvas, callback) {\n  const ctx = canvas.getContext('2d');\n  let animId;\n  function tick() {\n    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);\n    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n    callback(imageData, video.currentTime);\n    animId = requestAnimationFrame(tick);\n  }\n  video.addEventListener('play', () => { animId = requestAnimationFrame(tick); });\n  video.addEventListener('pause', () => cancelAnimationFrame(animId));\n}`,
    category: 'toolchain',
  },
  {
    id: 'pid-overclock-capture',
    name: '超频截图器',
    description: '高频截取视频帧，生成色块序列时间线',
    tags: ['截图', '超频', '时间线'],
    code: `function overclockCapture(video, canvas, fps = 10) {\n  const ctx = canvas.getContext('2d');\n  const interval = 1000 / fps;\n  const timeline = [];\n  let timer;\n  function capture() {\n    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);\n    const thumbnail = canvas.toDataURL('image/jpeg', 0.3);\n    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n    timeline.push({\n      timestamp: video.currentTime,\n      thumbnail,\n      colors: extractDominantColors(canvas, 5)\n    });\n  }\n  video.addEventListener('play', () => { timer = setInterval(capture, interval); });\n  video.addEventListener('pause', () => clearInterval(timer));\n  video.addEventListener('ended', () => clearInterval(timer));\n  return timeline;\n}`,
    category: 'toolchain',
  },
  {
    id: 'pid-gradient-mesh',
    name: '渐变网格生成器',
    description: '基于色块生成渐变网格背景',
    tags: ['渐变', '网格', '背景'],
    code: `function generateGradientMesh(colors, width = 800, height = 600) {\n  const canvas = document.createElement('canvas');\n  canvas.width = width;\n  canvas.height = height;\n  const ctx = canvas.getContext('2d');\n  const cols = Math.ceil(Math.sqrt(colors.length));\n  const cellW = width / cols;\n  const cellH = height / cols;\n  colors.forEach((color, i) => {\n    const x = (i % cols) * cellW;\n    const y = Math.floor(i / cols) * cellH;\n    const gradient = ctx.createRadialGradient(\n      x + cellW/2, y + cellH/2, 0,\n      x + cellW/2, y + cellH/2, Math.max(cellW, cellH)\n    );\n    gradient.addColorStop(0, \`rgba(\${color.rgb.join(',')},1)\`);\n    gradient.addColorStop(1, \`rgba(\${color.rgb.join(',')},0)\`);\n    ctx.fillStyle = gradient;\n    ctx.fillRect(0, 0, width, height);\n  });\n  return canvas;\n}`,
    category: 'template',
  },
  {
    id: 'pid-color-pulse',
    name: '色块脉冲动画',
    description: '色块随节拍脉冲的动画效果',
    tags: ['动画', '脉冲', '色块'],
    code: `function colorPulse(container, colors, bpm = 120) {\n  const interval = 60000 / bpm;\n  let index = 0;\n  function pulse() {\n    const color = colors[index % colors.length];\n    container.style.backgroundColor = \`rgb(\${color.rgb.join(',')})\`;\n    container.style.transform = 'scale(1.05)';\n    setTimeout(() => { container.style.transform = 'scale(1)'; }, interval * 0.3);\n    index++;\n  }\n  setInterval(pulse, interval);\n}`,
    category: 'template',
  },
  {
    id: 'pid-palette-export',
    name: '调色板导出器',
    description: '将色块导出为多种格式（CSS、JSON、SVG）',
    tags: ['导出', '调色板', '格式'],
    code: `function exportPalette(colors, format = 'css') {\n  switch(format) {\n    case 'css':\n      return ':root {\\n' + colors.map((c, i) =>\n        \`  --color-\${i+1}: \${c.hex};\`\n      ).join('\\n') + '\\n}';\n    case 'json':\n      return JSON.stringify(colors.map(c => ({\n        hex: c.hex, rgb: c.rgb, percentage: c.percentage\n      })), null, 2);\n    case 'svg':\n      const w = 60, gap = 8;\n      const totalW = colors.length * (w + gap);\n      return '<svg width=\"' + totalW + '\" height=\"' + w + '\">' +\n        colors.map((c, i) =>\n          '<rect x=\"' + i*(w+gap) + '\" width=\"' + w + '\" height=\"' + w + '\" fill=\"' + c.hex + '\" rx=\"8\"/>'\n        ).join('') + '</svg>';\n  }\n}`,
    category: 'snippet',
  },
  {
    id: 'pid-frame-diff',
    name: '帧差分分析器',
    description: '对比相邻帧色块差异，检测场景切换',
    tags: ['帧差分', '场景', '检测'],
    code: `function frameDiffAnalysis(timeline, threshold = 0.3) {\n  const sceneChanges = [];\n  for (let i = 1; i < timeline.length; i++) {\n    const prev = timeline[i-1].colorBlocks;\n    const curr = timeline[i].colorBlocks;\n    let diff = 0;\n    for (let j = 0; j < Math.min(prev.length, curr.length); j++) {\n      diff += Math.abs(prev[j].percentage - curr[j].percentage);\n    }\n    if (diff > threshold) {\n      sceneChanges.push({\n        timestamp: timeline[i].timestamp,\n        diffScore: diff,\n        index: i\n      });\n    }\n  }\n  return sceneChanges;\n}`,
    category: 'snippet',
  },
  {
    id: 'pid-mosaic',
    name: '马赛克生成器',
    description: '将图片转换为色块马赛克效果',
    tags: ['马赛克', '像素化', '效果'],
    code: `function generateMosaic(canvas, blockSize = 10) {\n  const ctx = canvas.getContext('2d');\n  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);\n  const data = imageData.data;\n  for (let y = 0; y < canvas.height; y += blockSize) {\n    for (let x = 0; x < canvas.width; x += blockSize) {\n      let r = 0, g = 0, b = 0, count = 0;\n      for (let dy = 0; dy < blockSize && y+dy < canvas.height; dy++) {\n        for (let dx = 0; dx < blockSize && x+dx < canvas.width; dx++) {\n          const idx = ((y+dy) * canvas.width + (x+dx)) * 4;\n          r += data[idx]; g += data[idx+1]; b += data[idx+2];\n          count++;\n        }\n      }\n      r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);\n      ctx.fillStyle = \`rgb(\${r},\${g},\${b})\`;\n      ctx.fillRect(x, y, blockSize, blockSize);\n    }\n  }\n}`,
    category: 'template',
  },
]
