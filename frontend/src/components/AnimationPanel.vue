<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Shape, Animation } from '../types'

const props = defineProps<{
  shapes: Shape[]
  animations: Animation[]
}>()

const emit = defineEmits<{
  (e: 'addAnimation', animation: Animation): void
  (e: 'removeAnimation', id: string): void
}>()

const { t } = useI18n()

const selectedShapeId = ref('')
const animationType = ref<'translate' | 'rotate' | 'scale' | 'opacity'>('translate')
const duration = ref(3)
const startValue = ref('')
const endValue = ref('')

const animationTypes = [
  { value: 'translate', label: t('translate') },
  { value: 'rotate', label: t('rotate') },
  { value: 'scale', label: t('scale') },
  { value: 'opacity', label: t('opacity') }
]

const selectedShapeAnimations = computed(() => {
  if (!selectedShapeId.value) return []
  return props.animations.filter(a => a.shapeId === selectedShapeId.value)
})

const addAnimation = () => {
  if (!selectedShapeId.value || !startValue.value || !endValue.value) return
  
  const newAnimation: Animation = {
    id: `anim_${Date.now()}`,
    shapeId: selectedShapeId.value,
    type: animationType.value,
    duration: duration.value,
    startValue: startValue.value,
    endValue: endValue.value
  }
  
  emit('addAnimation', newAnimation)
  startValue.value = ''
  endValue.value = ''
}

const removeAnimation = (id: string) => {
  emit('removeAnimation', id)
}
</script>

<template>
  <div class="panel p-4">
    <h3 class="text-sm font-semibold text-gray-700 mb-3">{{ t('animations') }}</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('selectShape') }}</label>
        <select 
          v-model="selectedShapeId"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{{ t('selectShape') }}</option>
          <option v-for="shape in shapes" :key="shape.id" :value="shape.id">
            {{ shape.type }} - {{ shape.id.slice(-8) }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('animationType') }}</label>
        <select 
          v-model="animationType"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="type in animationTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('animationDuration') }}</label>
        <input 
          v-model.number="duration"
          type="range" 
          min="1" 
          max="10" 
          class="w-full"
        />
        <span class="text-xs text-gray-400">{{ duration }}s</span>
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('startValue') }}</label>
        <input 
          v-model="startValue"
          type="text" 
          :placeholder="animationType === 'translate' ? '0,0' : animationType === 'opacity' ? '1' : '1'"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label class="block text-xs text-gray-500 mb-1">{{ t('endValue') }}</label>
        <input 
          v-model="endValue"
          type="text" 
          :placeholder="animationType === 'translate' ? '100,100' : animationType === 'opacity' ? '0' : '2'"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button 
        class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        @click="addAnimation"
      >
        <Plus class="w-4 h-4" />
        <span>{{ t('addAnimation') }}</span>
      </button>
      
      <div v-if="selectedShapeAnimations.length > 0" class="space-y-2">
        <h4 class="text-xs font-medium text-gray-600">{{ t('currentAnimations') }}</h4>
        <div 
          v-for="anim in selectedShapeAnimations" 
          :key="anim.id"
          class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
        >
          <div class="text-xs text-gray-600">
            {{ animationTypes.find(t => t.value === anim.type)?.label }} - {{ anim.duration }}s
          </div>
          <button 
            class="text-red-500 hover:text-red-600"
            @click="removeAnimation(anim.id)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>