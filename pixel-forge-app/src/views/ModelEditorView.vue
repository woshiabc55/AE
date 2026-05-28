<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { EFFECTS, getDefaultParams } from '../core/effects'
import { applyEffect } from '../core/renderer'

const canvasW = ref(128)
const canvasH = ref(128)
const zoom = ref(4)
const showGrid = ref(true)
const currentTool = ref('brush')
const brushSize = ref(1)
const currentColor = ref('#00ff88')
const currentEffect = ref('none')
const effectParams = ref<Record<string, number | boolean | string>>(getDefaultParams('pixelate'))
const isPlaying = ref(false)
const frame = ref(0)
const fps = ref(0)
const mousePos = ref('0,0')

const modelLayers = ref<{ id: string; name: string; visible: boolean; locked: boolean; data: Uint8ClampedArray | null }[]>([
  { id: 'layer-1', name: '图层 1', visible: true, locked: false, data: null },
])
const activeLayerId = ref('layer-1')

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let offCanvas: HTMLCanvasElement | null = null
let offCtx: CanvasRenderingContext2D | null = null
let pixelData: ImageData | null = null
let sourceImage: HTMLImageElement | null = null
let animId: number | null = null
let mouseDown = false
let frameCount = 0
let fpsTime = 0
let sourceSnapshot: Uint8ClampedArray | null = null

const activeLayer = computed(() => modelLayers.value.find(l => l.id === activeLayerId.value))

function initCanvas() {
  if (!canvasRef.value) return
  const c = canvasRef.value
  c.width = canvasW.value * zoom.value
  c.height = canvasH.value * zoom.value
  ctx = c.getContext('2d')!
  offCanvas = document.createElement('canvas')
  offCanvas.width = canvasW.value
  offCanvas.height = canvasH.value
  offCtx = offCanvas.getContext('2d')!
  pixelData = offCtx.createImageData(canvasW.value, canvasH.value)
  for (let i = 0; i < pixelData.data.length; i += 4) {
    pixelData.data[i] = 10; pixelData.data[i + 1] = 10; pixelData.data[i + 2] = 18; pixelData.data[i + 3] = 255
  }
  offCtx.putImageData(pixelData, 0, 0)
  renderCanvas()
}

function renderCanvas() {
  if (!ctx || !offCanvas) return
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
  ctx.drawImage(offCanvas, 0, 0, canvasRef.value!.width, canvasRef.value!.height)
  if (showGrid.value && zoom.value >= 4) {
    ctx.strokeStyle = 'rgba(0,255,136,0.06)'
    ctx.lineWidth = 0.5
    for (let x = 0; x <= canvasW.value; x++) { ctx.beginPath(); ctx.moveTo(x * zoom.value, 0); ctx.lineTo(x * zoom.value, canvasRef.value!.height); ctx.stroke() }
    for (let y = 0; y <= canvasH.value; y++) { ctx.beginPath(); ctx.moveTo(0, y * zoom.value); ctx.lineTo(canvasRef.value!.width, y * zoom.value); ctx.stroke() }
  }
}

function setPixel(x: number, y: number, r: number, g: number, b: number, a = 255) {
  if (!pixelData || x < 0 || x >= canvasW.value || y < 0 || y >= canvasH.value) return
  const i = (y * canvasW.value + x) * 4
  pixelData.data[i] = r; pixelData.data[i + 1] = g; pixelData.data[i + 2] = b; pixelData.data[i + 3] = a
}

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

function drawBrush(cx: number, cy: number) {
  const [r, g, b] = hexToRgb(currentColor.value)
  const s = brushSize.value
  const half = Math.floor(s / 2)
  for (let dy = 0; dy < s; dy++) {
    for (let dx = 0; dx < s; dx++) {
      if (currentTool.value === 'eraser') setPixel(cx - half + dx, cy - half + dy, 10, 10, 18)
      else setPixel(cx - half + dx, cy - half + dy, r, g, b)
    }
  }
  if (offCtx && pixelData) { offCtx.putImageData(pixelData, 0, 0); renderCanvas() }
}

