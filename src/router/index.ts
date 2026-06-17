import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: '数据驾驶舱', subtitle: 'Honor of Kings & Global Games — Overview' }
  },
  {
    path: '/heroes',
    name: 'heroes',
    component: () => import('../views/HeroesView.vue'),
    meta: { title: '英雄分析', subtitle: 'Honor of Kings — Hero Distribution & Popularity' }
  },
  {
    path: '/skins',
    name: 'skins',
    component: () => import('../views/SkinsView.vue'),
    meta: { title: '皮肤分析', subtitle: 'Honor of Kings — Skin Tier & Series Distribution' }
  },
  {
    path: '/games',
    name: 'games',
    component: () => import('../views/GamesView.vue'),
    meta: { title: '游戏总览', subtitle: 'Popular Games — Platform, Category & Rating' }
  },
  {
    path: '/games/list',
    name: 'games-list',
    component: () => import('../views/GamesListView.vue'),
    meta: { title: '分类列表', subtitle: 'Popular Games — Filterable Library' }
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})
