<script setup lang="ts">
import { ref } from 'vue'
import { MCOP_FORMATS } from '../core/mcop'

const expanded = ref<Set<string>>(new Set(MCOP_FORMATS.map(f => f.ext)))
const selectedDoc = ref<{ ext: string; id: string; name: string; fmt: string } | null>(null)

function toggle(ext: string) {
  if (expanded.value.has(ext)) expanded.value.delete(ext)
  else expanded.value.add(ext)
}

function selectDoc(ext: string, id: string, name: string, fmt: string) {
  selectedDoc.value = { ext, id, name, fmt }
}
</script>

<template>
  <div class="docs-page">
    <header class="docs-header">
      <h1 class="docs-title">◈ MCOP 文档集合</h1>
      <span class="docs-count">7 formats · 57 docs</span>
    </header>
    <div class="docs-body">
      <aside class="docs-tree">
        <div v-for="fmt in MCOP_FORMATS" :key="fmt.ext" class="fmt-group">
          <div class="fmt-title" @click="toggle(fmt.ext)">
            <span class="arrow" :class="{ collapsed: !expanded.has(fmt.ext) }">▼</span>
            <span class="dot" :style="{ background: fmt.color }"></span>
            <span class="fmt-name" :style="{ color: fmt.color }">{{ fmt.name }}</span>
            <span class="fmt-ext">{{ fmt.ext }}</span>
            <span class="fmt-count">{{ fmt.items.length }}</span>
          </div>
          <div v-if="expanded.has(fmt.ext)" class="fmt-items">
            <div
              v-for="item in fmt.items"
              :key="item.id"
              class="fmt-item"
              :class="{ active: selectedDoc?.id === item.id && selectedDoc?.ext === fmt.ext }"
              @click="selectDoc(fmt.ext, item.id, item.name, fmt.name)"
            >
              <span :style="{ color: fmt.color }">{{ fmt.icon }}</span>
              <span v-if="item.layer" class="layer-tag" :class="item.layer">{{ item.layer }}</span>
              <span class="item-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </aside>
      <main class="docs-detail">
        <template v-if="selectedDoc">
          <div class="detail-header">
            <span class="detail-badge" :style="{ borderColor: MCOP_FORMATS.find(f => f.ext === selectedDoc.ext)?.color, color: MCOP_FORMATS.find(f => f.ext === selectedDoc.ext)?.color }">{{ selectedDoc.ext }}</span>
            <span class="detail-name">{{ selectedDoc.name }}</span>
          </div>
          <pre class="detail-json">{{ JSON.stringify({ format: selectedDoc.fmt.toLowerCase() + '/1.0', id: selectedDoc.id, name: selectedDoc.name, state: 'published' }, null, 2) }}</pre>
        </template>
        <div v-else class="detail-empty">
          <span class="empty-icon">◈</span>
          <span>选择左侧文档查看详情</span>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.docs-page { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }
.docs-header { height: 48px; display: flex; align-items: center; padding: 0 20px; gap: 16px; border-bottom: 1px solid #1a2a1a; background: #0a0a12; }
.docs-title { font-family: 'Press Start 2P', monospace; font-size: 10px; color: #44ddff; letter-spacing: 2px; }
.docs-count { font-size: 10px; color: #3a5a3a; }
.docs-body { flex: 1; display: flex; overflow: hidden; }
.docs-tree { width: 280px; border-right: 1px solid #1a2a1a; overflow-y: auto; padding: 8px 0; background: #0a0a12; }
.fmt-group { border-bottom: 1px solid #1a2a1a; }
.fmt-title { padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; user-select: none; }
.fmt-title:hover { background: rgba(255,255,255,0.02); }
.arrow { font-size: 8px; color: #3a5a3a; transition: transform 0.2s; }
.arrow.collapsed { transform: rotate(-90deg); }
.dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.fmt-name { font-family: 'Press Start 2P', monospace; font-size: 7px; letter-spacing: 1px; }
.fmt-ext { font-size: 10px; color: #3a5a3a; }
.fmt-count { margin-left: auto; font-size: 10px; color: #3a5a3a; }
.fmt-items { padding: 2px 0; }
.fmt-item { padding: 4px 12px 4px 28px; font-size: 11px; color: #6a8a6a; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s; }
.fmt-item:hover { background: rgba(0,255,136,0.04); color: #d0ffd0; }
.fmt-item.active { background: rgba(0,255,136,0.08); color: #00ff88; border-right: 2px solid #00ff88; }
.layer-tag { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 1px 4px; border-radius: 1px; }
.layer-tag.core { background: rgba(0,255,136,0.15); color: #7cff6b; }
.layer-tag.effect { background: rgba(255,107,157,0.15); color: #ff6b9d; }
.layer-tag.arch { background: rgba(162,155,254,0.15); color: #a29bfe; }
.item-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.docs-detail { flex: 1; padding: 20px; overflow-y: auto; }
.detail-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.detail-badge { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 3px 8px; border: 1px solid; border-radius: 2px; letter-spacing: 1px; }
.detail-name { font-size: 14px; color: #d0ffd0; }
.detail-json { background: #0a0a14; border: 1px solid #1a2a1a; border-radius: 3px; padding: 16px; font-family: 'Fira Code', monospace; font-size: 12px; color: #a9b1d6; overflow-x: auto; }
.detail-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 12px; color: #3a5a3a; }
.empty-icon { font-size: 40px; opacity: 0.3; }
</style>