function onCanvasMouseDown(e: MouseEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  const cx = Math.floor((e.clientX - rect.left) / zoom.value)
  const cy = Math.floor((e.clientY - rect.top) / zoom.value)
  mouseDown = true
  if (currentTool.value === 'brush' || currentTool.value === 'eraser') drawBrush(cx, cy)
  else if (currentTool.value === 'fill') {
    const [r, g, b] = hexToRgb(currentColor.value)
    floodFill(cx, cy, r, g, b)
  } else if (currentTool.value === 'pick') {
    if (!pixelData) return
    const i = (cy * canvasW.value + cx) * 4
    const pr = pixelData.data[i]!, pg = pixelData.data[i + 1]!, pb = pixelData.data[i + 2]!
    currentColor.value = '#' + [pr, pg, pb].map(v => v.toString(16).padStart(2, '0')).join('')
  }
  mousePos.value = `${cx},${cy}`
}

function onCanvasMouseMove(e: MouseEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  const cx = Math.floor((e.clientX - rect.left) / zoom.value)
  const cy = Math.floor((e.clientY - rect.top) / zoom.value)
  mousePos.value = `${cx},${cy}`
  if (mouseDown && (currentTool.value === 'brush' || currentTool.value === 'eraser')) drawBrush(cx, cy)
}

function onCanvasMouseUp() { mouseDown = false }
function onCanvasMouseLeave() { mouseDown = false }

function floodFill(sx: number, sy: number, fr: number, fg: number, fb: number) {
  if (!pixelData) return
  const w = canvasW.value, h = canvasH.value
  const ci = (sy * w + sx) * 4
  const cr = pixelData.data[ci]!, cg = pixelData.data[ci + 1]!, cb = pixelData.data[ci + 2]!
  if (cr === fr && cg === fg && cb === fb) return
  const stack: [number, number][] = [[sx, sy]]
  const visited = new Set<string>()
  while (stack.length) {
    const [x, y] = stack.pop()!
    const key = `${x},${y}`
    if (visited.has(key)) continue
    visited.add(key)
    const i = (y * w + x) * 4
    if (pixelData.data[i] !== cr || pixelData.data[i + 1] !== cg || pixelData.data[i + 2] !== cb) continue
    setPixel(x, y, fr, fg, fb)
    if (x > 0) stack.push([x - 1, y])
    if (x < w - 1) stack.push([x + 1, y])
    if (y > 0) stack.push([x, y - 1])
    if (y < h - 1) stack.push([x, y + 1])
  }
  if (offCtx) { offCtx.putImageData(pixelData, 0, 0); renderCanvas() }
}

function onCanvasWheel(e: WheelEvent) {
  e.preventDefault()
  zoom.value = Math.max(1, Math.min(32, zoom.value + (e.deltaY > 0 ? -1 : 1)))
  initCanvas()
}

function onUpload() {
  const input = document.createElement('input')
  input.type = 'file'; input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => {
      sourceImage = img
      if (offCtx) {
        offCanvas!.width = canvasW.value; offCanvas!.height = canvasH.value
        offCtx.imageSmoothingEnabled = false
        offCtx.drawImage(img, 0, 0, canvasW.value, canvasH.value)
        pixelData = offCtx.getImageData(0, 0, canvasW.value, canvasH.value)
        renderCanvas()
      }
    }
    img.src = URL.createObjectURL(file)
  }
  input.click()
}

function animateLoop(timestamp: number) {
  if (!isPlaying.value || !pixelData || !offCtx) return
  frame.value++
  frameCount++
  if (timestamp - fpsTime >= 1000) { fps.value = frameCount; frameCount = 0; fpsTime = timestamp }
  if (!sourceSnapshot) sourceSnapshot = new Uint8ClampedArray(pixelData.data)
  const src = new Uint8ClampedArray(sourceSnapshot)
  applyEffect(src, pixelData.data, canvasW.value, canvasH.value, currentEffect.value, effectParams.value, timestamp)
  offCtx.putImageData(pixelData, 0, 0)
  renderCanvas()
  animId = requestAnimationFrame(animateLoop)
}

function play() {
  if (isPlaying.value || currentEffect.value === 'none') return
  sourceSnapshot = null
  isPlaying.value = true; frame.value = 0; fpsTime = performance.now(); frameCount = 0
  animId = requestAnimationFrame(animateLoop)
}

function stop() {
  isPlaying.value = false
  if (animId) cancelAnimationFrame(animId)
  animId = null
  sourceSnapshot = null
  if (sourceImage && offCtx) {
    offCtx.imageSmoothingEnabled = false
    offCtx.drawImage(sourceImage, 0, 0, canvasW.value, canvasH.value)
    pixelData = offCtx.getImageData(0, 0, canvasW.value, canvasH.value)
    renderCanvas()
  }
}

