<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const navGroups = [
  {
    title: '总览',
    items: [
      { to: '/',         index: '01', label: '数据驾驶舱' },
    ]
  },
  {
    title: '王者荣耀',
    items: [
      { to: '/heroes',   index: '02', label: '英雄分析' },
      { to: '/skins',    index: '03', label: '皮肤分析' },
    ]
  },
  {
    title: '流行游戏',
    items: [
      { to: '/games',    index: '04', label: '游戏总览' },
      { to: '/games/list', index: '05', label: '分类列表' },
    ]
  }
]

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="app-sidebar">
    <div class="brand">
      <div class="brand-mark">AE</div>
      <div class="brand-text">
        <strong>AE.GG</strong>
        <span>DATA · COCKPIT</span>
      </div>
    </div>

    <nav class="nav">
      <template v-for="group in navGroups" :key="group.title">
        <div class="nav-group-title">{{ group.title }}</div>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: activePath === item.to }"
        >
          <span class="nav-index">{{ item.index }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </template>
    </nav>

    <div class="sidebar-footer">
      <div><span class="pulse"></span>DATA STREAM · ONLINE</div>
      <div style="margin-top: 4px;">S43 · v11.3.1.1 · 2026.06</div>
    </div>
  </aside>
</template>
