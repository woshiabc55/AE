import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/editor', name: 'editor', component: () => import('../views/EditorView.vue') },
  { path: '/docs', name: 'docs', component: () => import('../views/DocsView.vue') },
  { path: '/versions', name: 'versions', component: () => import('../views/VersionsView.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