function exportPng() {
  if (!offCanvas) return
  const link = document.createElement('a')
  link.download = 'daolue-model-export.png'
  const expCanvas = document.createElement('canvas')
  expCanvas.width = canvasW.value; expCanvas.height = canvasH.value
  expCanvas.getContext('2d')!.drawImage(offCanvas, 0, 0)
  link.href = expCanvas.toDataURL('image/png')
  link.click()
}

function switchEffect(id: string) {
  currentEffect.value = id
  if (id !== 'none') effectParams.value = getDefaultParams(id)
}

function addLayer() {
  const id = `layer-${modelLayers.value.length + 1}`
  modelLayers.value.push({ id, name: `图层 ${modelLayers.value.length + 1}`, visible: true, locked: false, data: null })
  activeLayerId.value = id
}

function removeLayer() {
  if (modelLayers.value.length <= 1) return
  modelLayers.value = modelLayers.value.filter(l => l.id !== activeLayerId.value)
  activeLayerId.value = modelLayers.value[0]!.id
}

const currentEffectInfo = computed(() => EFFECTS.find(e => e.id === currentEffect.value))

onMounted(() => { initCanvas() })
onUnmounted(() => { stop() })
watch([canvasW, canvasH], () => { initCanvas() })
</script>

<template>
  <div class="model-editor">
    <header class="me-header">
      <span class="me-logo">DAOLUE</span>
      <span class="me-title">稻锊 模型 编辑器</span>
      <span class="sep">|</span>
      <span class="me-badge">CANVAS PIXEL</span>
      <span class="spacer"></span>
      <button class="me-btn" @click="onUpload">⬆ 导入</button>
      <button class="me-btn" :class="{ active: isPlaying }" @click="play" :disabled="currentEffect === 'none'">▶ 播放</button>
      <button class="me-btn" @click="stop">■ 停止</button>
      <span class="sep">|</span>
      <button class="me-btn" @click="exportPng">⬇ 导出</button>
    </header>

    <div class="me-body">
      <aside class="me-left">
        <div class="ml-head">
          <span class="ml-title">模型图层</span>
          <span class="ml-actions">
            <button class="ml-act-btn" @click="addLayer" title="添加图层">+</button>
            <button class="ml-act-btn" @click="removeLayer" title="移除图层">−</button>
          </span>
        </div>
        <div class="ml-list">
          <div
            v-for="layer in modelLayers"
            :key="layer.id"
            class="ml-item"
            :class="{ active: activeLayerId === layer.id }"
            @click="activeLayerId = layer.id"
          >
            <span class="ml-eye" :class="{ off: !layer.visible }">{{ layer.visible ? '◉' : '○' }}</span>
            <span class="ml-lock" :class="{ locked: layer.locked }">{{ layer.locked ? '🔒' : '🔓' }}</span>
            <span class="ml-name">{{ layer.name }}</span>
          </div>
        </div>
      </aside>

      <div class="me-center">
        <div class="me-toolbar">
          <div v-for="tool in (['brush','eraser','fill','pick'] as const)" :key="tool" class="me-tool" :class="{ active: currentTool === tool }" @click="currentTool = tool">
            {{ { brush: '✏', eraser: '◻', fill: '◉', pick: '💧' }[tool] }}
          </div>
          <div class="me-sep"></div>
          <span class="me-tlabel">尺寸</span>
          <input class="me-tinput" type="number" v-model.number="brushSize" min="1" max="32">
          <div class="me-sep"></div>
          <span class="me-tlabel">网格</span>
          <div class="me-toggle" :class="{ on: showGrid }" @click="showGrid = !showGrid"></div>
          <div class="me-sep"></div>
          <span class="me-tlabel">缩放</span>
          <span class="me-tval">{{ zoom }}x</span>
          <div class="me-sep"></div>
          <span class="me-tlabel">画布</span>
          <input class="me-tinput" type="number" v-model.number="canvasW" min="16" max="512" style="width:48px">
          <span style="color:#3a5a3a">×</span>
          <input class="me-tinput" type="number" v-model.number="canvasH" min="16" max="512" style="width:48px">
          <div class="me-sep"></div>
          <span class="me-tlabel">效果</span>
          <select class="me-select" :value="currentEffect" @change="switchEffect(($event.target as HTMLSelectElement).value)">
            <option value="none">无</option>
            <option v-for="ef in EFFECTS" :key="ef.id" :value="ef.id">{{ ef.name }}</option>
          </select>
        </div>
        <div class="me-canvas-area">
          <canvas ref="canvasRef" @mousedown="onCanvasMouseDown" @mousemove="onCanvasMouseMove" @mouseup="onCanvasMouseUp" @mouseleave="onCanvasMouseLeave" @wheel.prevent="onCanvasWheel"></canvas>
        </div>
      </div>

      <aside class="me-right">
        <div class="mr-section" v-if="currentEffectInfo">
          <div class="mr-title" :style="{ color: '#ff6b9d' }">效果参数</div>
          <div class="mr-body">
            <div v-for="p in currentEffectInfo.params" :key="p.name" class="mr-row">
              <span class="mr-label">{{ p.label }}</span>
              <template v-if="p.type === 'range'">
                <input class="mr-slider" type="range" :min="p.min" :max="p.max" :step="p.step || 1" :value="effectParams[p.name]" @input="effectParams[p.name] = +($event.target as HTMLInputElement).value">
                <span class="mr-val">{{ effectParams[p.name] }}</span>
              </template>
              <template v-if="p.type === 'bool'">
                <div class="me-toggle" :class="{ on: effectParams[p.name] }" @click="effectParams[p.name] = !effectParams[p.name]"></div>
              </template>
              <template v-if="p.type === 'select'">
                <select class="mr-select" :value="effectParams[p.name]" @change="effectParams[p.name] = ($event.target as HTMLSelectElement).value">
                  <option v-for="o in p.options" :key="o" :value="o">{{ o }}</option>
                </select>
              </template>
            </div>
          </div>
        </div>
        <div class="mr-section" v-else>
          <div class="mr-title" style="color:#3a5a3a">选择效果以查看参数</div>
        </div>
        <div class="mr-section">
          <div class="mr-title" style="color:#00ff88">画笔颜色</div>
          <div class="mr-body">
            <div class="mr-row">
              <span class="mr-label">当前色</span>
              <input class="mr-color" type="color" v-model="currentColor">
              <span class="mr-val">{{ currentColor }}</span>
            </div>
          </div>
        </div>
        <div class="mr-section">
          <div class="mr-title" style="color:#ffaa00">模型属性</div>
          <div class="mr-body">
            <div class="mr-row">
              <span class="mr-label">宽 × 高</span>
              <span class="mr-val">{{ canvasW }} × {{ canvasH }}</span>
            </div>
            <div class="mr-row">
              <span class="mr-label">图层数</span>
              <span class="mr-val" style="color:#ffaa00">{{ modelLayers.length }}</span>
            </div>
            <div class="mr-row">
              <span class="mr-label">缩放级别</span>
              <span class="mr-val" style="color:#00ff88">{{ zoom }}x</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <footer class="me-status">
      <span class="me-indicator" :style="{ background: isPlaying ? '#ffaa00' : '#00ff88' }"></span>
      <span>坐标: <span style="color:#00ff88">{{ mousePos }}</span></span>
      <span class="sep">|</span>
      <span>颜色: <span style="color:#00ff88">{{ currentColor }}</span></span>
      <span class="sep">|</span>
      <span>帧: <span style="color:#00ff88">{{ frame }}</span></span>
      <span class="sep">|</span>
      <span>FPS: <span style="color:#00ff88">{{ fps }}</span></span>
      <span class="sep">|</span>
      <span>图层: <span style="color:#ffaa00">{{ activeLayer?.name }}</span></span>
    </footer>
  </div>
