<script setup lang="ts">
import { ref } from 'vue'
import { Globe, BookOpen, Download, Play } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import type { Language } from '../types'

const emit = defineEmits<{
  (e: 'export'): void
  (e: 'preview'): void
  (e: 'showTutorial'): void
}>()

const { t, locale } = useI18n()
const showLanguageMenu = ref(false)

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: t('english') },
  { code: 'zh', label: t('chinese') },
  { code: 'ja', label: t('japanese') },
  { code: 'ko', label: t('korean') }
]

const changeLanguage = (code: Language) => {
  locale.value = code
  showLanguageMenu.value = false
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <circle cx="12.5" cy="12.5" r="3.5"/>
          <path d="M16 8l4 4-2 2"/>
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800">{{ t('welcome') }}</h1>
    </div>
    
    <div class="flex items-center gap-4">
      <button 
        class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        @click="emit('showTutorial')"
      >
        <BookOpen class="w-5 h-5" />
        <span>{{ t('tutorial') }}</span>
      </button>
      
      <div class="relative">
        <button 
          class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors language-selector"
          @click="showLanguageMenu = !showLanguageMenu"
        >
          <Globe class="w-5 h-5" />
          <span>{{ languages.find(l => l.code === locale)?.label }}</span>
        </button>
        
        <div 
          v-if="showLanguageMenu"
          class="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            class="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-600': lang.code === locale }"
            @click="changeLanguage(lang.code)"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>
      
      <button 
        class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        @click="emit('preview')"
      >
        <Play class="w-5 h-5" />
        <span>{{ t('preview') }}</span>
      </button>
      
      <button 
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        @click="emit('export')"
      >
        <Download class="w-5 h-5" />
        <span>{{ t('export') }}</span>
      </button>
    </div>
  </header>
</template>