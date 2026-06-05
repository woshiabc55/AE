<script setup lang="ts">
import CopyButton from './CopyButton.vue'
import PromptHighlighter from './PromptHighlighter.vue'

defineProps<{ prompt: string; color: string; title: string; keywords: string[] }>()
</script>

<template>
  <div class="prompt-card" :style="{ '--c': color }">
    <div class="prompt-card-head">
      <div class="prompt-card-title">
        <span class="serif" style="color: var(--c-bronze-glow); font-size:13px; letter-spacing:.1em;">AI PROMPT</span>
        <span class="display prompt-card-shot" style="font-size:14px; color:#E8E1D4; margin-left:10px;">{{ title }}</span>
      </div>
      <CopyButton :text="prompt" label="Copy Prompt" />
    </div>
    <div class="prompt-card-keywords">
      <span v-for="k in keywords" :key="k" class="kw-chip mono">{{ k }}</span>
    </div>
    <PromptHighlighter :prompt="prompt" :color="color" />
  </div>
</template>

<style scoped>
.prompt-card {
  background: linear-gradient(180deg, #0F0F14 0%, #0A0A0E 100%);
  border: 1px solid color-mix(in srgb, var(--c) 30%, var(--c-line));
  position: relative;
  overflow: hidden;
}
.prompt-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c), transparent);
  opacity: 0.6;
}
.prompt-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.4));
  pointer-events: none;
}
.prompt-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  position: relative;
  z-index: 1;
}
.prompt-card-title { display: flex; align-items: center; gap: 8px; }
.prompt-card-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  position: relative;
  z-index: 1;
}
.kw-chip {
  padding: 3px 8px;
  background: color-mix(in srgb, var(--c) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 25%, transparent);
  color: color-mix(in srgb, var(--c) 75%, white);
  font-size: 10px;
  letter-spacing: 0.08em;
  border-radius: 2px;
}
</style>
