<script setup lang="ts">
import { useTheme, type ThemeName } from '@/composables/useTheme'
import { Sun, Moon, Coffee, Sparkles } from 'lucide-vue-next'
import { computed } from 'vue'

const { theme, setTheme } = useTheme()

const options: { value: ThemeName; icon: any; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'cream', icon: Coffee, label: 'Cream' }
]

const current = computed(() => options.find((o) => o.value === theme.value))
</script>

<template>
  <div class="inline-flex items-center gap-1 border border-line">
    <button
      v-for="opt in options"
      :key="opt.value"
      :title="opt.label"
      :aria-label="opt.label"
      class="w-8 h-8 grid place-items-center transition-colors"
      :class="theme === opt.value ? 'bg-[var(--ink)] text-[var(--paper)]' : 'bg-transparent text-[var(--ink)] hover:bg-[var(--bg-soft)]'"
      @click="setTheme(opt.value)"
    >
      <component :is="opt.icon" :size="14" />
    </button>
    <span class="px-2 mono text-[0.65rem] tracking-[0.2em] uppercase border-l border-line hidden md:inline-flex items-center gap-1">
      <Sparkles :size="12" />
      {{ current?.label }}
    </span>
  </div>
</template>
