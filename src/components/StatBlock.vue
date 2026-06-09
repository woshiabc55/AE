<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  value: number
  label: string
  duration?: number
}>()

const display = ref(0)

function animateTo(target: number) {
  const start = performance.now()
  const duration = props.duration ?? 1100
  const from = display.value
  function frame(t: number) {
    const p = Math.min(1, (t - start) / duration)
    const eased = 1 - Math.pow(1 - p, 3)
    display.value = Math.round(from + (target - from) * eased)
    if (p < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

onMounted(() => animateTo(props.value))
watch(() => props.value, (v) => animateTo(v))

const pad = computed(() => String(display.value).padStart(3, '0'))
</script>

<template>
  <div class="flex flex-col">
    <span class="display-num text-[3rem] md:text-[4.5rem] leading-none">{{ pad }}</span>
    <span class="issue-num text-[var(--muted)] mt-2">{{ label }}</span>
  </div>
</template>
