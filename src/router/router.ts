import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/setup',
        name: 'Setup',
        component: () => import('./route/setup/Setup.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router