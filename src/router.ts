import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/favorites', name: 'favorites', component: FavoritesPage }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})
