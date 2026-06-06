<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Search, Moon, Sun, Database, BarChart3, Home, Info } from 'lucide-vue-next';
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const router = useRouter();
const localQuery = ref(store.query);

const isDark = ref(true);
function toggleTheme() {
  isDark.value = !isDark.value;
}

function handleSubmit(e: Event) {
  e.preventDefault();
  store.setQuery(localQuery.value);
  router.push('/browse');
}
</script>

<template>
  <header class="sticky top-0 z-40 glass-strong">
    <div class="container mx-auto flex h-16 items-center justify-between gap-4">
      <RouterLink to="/" class="flex items-center gap-2 group shrink-0">
        <div class="relative w-9 h-9 grid place-items-center bg-gradient-to-br from-neon-pink via-neon-violet to-neon-cyan rounded-sm">
          <span class="font-display font-black text-ink-900 text-lg">N</span>
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-neon-yellow rounded-full animate-blink" />
        </div>
        <div class="hidden sm:block">
          <div class="font-display font-bold text-base tracking-widest text-gradient-neon">
            NEON.FRAME
          </div>
          <div class="font-mono text-[10px] text-neon-cyan/70 -mt-0.5">
            // GAME-IP-DERIVATIVES-ARCHIVE
          </div>
        </div>
      </RouterLink>

      <form @submit="handleSubmit" class="flex-1 max-w-md hidden md:block">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan" />
          <input
            v-model="localQuery"
            placeholder="搜索 IP / 衍生作品 / 标签..."
            class="w-full bg-ink-700/60 border border-neon-cyan/20 focus:border-neon-cyan/60 focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2 text-sm rounded-sm font-mono placeholder:text-white/30 transition"
          />
          <kbd class="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 text-[10px] text-white/40 font-mono border border-white/10 px-1.5 py-0.5 rounded">
            ⏎ ENTER
          </kbd>
        </div>
      </form>

      <nav class="hidden md:flex items-center gap-1">
        <RouterLink
          to="/"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-white/70 hover:text-neon-cyan hover:bg-white/5 border border-transparent"
          active-class="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/40"
        >
          <Home class="w-4 h-4" /><span>首页</span>
        </RouterLink>
        <RouterLink
          to="/browse"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-white/70 hover:text-neon-cyan hover:bg-white/5 border border-transparent"
          active-class="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/40"
        >
          <Database class="w-4 h-4" /><span>浏览</span>
        </RouterLink>
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-white/70 hover:text-neon-cyan hover:bg-white/5 border border-transparent"
          active-class="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/40"
        >
          <BarChart3 class="w-4 h-4" /><span>看板</span>
        </RouterLink>
        <RouterLink
          to="/about"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-white/70 hover:text-neon-cyan hover:bg-white/5 border border-transparent"
          active-class="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/40"
        >
          <Info class="w-4 h-4" /><span>关于</span>
        </RouterLink>
      </nav>

      <button
        @click="toggleTheme"
        class="p-2 rounded-sm border border-white/10 hover:border-neon-cyan/60 hover:text-neon-cyan transition"
        title="切换主题"
      >
        <Sun v-if="!isDark" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
      </button>
    </div>
  </header>
</template>
