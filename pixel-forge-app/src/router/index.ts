import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/tool', name: 'tool', component: () => import('../views/ToolView.vue') },
  { path: '/editor', name: 'editor', component: () => import('../views/EditorView.vue') },
  { path: '/model-editor', name: 'model-editor', component: () => import('../views/ModelEditorView.vue') },
  { path: '/dataset', name: 'dataset', component: () => import('../views/DatasetView.vue') },
  { path: '/training', name: 'training', component: () => import('../views/TrainingNodeView.vue') },
  { path: '/docs', name: 'docs', component: () => import('../views/DocsView.vue') },
  { path: '/versions', name: 'versions', component: () => import('../views/VersionsView.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
