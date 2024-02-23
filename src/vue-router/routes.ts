import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        name: 'Setup',
        path: '/setup',
        component: () => import('@/app/setup/Setup.vue'),
        redirect: { name: 'Secret' },
        children: [
            {
                name: 'Secret',
                path: 'secret',
                component: () => import('@/app/setup/secret/Secret.vue'),
            },
        ],
    },
];

export default routes;