<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// @ts-ignore
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { LayoutGrid, List, ChevronDown, ChevronUp, Sparkles, Filter, Zap, Activity } from 'lucide-vue-next';
import FilterBar from '@/components/FilterBar.vue';
import WorkCard from '@/components/WorkCard.vue';
import WorkListRow from '@/components/WorkListRow.vue';
import WorkDetailDrawer from '@/components/WorkDetailDrawer.vue';
import { useAppStore } from '@/stores/app';
import { generateLargeDataset, TARGET_DATASET_SIZE } from '@/composables/useLargeDataset';
import type { DerivativeWork, WorkType } from '@/data/types';
import { applyFilters } from '@/utils/filter';

const store = useAppStore();
const route = useRoute();
const router = useRouter();

const allWorks = ref<DerivativeWork[]>([]);
const filtered = ref<DerivativeWork[]>([]);
const loading = ref(true);
const filterDuration = ref(0);
const lastFilterTime = ref(performance.now());
const showMobileFilter = ref(false);

const view = computed(() => store.view);
const CARD_HEIGHT = 260;
const ROW_HEIGHT = 76;

onMounted(async () => {
  // 异步加载 10 万级数据集
  setTimeout(() => {
    allWorks.value = generateLargeDataset(TARGET_DATASET_SIZE);
    runFilter();
    loading.value = false;
  }, 100);

  // 处理 URL 参数
  const typeParam = route.query.type as string | undefined;
  const ipParam = route.query.ip as string | undefined;
  const qParam = route.query.q as string | undefined;
  if (typeParam) store.toggleType(typeParam as WorkType);
  if (ipParam) store.toggleIp(ipParam);
  if (qParam) store.setQuery(qParam);
  if (typeParam || ipParam || qParam) router.replace({ path: '/browse' });
});

function runFilter() {
  const t0 = performance.now();
  filtered.value = applyFilters(allWorks.value, {
    query: store.query,
    types: store.types,
    regions: store.regions,
    ipIds: store.ipIds,
    yearRange: store.yearRange,
    tags: store.tags,
    view: store.view,
    sort: store.sort,
    sortDesc: store.sortDesc,
  });
  filterDuration.value = performance.now() - t0;
  lastFilterTime.value = performance.now();
}

watch(
  () => [store.query, store.types, store.regions, store.ipIds, store.yearRange, store.tags, store.sort, store.sortDesc, store.view],
  () => runFilter()
);

function reset() {
  store.resetFilters();
}
</script>

