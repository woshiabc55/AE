<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import ShapeToolbar from './components/ShapeToolbar.vue'
import Canvas from './components/Canvas.vue'
import AnimationPanel from './components/AnimationPanel.vue'
import PropertiesPanel from './components/PropertiesPanel.vue'
import TutorialModal from './components/TutorialModal.vue'
import type { Shape, Animation } from './types'
import { generateFullSVG } from './utils/svgUtils'

const shapes = ref<Shape[]>([])
const animations = ref<Animation[]>([])
const selectedShapeId = ref<string | null>(null)
const showTutorial = ref(false)
const canvasRef = ref<InstanceType<typeof Canvas> | null>(null)

const handleShapeAdded = (shape: Shape) => {
  shapes.value.push(shape)
  selectedShapeId.value = shape.id
}

const handleSelectShape = (shapeType: string) => {
  canvasRef.value?.handleToolChange(shapeType)
}

const handleUpdateShape = (updatedShape: Shape) => {
  const index = shapes.value.findIndex(s => s.id === updatedShape.id)
  if (index !== -1) {
    shapes.value[index] = updatedShape
  }
}

const handleDeleteShape = (id: string) => {
  shapes.value = shapes.value.filter(s => s.id !== id)
  animations.value = animations.value.filter(a => a.shapeId !== id)
  if (selectedShapeId.value === id) {
    selectedShapeId.value = null
  }
}

const handleAddAnimation = (animation: Animation) => {
  animations.value.push(animation)
}

const handleRemoveAnimation = (id: string) => {
  animations.value = animations.value.filter(a => a.id !== id)
}

const handleExport = () => {
  const svgContent = generateFullSVG(shapes.value, animations.value)
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'animation.svg'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handlePreview = () => {
  const svgContent = generateFullSVG(shapes.value, animations.value)
  const previewWindow = window.open('', '_blank')
  if (previewWindow) {
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SVG Preview</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; }
          svg { max-width: 100%; max-height: 100%; }
        </style>
      </head>
      <body>${svgContent}</body>
      </html>
    `)
    previewWindow.document.close()
  }
}

const handleShowTutorial = () => {
  showTutorial.value = true
}

const handleCloseTutorial = () => {
  showTutorial.value = false
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <Header 
      @export="handleExport"
      @preview="handlePreview"
      @showTutorial="handleShowTutorial"
    />
    
    <div class="flex-1 flex overflow-hidden p-4 gap-4">
      <div class="w-64 flex flex-col gap-4 overflow-y-auto">
        <ShapeToolbar @selectShape="handleSelectShape" />
        <AnimationPanel 
          :shapes="shapes"
          :animations="animations"
          @addAnimation="handleAddAnimation"
          @removeAnimation="handleRemoveAnimation"
        />
      </div>
      
      <div class="flex-1 flex flex-col">
        <Canvas 
          ref="canvasRef"
          :shapes="shapes"
          :animations="animations"
          @shapeAdded="handleShapeAdded"
        />
      </div>
      
      <div class="w-72 overflow-y-auto">
        <PropertiesPanel 
          :shapes="shapes"
          :selectedShapeId="selectedShapeId"
          @updateShape="handleUpdateShape"
          @deleteShape="handleDeleteShape"
        />
      </div>
    </div>
    
    <TutorialModal 
      :show="showTutorial"
      @close="handleCloseTutorial"
    />
  </div>
</template>