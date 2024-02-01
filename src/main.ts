import { createApp } from 'vue';
import App from './App.vue';

import VueRouter from '@/vue-router/vue-router.ts';
import Vuetify from '@/vuetify/vuetify.ts';
import VueI18n, { setupVueI18n } from '@/vue-i18n/vue-i18n.ts';
import '@/material-symbols/material-symbols.ts';
import '@/axios/axios.ts';

import '@/assets/css/index.css';
import '@/assets/css/text.css';

// Setup VueI18n before navigation
VueRouter.beforeEach(setupVueI18n);

createApp(App)
    .use(VueRouter)
    .use(Vuetify)
    .use(VueI18n)
    .mount('#app');