import { createApp } from 'vue'
import App from './App.vue'
import VueRouter from '@/vue-router/vue-router.js'

createApp(App)
    .use(VueRouter)
    .mount('#app')
