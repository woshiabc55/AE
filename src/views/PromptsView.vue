<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStoryboardStore } from '@/stores/storyboard'
import CopyButton from '@/components/CopyButton.vue'

const store = useStoryboardStore()
const open = ref<string[]>(['one'])
const allPrompts = computed(() => store.shots.map((s) => s.prompt).join('\n\n---\n\n'))

const search = ref('')
const activeFilter = ref<string | null>(null)

function toggle(id: string) {
  if (open.value.includes(id)) open.value = open.value.filter((x) => x !== id)
  else open.value.push(id)
}
function expandAll() { open.value = store.shots.map((s) => s.id) }
function collapseAll() { open.value = [] }

function keywordsFor(prompt: string) {
  return Array.from(new Set(prompt.match(/[A-Z][a-zA-Z]+/g)?.slice(0, 10) || [])).filter((w) => w.length > 3)
}

// 全局关键词云
const allKeywords = computed(() => {
  const map = new Map<string, number>()
  for (const s of store.shots) {
    for (const k of keywordsFor(s.prompt)) {
      map.set(k, (map.get(k) || 0) + 1)
    }
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
})

function filterByKeyword(k: string) {
  activeFilter.value = activeFilter.value === k ? null : k
  if (activeFilter.value && !open.value.includes('__filter__')) {
    // 让所有匹配的卡片展开以便查看
  }
}

const filteredShots = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.shots.filter((s) => {
    const matchKw = !activeFilter.value || keywordsFor(s.prompt).includes(activeFilter.value)
    if (!matchKw) return false
    if (!q) return true
    return (
      s.title.toLowerCase().includes(q) ||
      s.prompt.toLowerCase().includes(q) ||
      s.bus.toLowerCase().includes(q)
    )
  })
})
</script>

<template>
  <div class="prompts">
    <header class="head fade-up">
      <div class="head-meta mono">PROMPT LIBRARY · 4 SHOTS · FULL-TEXT SEARCH</div>
      <h1 class="head-title display">AI 提示词库</h1>
      <p class="head-sub serif">为 Runway / Pika / Sora 准备的电影级英文提示词，支持全文搜索、关键词过滤、一键复制。</p>
      <div class="head-actions">
        <div class="search-wrap">
          <span class="search-icon" aria-hidden="true">⌕</span>
          <input
            v-model="search"
            class="search-input"
            type="text"
            placeholder="搜索分镜 / 提示词 / 总线..."
            aria-label="搜索提示词"
          />
          <button v-if="search" class="search-clear" @click="search = ''" aria-label="清除搜索">✕</button>
        </div>
        <button class="btn btn-ghost" @click="expandAll">全部展开</button>
        <button class="btn btn-ghost" @click="collapseAll">全部折叠</button>
        <CopyButton :text="allPrompts" label="Copy All" />
      </div>
    </header>

    <section v-if="allKeywords.length" class="cloud-section fade-up delay-1">
      <div class="section-head">
        <span class="section-mark display">I</span>
        <h2 class="section-title serif">关键词云 · Keyword Cloud</h2>
        <span class="section-note muted">点击过滤 · 高频词按权重放大</span>
      </div>
      <div class="cloud">
        <button
          v-for="[k, c] in allKeywords"
          :key="k"
          class="cloud-chip"
          :class="{ on: activeFilter === k }"
          :style="{ fontSize: (11 + c * 2) + 'px' }"
          @click="filterByKeyword(k)"
        >
          {{ k }}
          <span class="cloud-count mono">{{ c }}</span>
        </button>
        <button v-if="activeFilter" class="cloud-chip cloud-clear" @click="activeFilter = null">
          ✕ 清除过滤
        </button>
      </div>
    </section>

    <div class="prompt-list">
      <transition-group name="prompt-list" tag="div" class="prompt-list-inner">
        <article
          v-for="shot in filteredShots"
          :key="shot.id"
          class="prompt-block"
          :class="{ open: open.includes(shot.id) }"
          :style="{ '--c': shot.color }"
        >
          <button class="prompt-block-head" @click="toggle(shot.id)" :aria-expanded="open.includes(shot.id)">
            <div class="prompt-block-num display">0{{ ['一','二','三','四'].indexOf(shot.index) + 1 }}</div>
            <div class="prompt-block-info">
              <div class="prompt-block-title">
                <span class="serif" style="font-size:18px; color:#E8E1D4;">分镜{{ shot.index }} · {{ shot.title }}</span>
                <span class="mono" style="font-size:10px; color:var(--c); letter-spacing:.18em; margin-left:12px;">{{ shot.timeLabel }}</span>
              </div>
              <div class="prompt-block-tags">
                <span
                  v-for="k in keywordsFor(shot.prompt).slice(0, 5)"
                  :key="k"
                  class="kw-chip mono"
                  :class="{ highlight: activeFilter === k }"
                >{{ k }}</span>
              </div>
            </div>
            <div class="prompt-block-actions">
              <CopyButton :text="shot.prompt" label="Copy" @click.stop />
              <span class="chevron" :class="{ open: open.includes(shot.id) }" aria-hidden="true">▾</span>
            </div>
          </button>
          <div class="prompt-block-body" v-show="open.includes(shot.id)">
            <pre class="prompt-block-text mono" v-text="shot.prompt"></pre>
          </div>
        </article>
      </transition-group>
      <div v-if="!filteredShots.length" class="empty">
        <span class="mono">NO RESULTS · 试着清除搜索或过滤</span>
      </div>
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
.head-actions { display: flex; gap: var(--s-3); align-items: center; flex-wrap: wrap; }

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--c-ink-2);
  border: 1px solid var(--c-line-strong);
  padding: 0 12px;
  height: 36px;
  width: 320px;
  max-width: 100%;
  transition: border-color var(--t-fast);
}
.search-wrap:focus-within { border-color: var(--c-bronze); box-shadow: 0 0 0 1px var(--c-bronze); }
.search-icon { color: var(--c-ash); font-size: 14px; margin-right: 6px; }
.search-input {
  flex: 1;
  background: transparent;
  border: 0;
  outline: 0;
  color: #E8E1D4;
  font-family: var(--f-sans);
  font-size: 13px;
  height: 100%;
}
.search-input::placeholder { color: var(--c-ash); }
.search-clear {
  background: transparent;
  border: 0;
  color: var(--c-ash);
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
}
.search-clear:hover { color: var(--c-blood); }

