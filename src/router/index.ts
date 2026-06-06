import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/pages/Home.vue') },
    { path: '/browse', component: () => import('@/pages/Browse.vue') },
    { path: '/dashboard', component: () => import('@/pages/Dashboard.vue') },
    { path: '/about', component: () => import('@/pages/About.vue') },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
