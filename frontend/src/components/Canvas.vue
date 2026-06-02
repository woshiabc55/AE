<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Shape, Animation } from '../types'
import { generateFullSVG } from '../utils/svgUtils'

const props = defineProps<{
  shapes: Shape[]
  animations: Animation[]
}>()

const emit = defineEmits<{
  (e: 'shapeAdded', shape: Shape): void
}>()

const canvasRef = ref<HTMLDivElement | null>(null)
const isDrawing = ref(false)
const startPos = ref({ x: 0, y: 0 })
const currentShape = ref<Shape | null>(null)
const selectedTool = ref<string>('')

const svgContent = computed(() => {
  return generateFullSVG(props.shapes, props.animations)
})

const handleMouseDown = (e: MouseEvent) => {
  if (!selectedTool.value || selectedTool.value === 'select') return
  
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  isDrawing.value = true
  startPos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  
  currentShape.value = {
    id: `shape_${Date.now()}`,
    type: selectedTool.value as Shape['type'],
    x: startPos.value.x,
    y: startPos.value.y,
    width: 50,
    height: 50,
    radius: 25,
    fill: '#3b82f6',
    stroke: '#1d4ed8',
    strokeWidth: 2,
    opacity: 1
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDrawing.value || !currentShape.value) return
  
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top
  
  currentShape.value.width = Math.abs(currentX - startPos.value.x)
  currentShape.value.height = Math.abs(currentY - startPos.value.y)
  
  if (currentX < startPos.value.x) {
    currentShape.value.x = currentX
  }
  if (currentY < startPos.value.y) {
    currentShape.value.y = currentY
  }
}

const handleMouseUp = () => {
  if (isDrawing.value && currentShape.value) {
    if (currentShape.value.width && currentShape.value.height && 
        currentShape.value.width > 5 && currentShape.value.height > 5) {
      emit('shapeAdded', { ...currentShape.value })
    }
  }
  
  isDrawing.value = false
  currentShape.value = null
}

const handleToolChange = (tool: string) => {
  selectedTool.value = tool
}

defineExpose({ handleToolChange })
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 relative bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div 
        ref="canvasRef"
        class="w-full h-full svg-canvas"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          class="w-full h-full"
          v-html="svgContent"
        />
        
        <svg 
          v-if="currentShape"
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          class="absolute top-0 left-0 pointer-events-none"
        >
          <template v-if="currentShape.type === 'rect'">
            <rect 
              :x="currentShape.x" 
              :y="currentShape.y" 
              :width="currentShape.width" 
              :height="currentShape.height"
              fill="rgba(59, 130, 246, 0.5)"
              stroke="#3b82f6"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
          </template>
          <template v-else-if="currentShape.type === 'circle'">
            <circle 
              :cx="currentShape.x + (currentShape.width || 0) / 2" 
              :cy="currentShape.y + (currentShape.height || 0) / 2" 
              :r="Math.min(currentShape.width || 0, currentShape.height || 0) / 2"
              fill="rgba(59, 130, 246, 0.5)"
              stroke="#3b82f6"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
          </template>
          <template v-else-if="currentShape.type === 'line'">
            <line 
              :x1="startPos.x" 
              :y1="startPos.y" 
              :x2="currentShape.x + currentShape.width" 
              :y2="currentShape.y + currentShape.height"
              stroke="#3b82f6"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
          </template>
          <template v-else-if="currentShape.type === 'polygon'">
            <polygon 
              :points="`${currentShape.x},${currentShape.y} ${currentShape.x + currentShape.width},${currentShape.y} ${currentShape.x + currentShape.width / 2},${currentShape.y + currentShape.height}`"
              fill="rgba(59, 130, 246, 0.5)"
              stroke="#3b82f6"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
          </template>
        </svg>
      </div>
    </div>
  </div>
</template>