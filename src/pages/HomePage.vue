<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown, Sparkles, Globe2, Camera, BookOpen } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import ToolGrid from '@/components/ToolGrid.vue'
import ToolDetail from '@/components/ToolDetail.vue'
import StatBlock from '@/components/StatBlock.vue'
import { useTools } from '@/composables/useTools'
import { TOOLS_TOTAL } from '@/data/tools'
import { CATEGORIES } from '@/data/categories'

const { visibleTools, setCategory, category, search, setSearch } = useTools()
const activeId = ref<string | null>(null)

function openDetail(id: string) {
  activeId.value = id
}
function closeDetail() {
  activeId.value = null
}

const issueDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Reveal on scroll for hero
const hero = ref<HTMLElement | null>(null)
let heroObs: IntersectionObserver | null = null

onMounted(() => {
  if (hero.value) {
    heroObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    )
    heroObs.observe(hero.value)
  }
  document.body.classList.add('paper-grain')
})
onBeforeUnmount(() => {
  heroObs?.disconnect()
  document.body.classList.remove('paper-grain')
})
</script>

<template>
  <div>
    <AppHeader />
    <CategoryNav />

    <main class="mx-auto max-w-[1600px] px-6 md:px-10 py-8 md:py-12">
      <!-- HERO -->
      <section
        ref="hero"
        class="reveal grid grid-cols-12 gap-6 md:gap-10 pb-10 md:pb-16 border-b border-line"
      >
        <div class="col-span-12 lg:col-span-8">
          <p class="issue-num text-[var(--muted)] flex items-center gap-2">
            <Sparkles :size="12" /> VOL. 24 · {{ issueDate }} · A FIELD GUIDE
          </p>
          <h1 class="headline mt-4 text-[clamp(3.2rem,9vw,8.2rem)]">
            SHOOTING <br />
            <span class="headline-italic">STARS</span> OF AI
          </h1>
          <p class="font-display italic text-[1.1rem] md:text-[1.3rem] mt-6 max-w-[58ch] text-balance">
            一本持续更新的杂志风 AI 工具宇宙志：把 {{ TOOLS_TOTAL }}+ 个跨 21 个类别的产品
            排成一张可滚动、可筛选、可收藏的灵感大网格。
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a href="#grid" class="btn btn-primary">
              开始阅读 <ArrowDown :size="14" />
            </a>
            <button class="btn" @click="setSearch('')">清除搜索</button>
            <span class="issue-num text-[var(--muted)] hidden md:inline-flex items-center gap-1.5 ml-2">
              <Globe2 :size="12" /> 中 / EN 双语
            </span>
          </div>
        </div>

        <aside class="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-4">
            <StatBlock :value="TOOLS_TOTAL" label="已收录工具" />
            <StatBlock :value="CATEGORIES.length - 1" label="细分领域" />
            <StatBlock :value="24" label="本期期号" />
            <StatBlock :value="48" label="参与策展" />
          </div>
          <div class="border border-line p-4">
            <p class="issue-num text-[var(--muted)] flex items-center gap-1">
              <BookOpen :size="12" /> 编辑部按
            </p>
            <p class="font-display italic text-[0.95rem] mt-2">
              选品标准 = 是否改变一类工作流 + 是否有可验证的公开 demo + 是否经得起编辑部试用。
            </p>
          </div>
        </aside>
      </section>

      <!-- CATEGORY HERO STRIP -->
      <section class="py-10 md:py-14 border-b border-line">
        <div class="flex items-end justify-between mb-6 md:mb-10">
          <h2 class="headline text-[clamp(2rem,5vw,3.6rem)]">
            The <span class="headline-italic">Index</span>
          </h2>
          <span class="issue-num text-[var(--muted)] hidden md:inline-flex items-center gap-1">
            <Camera :size="12" /> 配图由 AI 实时生成
          </span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <button
            v-for="cat in CATEGORIES.slice(1)"
            :key="cat.id"
            class="group text-left border border-line p-3 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            @click="setCategory(cat.id)"
          >
            <p class="mono text-[0.6rem] tracking-[0.25em] uppercase opacity-60">{{ cat.en }}</p>
            <p class="headline text-[1.4rem] mt-1">{{ cat.name }}</p>
            <p class="text-[0.75rem] mt-1 opacity-70 line-clamp-2">{{ cat.short }}</p>
          </button>
        </div>
      </section>

      <!-- GRID -->
      <section id="grid" class="py-10 md:py-14">
        <div class="flex items-end justify-between mb-6 md:mb-10 gap-4 flex-wrap">
          <div>
            <p class="issue-num text-[var(--muted)]">SECTION 01</p>
            <h2 class="headline text-[clamp(2.2rem,6vw,4rem)] mt-1">
              The <span class="headline-italic">Field</span>
            </h2>
          </div>
          <div class="mono text-[0.8rem] tracking-[0.15em] uppercase">
            <span class="opacity-60">SHOWING</span>
            <span class="ml-1 display-num inline-block text-[1.4rem] align-middle">
              {{ String(visibleTools.length).padStart(3, '0') }}
            </span>
            <span class="opacity-60 ml-2">/</span>
            <span class="ml-1">{{ TOOLS_TOTAL }} TOTAL</span>
            <span class="ml-3 opacity-60">CAT</span>
            <span class="ml-1">{{ category.toUpperCase() }}</span>
            <span v-if="search" class="ml-3 opacity-60">Q</span>
            <span v-if="search" class="ml-1">"{{ search }}"</span>
          </div>
        </div>

        <ToolGrid
          :tools="visibleTools"
          empty-text="当前分类与搜索条件下没有结果"
          @open="openDetail"
        />
      </section>

      <!-- FOOTER -->
      <footer class="pt-10 mt-10 border-t border-line">
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 md:col-span-6">
            <h3 class="headline text-[2.4rem]">AI TOOLVERSE</h3>
            <p class="font-display italic text-[1rem] mt-2 max-w-[44ch]">
              持续更新的杂志风 AI 工具宇宙。本期由编辑部策划，所有配图由 AI 实时生成。
            </p>
          </div>
          <div class="col-span-6 md:col-span-3">
            <p class="issue-num text-[var(--muted)]">SECTIONS</p>
            <ul class="mt-2 space-y-1 text-[0.9rem]">
              <li>聊天 / 对话</li>
              <li>绘画 / 视频</li>
              <li>编程 / 办公</li>
              <li>Agent / 自动化</li>
            </ul>
          </div>
          <div class="col-span-6 md:col-span-3">
            <p class="issue-num text-[var(--muted)]">CREDITS</p>
            <ul class="mt-2 space-y-1 text-[0.9rem]">
              <li>主编 · Editorial AI</li>
              <li>设计 · Editorial AI</li>
              <li>工程 · Vue3 + Vite</li>
            </ul>
          </div>
        </div>
        <p class="mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--muted)] mt-8">
          © AI TOOLVERSE · 第 24 期 · PRINTED ON SCREEN
        </p>
      </footer>
    </main>

    <ToolDetail :tool-id="activeId" @close="closeDetail" />
  </div>
</template>
