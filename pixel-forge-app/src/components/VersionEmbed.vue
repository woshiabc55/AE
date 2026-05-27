<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { VersionConfig } from '../core/versions'

const props = defineProps<{
  version: VersionConfig
  baseUrl: string
}>()

const iframeLoaded = ref(false)
const iframeError = ref(false)
const showIframe = ref(false)

const iframeSrc = computed(() => {
  return props.baseUrl + props.version.path + 'index.html'
})

function openIframe() {
  showIframe.value = true
  iframeLoaded.value = false
  iframeError.value = false
}

function onIframeLoad() {
  iframeLoaded.value = true
}

function onIframeError() {
  iframeError.value = true
}

function closeIframe() {
  showIframe.value = false
}

watch(() => props.version.id, () => {
  showIframe.value = false
  iframeLoaded.value = false
})
</script>

<template>
  <div class="version-embed">
    <div v-if="!showIframe" class="embed-prompt" @click="openIframe">
      <span class="embed-icon">▶</span>
      <span class="embed-text">加载 {{ version.label }} 实例</span>
      <span class="embed-hint">点击在 iframe 中嵌套查看</span>
    </div>
    <div v-else class="embed-frame">
      <div class="embed-bar">
        <span class="embed-title">{{ version.label }} · {{ version.name }}</span>
        <span class="embed-url">{{ iframeSrc }}</span>
        <span class="spacer"></span>
        <a class="embed-link" :href="iframeSrc" target="_blank">↗ 新窗口</a>
        <span class="embed-close" @click="closeIframe">✕</span>
      </div>
      <div class="embed-loading" v-if="!iframeLoaded && !iframeError">
        <span class="spinner"></span>
        <span>加载中...</span>
      </div>
      <div class="embed-error" v-if="iframeError">
        <span>✗ 加载失败</span>
        <span>请确认 :8081 端口服务已启动</span>
        <a :href="iframeSrc" target="_blank">尝试直接打开</a>
      </div>
      <iframe
        v-show="iframeLoaded"
        :src="iframeSrc"
        class="embed-iframe"
        @load="onIframeLoad"
        @error="onIframeError"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.version-embed { border: 1px solid #1a2a1a; border-radius: 4px; overflow: hidden; background: #0a0a12; }
.embed-prompt { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s; }
.embed-prompt:hover { background: rgba(0,255,136,0.04); }
.embed-icon { font-size: 24px; color: #3a5a3a; }
.embed-prompt:hover .embed-icon { color: #00ff88; }
.embed-text { font-family: 'Press Start 2P', monospace; font-size: 7px; color: #6a8a6a; letter-spacing: 1px; }
.embed-hint { font-size: 9px; color: #3a5a3a; }
.embed-frame { display: flex; flex-direction: column; }
.embed-bar { height: 28px; background: #0f0f1a; border-bottom: 1px solid #1a2a1a; display: flex; align-items: center; padding: 0 10px; gap: 8px; }
.embed-title { font-family: 'Press Start 2P', monospace; font-size: 5px; color: #00ff88; letter-spacing: 1px; }
.embed-url { font-size: 9px; color: #3a5a3a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
.spacer { flex: 1; }
.embed-link { font-size: 9px; color: #44ddff; cursor: pointer; text-decoration: none; }
.embed-link:hover { text-decoration: underline; }
.embed-close { font-size: 12px; color: #3a5a3a; cursor: pointer; padding: 2px 4px; }
.embed-close:hover { color: #ff3366; }
.embed-iframe { width: 100%; height: 420px; border: none; background: #050508; }
.embed-loading, .embed-error { height: 420px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #3a5a3a; font-size: 11px; }
.embed-error a { color: #44ddff; text-decoration: none; }
.embed-error a:hover { text-decoration: underline; }
.spinner { width: 16px; height: 16px; border: 2px solid #1a2a1a; border-top-color: #00ff88; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
