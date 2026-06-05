<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStoryboardStore } from '@/stores/storyboard'

const router = useRouter()
const route = useRoute()
const store = useStoryboardStore()

const scrollProgress = ref(0)
const toast = ref('')
let toastTimer: number | null = null

function showToast(text: string) {
  toast.value = text
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 1600)
}

function onScroll() {
  const doc = document.documentElement
  const total = doc.scrollHeight - doc.clientHeight
  scrollProgress.value = total > 0 ? Math.min(1, doc.scrollTop / total) : 0
}

function onKeydown(e: KeyboardEvent) {
  // 避免在输入框中触发
  const target = e.target as HTMLElement
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
  if (e.metaKey || e.ctrlKey || e.altKey) return

  const key = e.key
  // 1-4: 跳到对应分镜
  if (key >= '1' && key <= '4') {
    const id = ['one', 'two', 'three', 'four'][parseInt(key) - 1]
    router.push(`/scene/${id}`)
    showToast(`→ 分镜${['一','二','三','四'][parseInt(key)-1]}`)
    e.preventDefault()
    return
  }
  // 0 / h: 回总览
  if (key === '0' || key.toLowerCase() === 'h') {
    router.push('/')
    showToast('→ 总览')
    e.preventDefault()
    return
  }
  // m: motion bus
  if (key.toLowerCase() === 'm') {
    router.push('/motion-bus')
    showToast('→ 动态总线')
    e.preventDefault()
    return
  }
  // p: prompts
  if (key.toLowerCase() === 'p') {
    router.push('/prompts')
    showToast('→ 提示词库')
    e.preventDefault()
    return
  }
  // f: particles
  if (key.toLowerCase() === 'f') {
    router.push('/particles')
    showToast('→ 粒子演示')
    e.preventDefault()
    return
  }
  // ←/→: 在分镜详情页切换
  if (route.name === 'scene') {
    const idx = store.shots.findIndex((s) => s.id === route.params.id)
    if (e.key === 'ArrowRight' && idx < store.shots.length - 1) {
      router.push(`/scene/${store.shots[idx + 1].id}`)
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      router.push(`/scene/${store.shots[idx - 1].id}`)
      e.preventDefault()
    }
  }
  // g: 回到顶
  if (key.toLowerCase() === 'g') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    e.preventDefault()
  }
  // ?: 帮助
  if (key === '?') {
    showToast('1-4 分镜 · 0/H 总览 · M 总线 · P 提示词 · F 粒子 · ← → 切换 · G 顶 · ? 帮助')
    e.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="scroll-progress" :style="{ '--p': scrollProgress }">
    <div class="scroll-progress-bar"></div>
  </div>

  <transition name="toast">
    <div v-if="toast" class="kb-toast mono">{{ toast }}</div>
  </transition>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 100;
  background: rgba(176, 141, 87, 0.08);
  pointer-events: none;
}
.scroll-progress-bar {
  height: 100%;
  width: calc(var(--p) * 100%);
  background: linear-gradient(90deg, var(--c-bronze-deep), var(--c-bronze-glow));
  box-shadow: 0 0 12px rgba(224, 168, 46, 0.6);
  transition: width 0.05s linear;
}

.kb-toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  background: var(--c-ink-3);
  color: var(--c-bronze-glow);
  border: 1px solid var(--c-bronze);
  padding: 8px 16px;
  font-size: 11px;
  letter-spacing: 0.14em;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  max-width: 80vw;
  text-align: center;
}
.toast-enter-active, .toast-leave-active { transition: all .25s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -12px); }
</style>
