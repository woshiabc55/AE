<script setup lang="ts">
import { Rectangle, Circle, Minus, Triangle, PenTool } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'selectShape', shapeType: string): void
}>()

const { t } = useI18n()

const shapes = [
  { type: 'rect', icon: Rectangle, label: t('rectangle') },
  { type: 'circle', icon: Circle, label: t('circle') },
  { type: 'line', icon: Minus, label: t('line') },
  { type: 'polygon', icon: Triangle, label: t('polygon') },
  { type: 'path', icon: PenTool, label: t('path') }
]
</script>

<template>
  <div class="panel p-4">
    <h3 class="text-sm font-semibold text-gray-700 mb-3">{{ t('shapes') }}</h3>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="shape in shapes"
        :key="shape.type"
        class="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors shape-tool"
        @click="emit('selectShape', shape.type)"
      >
        <component :is="shape.icon" class="w-6 h-6 text-gray-600" />
        <span class="text-xs text-gray-600">{{ shape.label }}</span>
      </button>
    </div>
  </div>
</template>