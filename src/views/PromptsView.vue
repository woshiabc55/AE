<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStoryboardStore } from '@/stores/storyboard'
import CopyButton from '@/components/CopyButton.vue'

const store = useStoryboardStore()
const open = ref<string[]>(['one'])
const allPrompts = computed(() => store.shots.map((s) => s.prompt).join('\n\n---\n\n'))

function toggle(id: string) {
  if (open.value.includes(id)) open.value = open.value.filter((x) => x !== id)
  else open.value.push(id)
}

function expandAll() { open.value = store.shots.map((s) => s.id) }
function collapseAll() { open.value = [] }

function keywordsFor(prompt: string) {
  return Array.from(new Set(prompt.match(/[A-Z][a-zA-Z]+/g)?.slice(0, 10) || [])).filter((w) => w.length > 3)
}
</script>

<template>
  <div class="prompts">
    <header class="head fade-up">
      <div class="head-meta mono">PROMPT LIBRARY · 4 SHOTS</div>
      <h1 class="head-title display">AI 提示词库</h1>
      <p class="head-sub serif">为 Runway / Pika / Sora 准备的电影级英文提示词，含关键词 chip 与一键复制。</p>
      <div class="head-actions">
        <button class="btn btn-ghost" @click="expandAll">全部展开</button>
        <button class="btn btn-ghost" @click="collapseAll">全部折叠</button>
        <CopyButton :text="allPrompts" label="Copy All" />
      </div>
    </header>

    <div class="prompt-list">
      <article
        v-for="shot in store.shots"
        :key="shot.id"
        class="prompt-block"
        :class="{ open: open.includes(shot.id) }"
        :style="{ '--c': shot.color }"
      >
        <button class="prompt-block-head" @click="toggle(shot.id)" :aria-expanded="open.includes(shot.id)">
          <div class="prompt-block-num display">0{{ shot.index === '一' ? 1 : shot.index === '二' ? 2 : shot.index === '三' ? 3 : 4 }}</div>
          <div class="prompt-block-info">
            <div class="prompt-block-title">
              <span class="serif" style="font-size:18px; color:#E8E1D4;">分镜{{ shot.index }} · {{ shot.title }}</span>
              <span class="mono" style="font-size:10px; color:var(--c); letter-spacing:.18em; margin-left:12px;">{{ shot.timeLabel }}</span>
            </div>
            <div class="prompt-block-tags">
              <span v-for="k in keywordsFor(shot.prompt).slice(0, 5)" :key="k" class="kw-chip mono">{{ k }}</span>
            </div>
          </div>
          <div class="prompt-block-actions">
            <CopyButton :text="shot.prompt" label="Copy" @click.stop />
            <span class="chevron" :class="{ open: open.includes(shot.id) }" aria-hidden="true">▾</span>
          </div>
        </button>
        <div class="prompt-block-body" v-show="open.includes(shot.id)">
          <pre class="prompt-block-text mono">{{ shot.prompt }}</pre>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.prompts { display: flex; flex-direction: column; gap: var(--s-7); }

.head { border-bottom: 1px solid var(--c-line); padding-bottom: var(--s-5); }
.head-meta { font-size: 11px; letter-spacing: 0.2em; color: var(--c-ash); margin-bottom: var(--s-3); }
.head-title {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  color: var(--c-bronze-glow);
  margin: 0 0 var(--s-3);
  letter-spacing: 0.04em;
  text-shadow: 0 0 32px rgba(224, 168, 46, 0.25);
}
.head-sub { font-size: 16px; color: #C8BFAE; margin: 0 0 var(--s-4); max-width: 720px; }
.head-actions { display: flex; gap: var(--s-3); align-items: center; }
.btn {
  padding: 8px 16px;
  border: 1px solid var(--c-line-strong);
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: transparent;
  color: var(--c-bronze);
  transition: all var(--t-fast);
}
.btn-ghost:hover { color: var(--c-bronze-glow); border-color: var(--c-bronze-glow); }

.prompt-list { display: flex; flex-direction: column; gap: var(--s-3); }
.prompt-block {
  background: linear-gradient(180deg, #0F0F14, #0A0A0E);
  border: 1px solid color-mix(in srgb, var(--c) 25%, var(--c-line));
  transition: border-color var(--t-fast), box-shadow var(--t-med);
}
.prompt-block.open {
  border-color: color-mix(in srgb, var(--c) 55%, transparent);
  box-shadow: 0 0 32px color-mix(in srgb, var(--c) 15%, transparent);
}
.prompt-block-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--s-4);
  padding: var(--s-4) var(--s-5);
  background: transparent;
  border: 0;
  text-align: left;
  color: inherit;
  cursor: pointer;
}
.prompt-block-num {
  font-size: 32px;
  color: var(--c);
  font-weight: 700;
  letter-spacing: 0.04em;
  flex: 0 0 auto;
  text-shadow: 0 0 16px color-mix(in srgb, var(--c) 50%, transparent);
}
.prompt-block-info { flex: 1; min-width: 0; }
.prompt-block-title { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px; }
.prompt-block-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
.kw-chip {
  padding: 2px 7px;
  background: color-mix(in srgb, var(--c) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 25%, transparent);
  color: color-mix(in srgb, var(--c) 75%, white);
  font-size: 9px;
  letter-spacing: 0.08em;
  border-radius: 2px;
}
.prompt-block-actions { display: flex; align-items: center; gap: var(--s-3); }
.chevron {
  font-size: 14px;
  color: var(--c-ash);
  transition: transform var(--t-med), color var(--t-fast);
}
.chevron.open { transform: rotate(180deg); color: var(--c); }

.prompt-block-body {
  border-top: 1px solid rgba(255,255,255,0.05);
  padding: var(--s-4) var(--s-5);
  background: rgba(0,0,0,0.25);
}
.prompt-block-text {
  margin: 0;
  font-family: var(--f-mono);
  font-size: 13px;
  line-height: 1.75;
  color: #D6CFBD;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 480px;
  overflow-y: auto;
}
</style>
