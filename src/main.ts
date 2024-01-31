import { createApp } from 'vue';
import App from './App.vue';
import VueRouter from '@/vue-router/vue-router.ts';
import Vuetify from '@/vuetify/vuetify.ts';

createApp(App)
    .use(VueRouter)
    .use(Vuetify)
    .mount('#app');
