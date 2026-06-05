import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'overview', component: () => import('@/views/OverviewView.vue') },
    { path: '/scene/:id', name: 'scene', component: () => import('@/views/SceneDetailView.vue') },
    { path: '/motion-bus', name: 'motion-bus', component: () => import('@/views/MotionBusView.vue') },
    { path: '/prompts', name: 'prompts', component: () => import('@/views/PromptsView.vue') },
    { path: '/particles', name: 'particles', component: () => import('@/views/ParticlesView.vue') }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})
