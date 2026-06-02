<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Tutorial, TutorialStep } from '../types'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()

const tutorials = ref<Tutorial[]>([])
const currentTutorialIndex = ref(0)
const currentStepIndex = ref(0)
const previewCode = ref('')

const currentTutorial = ref<Tutorial | null>(null)
const currentStep = ref<TutorialStep | null>(null)

const loadTutorials = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/tutorial', {
      headers: { 'Accept-Language': (localStorage.getItem('lang') || 'en') }
    })
    const data = await response.json()
    if (data.success) {
      tutorials.value = data.data
      if (tutorials.value.length > 0) {
        currentTutorial.value = tutorials.value[0]
        currentStep.value = tutorials.value[0].steps[0]
      }
    }
  } catch (error) {
    console.error('Failed to load tutorials:', error)
  }
}

const selectTutorial = (index: number) => {
  currentTutorialIndex.value = index
  currentTutorial.value = tutorials.value[index]
  currentStepIndex.value = 0
  currentStep.value = tutorials.value[index].steps[0]
}

const nextStep = () => {
  if (!currentTutorial.value) return
  if (currentStepIndex.value < currentTutorial.value.steps.length - 1) {
    currentStepIndex.value++
    currentStep.value = currentTutorial.value.steps[currentStepIndex.value]
  }
}

const prevStep = () => {
  if (!currentTutorial.value) return
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    currentStep.value = currentTutorial.value.steps[currentStepIndex.value]
  }
}

const runCode = () => {
  if (currentStep.value) {
    previewCode.value = currentStep.value.code
  }
}

onMounted(() => {
  loadTutorials()
})
</script>

<template>
  <div 
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">{{ t('tutorials') }}</h2>
        <button 
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          @click="emit('close')"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div class="flex">
        <div class="w-48 border-r border-gray-200 p-4 overflow-y-auto">
          <div 
            v-for="(tutorial, index) in tutorials" 
            :key="tutorial.id"
            class="cursor-pointer p-3 rounded-lg mb-2 transition-colors"
            :class="{ 'bg-blue-50 border border-blue-200': index === currentTutorialIndex, 'hover:bg-gray-50': index !== currentTutorialIndex }"
            @click="selectTutorial(index)"
          >
            <h3 class="text-sm font-medium text-gray-800">{{ tutorial.title }}</h3>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ tutorial.description }}</p>
          </div>
        </div>
        
        <div class="flex-1 p-6 overflow-y-auto">
          <div v-if="currentStep" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ currentStep.title }}</h3>
              <p class="text-gray-600">{{ currentStep.content }}</p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">{{ t('codeExample') }}</h4>
              <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{{ currentStep.code }}</pre>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">{{ t('preview') }}</h4>
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[150px]">
                <svg 
                  v-if="previewCode" 
                  width="100%" 
                  height="150" 
                  viewBox="0 0 200 150"
                  class="w-full h-full"
                  v-html="<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'>" + previewCode + "</svg>"
                />
                <p v-else class="text-gray-400 text-center pt-8">{{ t('runCode') }}</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4">
              <button 
                class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentStepIndex === 0"
                @click="prevStep"
              >
                <ChevronLeft class="w-5 h-5" />
                <span>{{ t('prevStep') }}</span>
              </button>
              
              <button 
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                @click="runCode"
              >
                <Play class="w-5 h-5" />
                <span>{{ t('runCode') }}</span>
              </button>
              
              <button 
                class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="currentStepIndex === (currentTutorial?.steps.length || 1) - 1"
                @click="nextStep"
              >
                <span>{{ t('nextStep') }}</span>
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-16 text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <book-open class="w-full h-full" />
            </svg>
            <p>{{ t('selectShape') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>