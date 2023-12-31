import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Index',
        component: () => import('./route/index/Index.vue')
    },
    {
        path: '/setup',
        name: 'Setup',
        component: () => import('./route/setup/Setup.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router