<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { EFFECTS, getDefaultParams } from '../core/effects'
import { applyEffect } from '../core/renderer'
import { MCOP_FORMATS, SKILL_PACKS, WORKSPACES } from '../core/mcop'
import type { EffectParam } from '../core/effects'

const canvasW = ref(64)
const canvasH = ref(64)
const zoom = ref(8)
const showGrid = ref(true)
const currentTool = ref('brush')
const brushSize = ref(1)
const currentColor = ref('#00ff88')
const currentEffect = ref('pixelate')
const effectParams = ref<Record<string, number | boolean | string>>(getDefaultParams('pixelate'))
const isPlaying = ref(false)
const frame = ref(0)
const fps = ref(0)
const mousePos = ref('0,0')
const workspace = ref('workspace-starter')

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

const leftTab = ref('docs')
const rightTab = ref('effect')
const expandedGroups = ref<Set<string>>(new Set(MCOP_FORMATS.map(f => f.ext)))
const selectedDoc = ref<{ ext: string; id: string; name: string } | null>(null)

let sourceSnapshot: Uint8ClampedArray | null = null

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
    ctx.strokeStyle = 'rgba(0,255,136,0.08)'
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
  if (isPlaying.value) return
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
  link.download = 'pixel-forge-export.png'
  const expCanvas = document.createElement('canvas')
  expCanvas.width = canvasW.value; expCanvas.height = canvasH.value
  expCanvas.getContext('2d')!.drawImage(offCanvas, 0, 0)
  link.href = expCanvas.toDataURL('image/png')
  link.click()
}

function switchEffect(id: string) {
  currentEffect.value = id
  effectParams.value = getDefaultParams(id)
}

function toggleGroup(ext: string) {
  if (expandedGroups.value.has(ext)) expandedGroups.value.delete(ext)
  else expandedGroups.value.add(ext)
}

const currentEffectInfo = computed(() => EFFECTS.find(e => e.id === currentEffect.value))

onMounted(() => { initCanvas() })
onUnmounted(() => { stop() })

watch([canvasW, canvasH], () => { initCanvas() })
</script>

