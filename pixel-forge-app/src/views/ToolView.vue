<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import { MD_DOCUMENTS, MD_CATEGORIES, type MdDocument } from '../core/md-docs'

const selectedDocId = ref<string>('overview')
const imagePreviewUrl = ref<string | null>(null)
const imagePreviewCaption = ref('')
const searchQuery = ref('')

const selectedDoc = computed(() => MD_DOCUMENTS.find(d => d.id === selectedDocId.value) || null)

const filteredDocs = computed(() => {
  if (!searchQuery.value.trim()) return MD_DOCUMENTS
  const q = searchQuery.value.toLowerCase()
  return MD_DOCUMENTS.filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.tags.some(t => t.toLowerCase().includes(q)) ||
    d.category.toLowerCase().includes(q)
  )
})

const renderedHtml = computed(() => {
  if (!selectedDoc.value) return ''
  let content = selectedDoc.value.content
  for (const img of selectedDoc.value.images) {
    content = content.replace(
      `![${img.alt}](${img.alt.replace(/\s/g, '-')})`,
      `<div class="md-img-wrap"><img src="${img.url}" alt="${img.alt}" class="md-img" @click="previewImage('${img.url}', '${img.caption}')" /><div class="md-img-caption">${img.caption}</div></div>`
    )
  }
  return marked(content) as string
})

function selectDoc(id: string) {
  selectedDocId.value = id
}

function previewImage(url: string, caption: string) {
  imagePreviewUrl.value = url
  imagePreviewCaption.value = caption
}

function closePreview() {
  imagePreviewUrl.value = null
}

function getCategoryColor(cat: string) {
  return MD_CATEGORIES.find(c => c.id === cat)?.color || '#3a5a3a'
}

function getCategoryIcon(cat: string) {
  return MD_CATEGORIES.find(c => c.id === cat)?.icon || '◈'
}

function handleMdClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG' && target.classList.contains('md-img')) {
    const src = target.getAttribute('src') || ''
    const caption = target.nextElementSibling?.textContent || ''
    previewImage(src, caption)
  }
}
</script>