<template>
  <div class="relative">
    <div class="container py-10">
      <div class="grid lg:grid-cols-[300px_1fr] gap-6">
        <aside class="hidden lg:block">
          <FilterBar />
        </aside>

        <main>
          <!-- 性能指标条 -->
          <div class="card-neon p-3 mb-4 flex flex-wrap items-center gap-3 text-[10px] font-mono text-white/40">
            <div class="flex items-center gap-1.5">
              <Activity class="w-3.5 h-3.5 text-neon-cyan" />
              <span>DATASET: <span class="text-neon-cyan">{{ allWorks.length.toLocaleString() }}</span> 条</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Zap class="w-3.5 h-3.5 text-neon-pink" />
              <span>FILTER: <span class="text-neon-pink">{{ filterDuration.toFixed(1) }}ms</span></span>
            </div>
            <div class="flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-neon-violet" />
              <span>VIRTUAL: <span class="text-neon-violet">ON</span></span>
            </div>
            <div class="ml-auto">
              <span>MATCH: <span class="text-neon-yellow font-bold">{{ filtered.length.toLocaleString() }}</span></span>
            </div>
          </div>

          <!-- 头部 -->
          <div class="flex items-end justify-between mb-5 flex-wrap gap-3">
            <div>
              <div class="flex items-center gap-2 text-neon-cyan font-mono text-xs mb-1">
                <Sparkles class="w-3.5 h-3.5" />
                <span>// BROWSE</span>
              </div>
              <h1 class="font-display text-2xl md:text-3xl font-bold text-gradient-cyan">
                浏览资料库
              </h1>
              <p class="text-sm text-white/50 mt-1">
                找到 <span class="text-neon-cyan font-mono font-bold">{{ filtered.length.toLocaleString() }}</span> 款衍生作品
                <span v-if="filtered.length > 0" class="text-white/30 ml-2">/ 10 万级虚拟滚动</span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-for="k in ['popularity', 'year', 'title'] as const"
                :key="k"
                @click="store.setSort(k)"
                :class="[
                  'text-xs px-2.5 py-1.5 rounded-sm border flex items-center gap-1 transition',
                  store.sort === k
                    ? 'border-neon-cyan/60 text-neon-cyan bg-neon-cyan/10'
                    : 'border-white/10 text-white/60 hover:border-neon-cyan/40'
                ]"
              >
                {{ { popularity: '热度', year: '年份', title: '名称' }[k] }}
                <ChevronDown v-if="store.sort === k && store.sortDesc" class="w-3 h-3" />
                <ChevronUp v-else-if="store.sort === k" class="w-3 h-3" />
              </button>
              <div class="w-px h-6 bg-white/10 mx-1" />
              <div class="flex border border-white/10 rounded-sm overflow-hidden">
                <button
                  @click="store.setView('grid')"
                  :class="['p-1.5', view === 'grid' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-white/50 hover:text-white']"
                  title="网格视图"
                >
                  <LayoutGrid class="w-4 h-4" />
                </button>
                <button
                  @click="store.setView('list')"
                  :class="['p-1.5', view === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-white/50 hover:text-white']"
                  title="列表视图"
                >
                  <List class="w-4 h-4" />
                </button>
              </div>
              <button
                @click="reset"
                class="lg:hidden text-xs text-white/50 hover:text-neon-pink border border-white/10 hover:border-neon-pink px-2.5 py-1.5 rounded-sm"
              >
                重置
              </button>
            </div>
          </div>

          <!-- 移动端筛选 -->
          <div class="lg:hidden mb-4">
            <button
              @click="showMobileFilter = !showMobileFilter"
              class="btn-neon w-full justify-center"
            >
              <Filter class="w-4 h-4" />
              筛选 / Filters {{ showMobileFilter ? '×' : '↓' }}
            </button>
            <div v-if="showMobileFilter" class="mt-3"><FilterBar /></div>
          </div>

          <!-- 列表 / 虚拟滚动 -->
          <div v-if="loading" class="card-neon p-12 text-center">
            <div class="inline-block w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-3" />
            <p class="text-white/50">加载 10 万级数据集中...</p>
          </div>

          <div v-else-if="filtered.length === 0" class="card-neon p-12 text-center">
            <div class="text-6xl mb-4 opacity-20">∅</div>
            <p class="text-white/50">没有匹配的作品，试试调整筛选条件</p>
            <button @click="reset" class="btn-neon btn-pink mt-4 mx-auto text-xs">重置筛选</button>
          </div>

          <div v-else>
            <RecycleScroller
              v-if="view === 'grid'"
              class="h-[70vh] -mx-1"
              :items="filtered"
              :item-size="CARD_HEIGHT"
              key-field="id"
              v-slot="{ item }"
            >
              <div class="px-1 pb-3">
                <WorkCard :work="item" />
              </div>
            </RecycleScroller>

            <RecycleScroller
              v-else
              class="h-[70vh]"
              :items="filtered"
              :item-size="ROW_HEIGHT"
              key-field="id"
              v-slot="{ item }"
            >
              <div class="pb-1.5">
                <WorkListRow :work="item" />
              </div>
            </RecycleScroller>
          </div>
        </main>
      </div>
    </div>

    <WorkDetailDrawer />
  </div>
</template>
