<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Shape } from '../types'

const props = defineProps<{
  shapes: Shape[]
  selectedShapeId: string | null
}>()

const emit = defineEmits<{
  (e: 'updateShape', shape: Shape): void
  (e: 'deleteShape', id: string): void
}>()

const { t } = useI18n()

const selectedShape = computed(() => {
  return props.shapes.find(s => s.id === props.selectedShapeId)
})

const updateProperty = (key: keyof Shape, value: number | string) => {
  if (!selectedShape.value) return
  
  const updatedShape = { ...selectedShape.value, [key]: value }
  emit('updateShape', updatedShape)
}

const deleteShape = () => {
  if (!selectedShape.value) return
  emit('deleteShape', selectedShape.value.id)
}
</script>

<template>
  <div class="panel p-4">
    <h3 class="text-sm font-semibold text-gray-700 mb-3">{{ t('properties') }}</h3>
    
    <div v-if="selectedShape" class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">{{ selectedShape.type }}</span>
        <button 
          class="text-xs text-red-500 hover:text-red-600 px-2 py-1 bg-red-50 rounded"
          @click="deleteShape"
        >
          {{ t('delete') }}
        </button>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('fillColor') }}</label>
        <input 
          type="color" 
          :value="selectedShape.fill"
          @input="updateProperty('fill', ($event.target as HTMLInputElement).value)"
          class="w-full"
        />
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('strokeColor') }}</label>
        <input 
          type="color" 
          :value="selectedShape.stroke"
          @input="updateProperty('stroke', ($event.target as HTMLInputElement).value)"
          class="w-full"
        />
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('strokeWidth') }}</label>
        <input 
          type="range" 
          min="0" 
          max="10" 
          :value="selectedShape.strokeWidth"
          @input="updateProperty('strokeWidth', Number(($event.target as HTMLInputElement).value))"
          class="w-full"
        />
        <span class="text-xs text-gray-400">{{ selectedShape.strokeWidth }}px</span>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('opacity') }}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          :value="selectedShape.opacity"
          @input="updateProperty('opacity', Number(($event.target as HTMLInputElement).value))"
          class="w-full"
        />
        <span class="text-xs text-gray-400">{{ selectedShape.opacity }}</span>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('x') }}</label>
        <input 
          type="number" 
          :value="selectedShape.x"
          @input="updateProperty('x', Number(($event.target as HTMLInputElement).value))"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('y') }}</label>
        <input 
          type="number" 
          :value="selectedShape.y"
          @input="updateProperty('y', Number(($event.target as HTMLInputElement).value))"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div v-if="selectedShape.width !== undefined">
        <label class="block text-xs text-gray-500 mb-1">{{ t('width') }}</label>
        <input 
          type="number" 
          :value="selectedShape.width"
          @input="updateProperty('width', Number(($event.target as HTMLInputElement).value))"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div v-if="selectedShape.height !== undefined">
        <label class="block text-xs text-gray-500 mb-1">{{ t('height') }}</label>
        <input 
          type="number" 
          :value="selectedShape.height"
          @input="updateProperty('height', Number(($event.target as HTMLInputElement).value))"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div v-if="selectedShape.radius !== undefined">
        <label class="block text-xs text-gray-500 mb-1">{{ t('radius') }}</label>
        <input 
          type="number" 
          :value="selectedShape.radius"
          @input="updateProperty('radius', Number(($event.target as HTMLInputElement).value))"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    
    <div v-else class="text-center py-8 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="7" height="7"/>
        <circle cx="12.5" cy="12.5" r="3.5"/>
      </svg>
      <p class="text-xs">{{ t('selectShape') }}</p>
    </div>
  </div>
</template>