<template>
  <div class="tool-page">
    <header class="tool-header">
      <span class="tool-logo">DAOLUE</span>
      <span class="tool-title">稻锊 · 主要工具</span>
      <span class="tool-sub">MD文档查看器</span>
      <span class="spacer"></span>
      <div class="tool-search">
        <span class="search-icon">⌕</span>
        <input class="search-input" v-model="searchQuery" placeholder="搜索文档...">
      </div>
    </header>

    <div class="tool-body">
      <aside class="tool-sidebar">
        <div class="ts-section" v-for="cat in MD_CATEGORIES" :key="cat.id">
          <div class="ts-cat-head">
            <span class="ts-cat-icon" :style="{ color: cat.color }">{{ cat.icon }}</span>
            <span class="ts-cat-name" :style="{ color: cat.color }">{{ cat.label }}</span>
          </div>
          <div
            v-for="doc in filteredDocs.filter(d => d.category === cat.id)"
            :key="doc.id"
            class="ts-doc-item"
            :class="{ active: selectedDocId === doc.id }"
            @click="selectDoc(doc.id)"
          >
            <span class="ts-doc-dot" :style="{ background: cat.color }"></span>
            <span class="ts-doc-title">{{ doc.title }}</span>
            <span class="ts-doc-images" v-if="doc.images.length > 0">📷 {{ doc.images.length }}</span>
          </div>
        </div>
      </aside>

      <main class="tool-main" v-if="selectedDoc">
        <div class="tm-meta">
          <span class="tm-badge" :style="{ color: getCategoryColor(selectedDoc.category), borderColor: getCategoryColor(selectedDoc.category) }">{{ getCategoryIcon(selectedDoc.category) }} {{ selectedDoc.category }}</span>
          <span class="tm-title">{{ selectedDoc.title }}</span>
          <span class="spacer"></span>
          <div class="tm-tags">
            <span v-for="tag in selectedDoc.tags" :key="tag" class="tm-tag">{{ tag }}</span>
          </div>
          <span class="tm-img-count" v-if="selectedDoc.images.length > 0">📷 {{ selectedDoc.images.length }} 张图像</span>
        </div>

        <div class="tm-images-strip" v-if="selectedDoc.images.length > 0">
          <div v-for="(img, i) in selectedDoc.images" :key="i" class="tm-img-thumb" @click="previewImage(img.url, img.caption)">
            <img :src="img.url" :alt="img.alt">
            <span class="tm-img-label">{{ img.caption }}</span>
          </div>
        </div>

        <div class="tm-content" v-html="renderedHtml" @click="handleMdClick"></div>
      </main>

      <main class="tool-main" v-else>
        <div class="tm-empty">
          <span class="tm-empty-icon">◈</span>
          <span>选择左侧文档查看</span>
        </div>
      </main>
    </div>

    <Teleport to="body">
      <div class="img-preview-overlay" v-if="imagePreviewUrl" @click="closePreview">
        <div class="img-preview-card" @click.stop>
          <div class="ip-header">
            <span class="ip-caption">{{ imagePreviewCaption }}</span>
            <span class="ip-close" @click="closePreview">✕</span>
          </div>
          <img :src="imagePreviewUrl" class="ip-img">
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tool-page { display: flex; flex-direction: column; height: 100vh; background: #050508; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; }

.tool-header { height: 42px; background: #0a0a12; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 10px; flex-shrink: 0; }
.tool-logo { font-family: 'Press Start 2P', monospace; font-size: 10px; color: #7cff6b; text-shadow: 0 0 14px rgba(124,255,107,0.5); letter-spacing: 2px; }
.tool-title { font-family: 'Press Start 2P', monospace; font-size: 6px; color: #ffaa00; letter-spacing: 1.5px; text-shadow: 0 0 8px rgba(255,170,0,0.3); }
.tool-sub { font-size: 10px; color: #3a5a3a; }
.spacer { flex: 1; }
.tool-search { display: flex; align-items: center; gap: 6px; background: #0f0f1a; border: 1px solid #1a2a1a; border-radius: 3px; padding: 0 8px; }
.search-icon { color: #3a5a3a; font-size: 14px; }
.search-input { background: transparent; border: none; color: #d0ffd0; font-family: 'Share Tech Mono', monospace; font-size: 10px; height: 26px; outline: none; width: 140px; }

.tool-body { flex: 1; display: flex; overflow: hidden; }
.tool-sidebar { width: 240px; background: #0a0a12; border-right: 1px solid #1a2a1a; overflow-y: auto; flex-shrink: 0; }
.ts-section { border-bottom: 1px solid #1a2a1a; }
.ts-cat-head { padding: 8px 12px; display: flex; align-items: center; gap: 6px; }
.ts-cat-icon { font-size: 12px; }
.ts-cat-name { font-family: 'Press Start 2P', monospace; font-size: 6px; letter-spacing: 1px; }
.ts-doc-item { display: flex; align-items: center; gap: 6px; padding: 6px 12px 6px 24px; cursor: pointer; transition: all 0.15s; }
.ts-doc-item:hover { background: rgba(255,255,255,0.02); }
.ts-doc-item.active { background: rgba(255,170,0,0.06); border-right: 2px solid #ffaa00; }
.ts-doc-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.ts-doc-title { font-size: 10px; color: #6a8a6a; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ts-doc-item.active .ts-doc-title { color: #d0ffd0; }
.ts-doc-images { font-size: 8px; color: #3a5a3a; flex-shrink: 0; }

.tool-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.tm-meta { height: 36px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 16px; gap: 10px; flex-shrink: 0; }
.tm-badge { font-family: 'Press Start 2P', monospace; font-size: 5px; padding: 2px 8px; border: 1px solid; border-radius: 2px; letter-spacing: 1px; }
.tm-title { font-size: 11px; color: #d0ffd0; }
.tm-tags { display: flex; gap: 4px; }
.tm-tag { font-family: 'Press Start 2P', monospace; font-size: 4px; padding: 1px 5px; background: rgba(255,255,255,0.04); color: #6a8a6a; border-radius: 1px; letter-spacing: 0.5px; }
.tm-img-count { font-size: 9px; color: #3a5a3a; }

.tm-images-strip { display: flex; gap: 8px; padding: 10px 16px; border-bottom: 1px solid #1a2a1a; background: #0a0a12; overflow-x: auto; flex-shrink: 0; }
.tm-img-thumb { display: flex; flex-direction: column; gap: 3px; cursor: pointer; flex-shrink: 0; border: 1px solid #1a2a1a; border-radius: 4px; overflow: hidden; transition: all 0.2s; }
.tm-img-thumb:hover { border-color: #ffaa00; box-shadow: 0 0 12px rgba(255,170,0,0.15); }
.tm-img-thumb img { width: 180px; height: 100px; object-fit: cover; display: block; }
.tm-img-label { font-size: 8px; color: #3a5a3a; padding: 3px 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }

.tm-content { flex: 1; overflow-y: auto; padding: 24px 32px; }
.tm-content :deep(h1) { font-family: 'Press Start 2P', monospace; font-size: 14px; color: #ffaa00; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,170,0,0.3); margin-bottom: 16px; border-bottom: 1px solid #1a2a1a; padding-bottom: 12px; }
.tm-content :deep(h2) { font-family: 'Press Start 2P', monospace; font-size: 9px; color: #44ddff; letter-spacing: 1px; margin-top: 24px; margin-bottom: 10px; }
.tm-content :deep(h3) { font-family: 'Press Start 2P', monospace; font-size: 7px; color: #7cff6b; letter-spacing: 1px; margin-top: 16px; margin-bottom: 8px; }
.tm-content :deep(p) { font-size: 12px; color: #d0ffd0; line-height: 1.7; margin-bottom: 10px; }
.tm-content :deep(blockquote) { border-left: 3px solid #ffaa00; padding: 8px 16px; margin: 12px 0; background: rgba(255,170,0,0.04); color: #ffaa00; font-style: italic; }
.tm-content :deep(code) { font-family: 'Fira Code', monospace; font-size: 11px; background: #0f0f1a; padding: 1px 5px; border-radius: 2px; color: #ff6b9d; }
.tm-content :deep(pre) { background: #0a0a14; border: 1px solid #1a2a1a; border-radius: 4px; padding: 14px; margin: 12px 0; overflow-x: auto; }
.tm-content :deep(pre code) { background: none; padding: 0; color: #a9b1d6; }
.tm-content :deep(table) { width: 100%; border-collapse: collapse; margin: 12px 0; }
.tm-content :deep(th) { background: #0f0f1a; border: 1px solid #1a2a1a; padding: 6px 10px; font-family: 'Press Start 2P', monospace; font-size: 6px; color: #ffaa00; text-align: left; letter-spacing: 0.5px; }
.tm-content :deep(td) { border: 1px solid #1a2a1a; padding: 6px 10px; font-size: 11px; color: #d0ffd0; }
.tm-content :deep(hr) { border: none; border-top: 1px solid #1a2a1a; margin: 16px 0; }
.tm-content :deep(ul), .tm-content :deep(ol) { padding-left: 20px; margin-bottom: 10px; }
.tm-content :deep(li) { font-size: 11px; color: #d0ffd0; line-height: 1.6; margin-bottom: 3px; }
.tm-content :deep(strong) { color: #00ff88; }
.tm-content :deep(em) { color: #a29bfe; }
.tm-content :deep(.md-img-wrap) { margin: 16px 0; border: 1px solid #1a2a1a; border-radius: 6px; overflow: hidden; }
.tm-content :deep(.md-img) { width: 100%; display: block; cursor: pointer; transition: opacity 0.2s; }
.tm-content :deep(.md-img:hover) { opacity: 0.85; }
.tm-content :deep(.md-img-caption) { padding: 6px 12px; font-size: 10px; color: #3a5a3a; background: #0a0a12; text-align: center; }

.tm-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
.tm-empty-icon { font-size: 48px; color: #1a2a1a; }

.img-preview-overlay { position: fixed; inset: 0; z-index: 10002; background: rgba(5,5,8,0.92); display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.img-preview-card { max-width: 90vw; max-height: 90vh; border: 1px solid #1a2a1a; border-radius: 8px; overflow: hidden; background: #0a0a12; box-shadow: 0 16px 64px rgba(0,0,0,0.8); }
.ip-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; border-bottom: 1px solid #1a2a1a; }
.ip-caption { font-size: 11px; color: #d0ffd0; }
.ip-close { font-size: 14px; color: #3a5a3a; cursor: pointer; padding: 2px 6px; }
.ip-close:hover { color: #ff3366; }
.ip-img { max-width: 90vw; max-height: calc(90vh - 40px); display: block; object-fit: contain; }
</style>