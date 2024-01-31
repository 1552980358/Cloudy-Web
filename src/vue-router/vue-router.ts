import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/vue-router/routes.js';

export default createRouter({
    history: createWebHistory(),
    routes: routes
});