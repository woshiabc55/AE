<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ text: string; label?: string }>()
const copied = ref(false)
let timer: number | null = null

async function copy() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = props.text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => (copied.value = false), 1500)
  } catch (e) {
    console.warn('Copy failed', e)
  }
}
</script>

<template>
  <button class="copy-btn" :class="{ copied }" @click="copy" :aria-label="(label || '复制') + '提示词'">
    <span class="dot" aria-hidden="true"></span>
    <span class="label">{{ copied ? '已复制' : (label || '复制') }}</span>
    <span class="check" v-if="copied" aria-hidden="true">✓</span>
  </button>
</template>

<style scoped>
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  background: rgba(176, 141, 87, 0.08);
  color: var(--c-bronze);
  border: 1px solid var(--c-line-strong);
  border-radius: 2px;
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all var(--t-fast);
  position: relative;
  overflow: hidden;
}
.copy-btn:hover {
  background: rgba(176, 141, 87, 0.18);
  color: var(--c-bronze-glow);
  transform: translateY(-1px);
}
.copy-btn.copied {
  background: rgba(63, 184, 175, 0.18);
  border-color: var(--c-spark);
  color: var(--c-spark-bright);
  transform: scale(1.04);
}
.dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  display: inline-block;
}
.check {
  font-size: 12px;
  font-weight: 700;
}
.label { line-height: 1; }
</style>
