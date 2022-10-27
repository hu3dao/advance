import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from './views/home/index.vue'
// import About from './views/about/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./views/about/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router