.btn {
  padding: 8px 16px;
  border: 1px solid var(--c-line-strong);
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: transparent;
  color: var(--c-bronze);
  cursor: pointer;
  transition: all var(--t-fast);
}
.btn-ghost:hover { color: var(--c-bronze-glow); border-color: var(--c-bronze-glow); }

.section { display: flex; flex-direction: column; gap: var(--s-4); }
.section-head { display: flex; align-items: baseline; gap: var(--s-4); border-bottom: 1px solid var(--c-line); padding-bottom: var(--s-3); }
.section-mark { font-size: 24px; color: var(--c-blood); }
.section-title { font-size: 20px; margin: 0; color: #E8E1D4; letter-spacing: 0.05em; }
.section-note { font-size: 11px; letter-spacing: 0.16em; }

.cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: var(--s-3);
  background: var(--c-ink-2);
  border: 1px solid var(--c-line);
}
.cloud-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(176, 141, 87, 0.06);
  border: 1px solid var(--c-line);
  color: #C8BFAE;
  font-family: var(--f-mono);
  border-radius: 2px;
  cursor: pointer;
  transition: all var(--t-fast);
}
.cloud-chip:hover { color: var(--c-bronze-glow); border-color: var(--c-bronze); }
.cloud-chip.on {
  background: var(--c-bronze);
  color: var(--c-ink);
  border-color: var(--c-bronze);
  font-weight: 600;
}
.cloud-count {
  font-size: 9px;
  color: var(--c-ash);
  padding: 1px 4px;
  background: rgba(0,0,0,0.3);
  border-radius: 2px;
}
.cloud-chip.on .cloud-count { color: var(--c-ink); background: rgba(255,255,255,0.3); }
.cloud-clear { color: var(--c-blood); border-color: var(--c-blood); }

.prompt-list-inner { display: flex; flex-direction: column; gap: var(--s-3); }
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
  transition: all var(--t-fast);
}
.kw-chip.highlight {
  background: var(--c-bronze-glow);
  color: var(--c-ink);
  border-color: var(--c-bronze-glow);
  font-weight: 600;
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

.empty {
  text-align: center;
  padding: var(--s-7);
  color: var(--c-ash);
  border: 1px dashed var(--c-line);
}

.prompt-list-move,
.prompt-list-enter-active,
.prompt-list-leave-active {
  transition: all .35s cubic-bezier(0.4, 0, 0.2, 1);
}
.prompt-list-enter-from, .prompt-list-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.prompt-list-leave-active { position: absolute; }
</style>
