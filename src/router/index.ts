import HouseOfLegacy from '@/views/house-of-legacy.vue'
import Index from '@/views/index.vue'
import { createRouter, createWebHistory } from 'vue-router'


// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Index},
        { path: '/house-of-legacy', component: HouseOfLegacy},
    ]
})

export default router