<template>
  <div class="editor">
    <header class="topbar">
      <span class="logo">PIXEL FORGE</span>
      <span class="logo-sub">EDITOR</span>
      <span class="sep">|</span>
      <span class="ws-badge">{{ workspace.replace('workspace-', '').toUpperCase() }}</span>
      <span class="spacer"></span>
      <button class="tbtn" @click="onUpload">⬆ 上传</button>
      <button class="tbtn" :class="{ active: isPlaying }" @click="play">▶ 播放</button>
      <button class="tbtn" @click="stop">■ 停止</button>
      <span class="sep">|</span>
      <button class="tbtn" @click="exportPng">⬇ 导出</button>
    </header>

    <div class="main">
      <aside class="left-panel">
        <div class="lp-tabs">
          <div class="lp-tab" :class="{ active: leftTab === 'docs' }" @click="leftTab = 'docs'">文档</div>
          <div class="lp-tab" :class="{ active: leftTab === 'skillpacks' }" @click="leftTab = 'skillpacks'">技能包</div>
          <div class="lp-tab" :class="{ active: leftTab === 'workspace' }" @click="leftTab = 'workspace'">空间</div>
        </div>
        <div class="lp-content">
          <template v-if="leftTab === 'docs'">
            <div v-for="fmt in MCOP_FORMATS" :key="fmt.ext" class="fmt-group">
              <div class="fmt-title" @click="toggleGroup(fmt.ext)">
                <span class="arrow" :class="{ collapsed: !expandedGroups.has(fmt.ext) }">▼</span>
                <span class="dot" :style="{ background: fmt.color }"></span>
                <span :style="{ color: fmt.color }">{{ fmt.name }}</span>
                <span class="fmt-count">{{ fmt.items.length }}</span>
              </div>
              <div v-if="expandedGroups.has(fmt.ext)" class="fmt-items">
                <div v-for="item in fmt.items" :key="item.id" class="fmt-item" :class="{ active: selectedDoc?.id === item.id }" @click="selectedDoc = { ext: fmt.ext, id: item.id, name: item.name }">
                  <span :style="{ color: fmt.color }">{{ fmt.icon }}</span>
                  <span v-if="item.layer" class="layer-tag" :class="item.layer">{{ item.layer }}</span>
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="leftTab === 'skillpacks'">
            <div class="sp-section">
              <div class="sp-title" style="color:#7cff6b">TIER 1 · 基础</div>
              <div v-for="sp in SKILL_PACKS.filter(s => s.tier === 1)" :key="sp.id" class="sp-item">
                <span :style="{ color: sp.color }">●</span>
                <span :style="{ color: sp.color }">{{ sp.name }}</span>
              </div>
            </div>
            <div class="sp-section">
              <div class="sp-title" style="color:#a29bfe">TIER 2 · 架构</div>
              <div v-for="sp in SKILL_PACKS.filter(s => s.tier === 2)" :key="sp.id" class="sp-item">
                <span :style="{ color: sp.color }">●</span>
                <span :style="{ color: sp.color }">{{ sp.name }}</span>
              </div>
            </div>
          </template>
          <template v-if="leftTab === 'workspace'">
            <div v-for="ws in WORKSPACES" :key="ws.id" class="ws-card" :class="{ active: workspace === ws.id }" @click="workspace = ws.id">
              <div class="ws-tier">TIER {{ ws.tier }}</div>
              <div class="ws-name">{{ ws.name }}</div>
              <div class="ws-desc">{{ ws.desc }}</div>
              <div class="ws-features">
                <span :class="{ on: ws.effects > 1 }">效果:{{ ws.effects === 99 ? '∞' : ws.effects }}</span>
                <span :class="{ on: ws.physics }">物理</span>
                <span :class="{ on: ws.threeD }">3D</span>
                <span :class="{ on: ws.plugins }">插件</span>
              </div>
            </div>
          </template>
        </div>
      </aside>

      <div class="center">
        <div class="toolbar">
          <div v-for="tool in (['brush','eraser','fill','pick','move'] as const)" :key="tool" class="ct-tool" :class="{ active: currentTool === tool }" @click="currentTool = tool">
            {{ { brush: '✏', eraser: '◻', fill: '◉', pick: '💧', move: '✥' }[tool] }}
          </div>
          <div class="ct-sep"></div>
          <span class="ct-label">尺寸</span>
          <input class="ct-input" type="number" v-model.number="brushSize" min="1" max="32">
          <div class="ct-sep"></div>
          <span class="ct-label">网格</span>
          <div class="toggle" :class="{ on: showGrid }" @click="showGrid = !showGrid"></div>
          <div class="ct-sep"></div>
          <span class="ct-label">缩放</span>
          <span class="ct-val">{{ zoom }}x</span>
          <div class="ct-sep"></div>
          <span class="ct-label">画布</span>
          <input class="ct-input" type="number" v-model.number="canvasW" min="8" max="256" style="width:42px">
          <span style="color:#3a5a3a">×</span>
          <input class="ct-input" type="number" v-model.number="canvasH" min="8" max="256" style="width:42px">
          <div class="ct-sep"></div>
          <span class="ct-label">效果</span>
          <select class="ct-select" :value="currentEffect" @change="switchEffect(($event.target as HTMLSelectElement).value)">
            <option value="none">无</option>
            <option v-for="ef in EFFECTS" :key="ef.id" :value="ef.id">{{ ef.name }}</option>
          </select>
        </div>
        <div class="canvas-area">
          <canvas ref="canvasRef" @mousedown="onCanvasMouseDown" @mousemove="onCanvasMouseMove" @mouseup="onCanvasMouseUp" @mouseleave="onCanvasMouseLeave" @wheel.prevent="onCanvasWheel"></canvas>
        </div>
      </div>

      <aside class="right-panel">
        <div class="rp-tabs">
          <div class="rp-tab" :class="{ active: rightTab === 'effect' }" @click="rightTab = 'effect'">效果</div>
          <div class="rp-tab" :class="{ active: rightTab === 'pipeline' }" @click="rightTab = 'pipeline'">管线</div>
          <div class="rp-tab" :class="{ active: rightTab === 'scene' }" @click="rightTab = 'scene'">场景</div>
        </div>
        <div class="rp-content">
          <template v-if="rightTab === 'effect' && currentEffectInfo">
            <div class="prop-section">
              <div class="prop-title" :style="{ color: '#ff6b9d' }">KELEX: {{ currentEffectInfo.name }}</div>
              <div class="prop-body">
                <div v-for="p in currentEffectInfo.params" :key="p.name" class="prop-row">
                  <span class="prop-label">{{ p.label }}</span>
                  <template v-if="p.type === 'range'">
                    <input class="prop-slider" type="range" :min="p.min" :max="p.max" :step="p.step || 1" :value="effectParams[p.name]" @input="effectParams[p.name] = +($event.target as HTMLInputElement).value">
                    <span class="prop-val">{{ effectParams[p.name] }}</span>
                  </template>
                  <template v-if="p.type === 'bool'">
                    <div class="toggle" :class="{ on: effectParams[p.name] }" @click="effectParams[p.name] = !effectParams[p.name]"></div>
                  </template>
                  <template v-if="p.type === 'select'">
                    <select class="prop-select" :value="effectParams[p.name]" @change="effectParams[p.name] = ($event.target as HTMLSelectElement).value">
                      <option v-for="o in p.options" :key="o" :value="o">{{ o }}</option>
                    </select>
                  </template>
                </div>
              </div>
            </div>
            <div class="prop-section">
              <div class="prop-title" style="color:#00ff88">画笔颜色</div>
              <div class="prop-body">
                <div class="prop-row">
                  <span class="prop-label">当前色</span>
                  <input class="prop-color" type="color" v-model="currentColor">
                  <span class="prop-val">{{ currentColor }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="rightTab === 'pipeline'">
            <div class="prop-section">
              <div class="prop-title" style="color:#00ff88">RPA: 渲染管线</div>
              <div class="prop-body">
                <div class="pipe-stage active"><span class="pipe-num">1</span>source<input></div>
                <div class="pipe-arrow">↓</div>
                <div class="pipe-stage active"><span class="pipe-num">2</span>effect</div>
                <div class="pipe-arrow">↓</div>
                <div class="pipe-stage"><span class="pipe-num">3</span>output</div>
              </div>
            </div>
          </template>
          <template v-if="rightTab === 'scene'">
            <div class="prop-section">
              <div class="prop-title" style="color:#44ddff">SELENA: 场景配置</div>
              <div class="prop-body">
                <div class="prop-row"><span class="prop-label">3D面</span><select class="prop-select"><option>plane</option><option>sphere</option><option>cylinder</option><option>box</option><option>torus</option></select></div>
                <div class="prop-row"><span class="prop-label">力场</span><select class="prop-select"><option>none</option><option>gravity</option><option>wind</option><option>explode</option><option>wave3d</option><option>spring</option></select></div>
              </div>
            </div>
            <div class="prop-section">
              <div class="prop-title" style="color:#ff3366">OPIC: 纹理映射</div>
              <div class="prop-body">
                <div class="prop-row"><span class="prop-label">纹理</span><select class="prop-select"><option>pixel-default</option><option>rings-neon</option><option>spiral-cyber</option><option>checkerboard-mono</option><option>gradient-sunset</option><option>stripe-signal</option></select></div>
              </div>
            </div>
          </template>
        </div>
      </aside>
    </div>

    <footer class="statusbar">
      <span class="indicator" :style="{ background: isPlaying ? '#ffaa00' : '#00ff88' }"></span>
      <span>坐标: <span style="color:#00ff88">{{ mousePos }}</span></span>
      <span class="sep">|</span>
      <span>颜色: <span style="color:#00ff88">{{ currentColor }}</span></span>
      <span class="sep">|</span>
      <span>帧: <span style="color:#00ff88">{{ frame }}</span></span>
      <span class="sep">|</span>
      <span>FPS: <span style="color:#00ff88">{{ fps }}</span></span>
    </footer>
  </div>
</template>

<style scoped>
.editor { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }
.topbar { height: 38px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 14px; gap: 10px; flex-shrink: 0; }
.logo { font-family: 'Press Start 2P', monospace; font-size: 9px; color: #7cff6b; text-shadow: 0 0 12px rgba(124,255,107,0.5); letter-spacing: 2px; }
.logo-sub { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #3a5a3a; letter-spacing: 1px; margin-left: 4px; }
.sep { color: #1a2a1a; }
.spacer { flex: 1; }
.ws-badge { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 3px 8px; border: 1px solid #00ff88; color: #00ff88; border-radius: 2px; letter-spacing: 1px; }
.tbtn { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 4px 10px; background: transparent; border: 1px solid #1a2a1a; color: #6a8a6a; border-radius: 2px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; }
.tbtn:hover { border-color: #00ff88; color: #00ff88; }
.tbtn.active { background: rgba(0,255,136,0.1); border-color: #00ff88; color: #00ff88; }
.main { flex: 1; display: flex; overflow: hidden; }
.left-panel { width: 240px; background: #0a0a12; border-right: 1px solid #1a2a1a; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
.lp-tabs { display: flex; border-bottom: 1px solid #1a2a1a; flex-shrink: 0; }
.lp-tab { flex: 1; padding: 6px 0; font-family: 'Press Start 2P', monospace; font-size: 5px; text-align: center; color: #3a5a3a; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; border-bottom: 2px solid transparent; }
.lp-tab:hover { color: #6a8a6a; }
.lp-tab.active { color: #00ff88; border-bottom-color: #00ff88; background: rgba(0,255,136,0.03); }
.lp-content { flex: 1; overflow-y: auto; padding: 4px 0; }
.fmt-group { border-bottom: 1px solid #1a2a1a; }
.fmt-title { padding: 6px 10px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 10px; transition: background 0.2s; user-select: none; }
.fmt-title:hover { background: rgba(255,255,255,0.02); }
.arrow { font-size: 7px; color: #3a5a3a; transition: transform 0.2s; }
.arrow.collapsed { transform: rotate(-90deg); }
.dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.fmt-count { margin-left: auto; font-size: 9px; color: #3a5a3a; }
.fmt-items { padding: 2px 0; }
.fmt-item { padding: 3px 10px 3px 24px; font-size: 10px; color: #6a8a6a; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.15s; }
.fmt-item:hover { background: rgba(0,255,136,0.04); color: #d0ffd0; }
.fmt-item.active { background: rgba(0,255,136,0.08); color: #00ff88; border-right: 2px solid #00ff88; }
.layer-tag { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 1px 3px; border-radius: 1px; }
.layer-tag.core { background: rgba(0,255,136,0.15); color: #7cff6b; }
.layer-tag.effect { background: rgba(255,107,157,0.15); color: #ff6b9d; }
.layer-tag.arch { background: rgba(162,155,254,0.15); color: #a29bfe; }
.sp-section { padding: 8px 10px; border-bottom: 1px solid #1a2a1a; }
.sp-title { font-family: 'Press Start 2P', monospace; font-size: 6px; margin-bottom: 6px; letter-spacing: 1px; }
.sp-item { padding: 3px 0; font-size: 10px; display: flex; align-items: center; gap: 6px; }
.ws-card { margin: 6px 8px; padding: 8px; border: 1px solid #1a2a1a; border-radius: 3px; cursor: pointer; transition: all 0.2s; }
.ws-card:hover { border-color: #3a5a3a; }
.ws-card.active { border-color: #00ff88; background: rgba(0,255,136,0.04); }
.ws-tier { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; margin-bottom: 4px; }
.ws-name { font-size: 11px; color: #d0ffd0; margin-bottom: 2px; }
.ws-desc { font-size: 9px; color: #3a5a3a; margin-bottom: 4px; }
.ws-features { display: flex; gap: 6px; font-size: 8px; color: #3a5a3a; }
.ws-features .on { color: #00ff88; }
.center { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 300px; }
.toolbar { height: 36px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 10px; gap: 6px; flex-shrink: 0; }
.ct-tool { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 1px solid #1a2a1a; border-radius: 3px; cursor: pointer; transition: all 0.2s; font-size: 13px; color: #6a8a6a; }
.ct-tool:hover { border-color: #00ff88; color: #00ff88; }
.ct-tool.active { background: rgba(0,255,136,0.1); border-color: #00ff88; color: #00ff88; }
.ct-sep { width: 1px; height: 20px; background: #1a2a1a; margin: 0 4px; }
.ct-label { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; }
.ct-input { width: 50px; height: 22px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; text-align: center; }
.ct-input:focus { border-color: #00ff88; outline: none; }
.ct-val { font-size: 10px; color: #00ff88; min-width: 28px; }
.ct-select { height: 22px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; }
.canvas-area { flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; background: #050508; }
.canvas-area::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(0,255,136,0.015) 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; }
.canvas-area canvas { image-rendering: pixelated; image-rendering: crisp-edges; border: 1px solid #253525; box-shadow: 0 0 40px rgba(0,255,136,0.06), 0 0 80px rgba(0,0,0,0.4); cursor: crosshair; position: relative; z-index: 1; }
.right-panel { width: 260px; background: #0a0a12; border-left: 1px solid #1a2a1a; display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
.rp-tabs { display: flex; border-bottom: 1px solid #1a2a1a; flex-shrink: 0; }
.rp-tab { flex: 1; padding: 6px 0; font-family: 'Press Start 2P', monospace; font-size: 5px; text-align: center; color: #3a5a3a; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; border-bottom: 2px solid transparent; }
.rp-tab:hover { color: #6a8a6a; }
.rp-tab.active { color: #44ddff; border-bottom-color: #44ddff; background: rgba(68,221,255,0.03); }
.rp-content { flex: 1; overflow-y: auto; padding: 8px; }
.prop-section { margin-bottom: 10px; border: 1px solid #1a2a1a; border-radius: 3px; overflow: hidden; }
.prop-title { font-family: 'Press Start 2P', monospace; font-size: 6px; padding: 6px 8px; letter-spacing: 1px; background: #0f0f1a; }
.prop-body { padding: 6px 8px; border-top: 1px solid #1a2a1a; }
.prop-row { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.prop-label { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 0.5px; min-width: 55px; flex-shrink: 0; }
.prop-slider { flex: 1; -webkit-appearance: none; height: 3px; background: #1a2a1a; border-radius: 2px; outline: none; }
.prop-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 10px; background: #00ff88; border-radius: 50%; cursor: pointer; }
.prop-val { font-size: 10px; color: #00ff88; min-width: 28px; text-align: right; }
.prop-select { flex: 1; height: 20px; background: #050508; border: 1px solid #1a2a1a; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; padding: 0 4px; border-radius: 2px; }
.prop-color { width: 24px; height: 20px; border: 1px solid #1a2a1a; border-radius: 2px; cursor: pointer; padding: 0; }
.toggle { width: 32px; height: 16px; background: #1a2a1a; border-radius: 8px; cursor: pointer; position: relative; transition: background 0.2s; }
.toggle.on { background: rgba(0,255,136,0.3); }
.toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; background: #3a5a3a; border-radius: 50%; transition: all 0.2s; }
.toggle.on::after { left: 18px; background: #00ff88; }
.pipe-stage { display: flex; align-items: center; gap: 4px; padding: 3px 6px; border: 1px solid #1a2a1a; border-radius: 2px; font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; margin-bottom: 3px; }
.pipe-stage.active { border-color: #00ff88; color: #00ff88; background: rgba(0,255,136,0.06); }
.pipe-num { width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; background: #1a2a1a; border-radius: 50%; font-size: 6px; }
.pipe-stage.active .pipe-num { background: #00ff88; color: #050508; }
.pipe-arrow { text-align: center; color: #3a5a3a; font-size: 10px; margin: 2px 0; }
.statusbar { height: 22px; background: #0a0a12; border-top: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 12px; font-family: 'Press Start 2P', monospace; font-size: 5px; color: #3a5a3a; letter-spacing: 1px; gap: 14px; flex-shrink: 0; }
.indicator { width: 6px; height: 6px; border-radius: 50%; }
</style>