</template>

<style scoped>
.model-editor { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }

.me-header { height: 42px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 10px; flex-shrink: 0; }
.me-logo { font-family: 'Press Start 2P', monospace; font-size: 10px; color: #7cff6b; text-shadow: 0 0 14px rgba(124,255,107,0.5); letter-spacing: 2px; }
.me-title { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #ffaa00; letter-spacing: 1.5px; text-shadow: 0 0 8px rgba(255,170,0,0.3); }
.me-badge { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 3px 8px; border: 1px solid #00ff88; color: #00ff88; border-radius: 2px; letter-spacing: 1px; }
.sep { color: #1a2a1a; }
.spacer { flex: 1; }
.me-btn { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 5px 12px; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; }
.me-btn:hover { border-color: #00ff88; color: #00ff88; }
.me-btn.active { background: rgba(0,255,136,0.1); border-color: #00ff88; color: #00ff88; }
.me-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.me-body { flex: 1; display: flex; overflow: hidden; }

.me-left { width: 160px; background: #0a0a12; border-right: 1px solid #1a2a1a; display: flex; flex-direction: column; flex-shrink: 0; }
.ml-head { padding: 8px 10px; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; justify-content: space-between; }
.ml-title { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #ffaa00; letter-spacing: 1px; }
.ml-actions { display: flex; gap: 2px; }
.ml-act-btn { width: 18px; height: 18px; font-family: 'Press Start 2P', monospace; font-size: 8px; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
.ml-act-btn:hover { border-color: #00ff88; color: #00ff88; }
.ml-list { flex: 1; overflow-y: auto; padding: 4px; }
.ml-item { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px solid transparent; border-radius: 3px; cursor: pointer; transition: all 0.15s; user-select: none; }
.ml-item:hover { background: rgba(255,255,255,0.02); }
.ml-item.active { border-color: #ffaa00; background: rgba(255,170,0,0.06); }
.ml-eye { font-size: 10px; color: #00ff88; }
.ml-eye.off { color: #3a5a3a; }
.ml-lock { font-size: 8px; }
.ml-name { font-size: 10px; color: #d0ffd0; flex: 1; }

.me-center { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 400px; }
.me-toolbar { height: 36px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 10px; gap: 6px; flex-shrink: 0; }
.me-tool { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 1px solid #1a2a1a; border-radius: 3px; cursor: pointer; transition: all 0.2s; font-size: 13px; color: #6a8a6a; }
.me-tool:hover { border-color: #00ff88; color: #00ff88; }
.me-tool.active { background: rgba(0,255,136,0.1); border-color: #00ff88; color: #00ff88; }
.me-sep { width: 1px; height: 20px; background: #1a2a1a; margin: 0 4px; }
.me-tlabel { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; }
.me-tinput { width: 50px; height: 22px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; text-align: center; }
.me-tinput:focus { border-color: #00ff88; outline: none; }
.me-tval { font-size: 10px; color: #00ff88; min-width: 28px; }
.me-select { height: 22px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; }
.me-toggle { width: 32px; height: 16px; background: #1a2a1a; border-radius: 8px; cursor: pointer; position: relative; transition: background 0.2s; }
.me-toggle.on { background: rgba(0,255,136,0.3); }
.me-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; background: #3a5a3a; border-radius: 50%; transition: all 0.2s; }
.me-toggle.on::after { left: 18px; background: #00ff88; }
.me-canvas-area { flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #050508; }
.me-canvas-area::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,170,0,0.015) 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; }
.me-canvas-area canvas { image-rendering: pixelated; image-rendering: crisp-edges; border: 1px solid #253525; box-shadow: 0 0 40px rgba(255,170,0,0.06), 0 0 80px rgba(0,0,0,0.4); cursor: crosshair; position: relative; z-index: 1; }

.me-right { width: 240px; background: #0a0a12; border-left: 1px solid #1a2a1a; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; padding: 8px; gap: 6px; overflow-y: auto; }
.mr-section { border: 1px solid #1a2a1a; border-radius: 3px; overflow: hidden; }
.mr-title { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 6px 8px; letter-spacing: 1px; background: #0f0f1a; }
.mr-body { padding: 6px 8px; border-top: 1px solid #1a2a1a; }
.mr-row { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.mr-label { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 0.5px; min-width: 55px; flex-shrink: 0; }
.mr-slider { flex: 1; -webkit-appearance: none; height: 3px; background: #1a2a1a; border-radius: 2px; outline: none; }
.mr-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; background: #ffaa00; border-radius: 50%; cursor: pointer; }
.mr-val { font-size: 10px; color: #ffaa00; min-width: 28px; text-align: right; }
.mr-select { flex: 1; height: 20px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; }
.mr-color { width: 24px; height: 20px; border: 1px solid #1a2a1a; border-radius: 2px; cursor: pointer; padding: 0; }

.me-status { height: 24px; background: #0a0a12; border-top: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 14px; font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; gap: 14px; flex-shrink: 0; }
.me-indicator { width: 6px; height: 6px; border-radius: 50%; }
</style>