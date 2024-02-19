import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        name: 'Setup',
        path: '/setup',
        component: () => import('@/app/setup/Setup.vue'),
        redirect: { name: 'Secret' },
        children: [
        ],
    },
];

export default routes;