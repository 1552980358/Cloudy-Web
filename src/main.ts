import { createApp } from 'vue'

import App from './App.vue'

import router from '@/router/router'
import i18n, {i18nLoadText} from '@/i18n/i18n'
import vuetify from '@/vuetify/vuetify'
import axiosSetup from '@/axios/axios-setup'
import 'material-symbols'

// Vue-Advanced-Cropper
import 'vue-advanced-cropper/dist/style.css'

import '@/assets/css/common.css'
import '@/assets/css/index.css'

router.beforeEach(async () => {
    await i18nLoadText()
})

axiosSetup()

createApp(App)
    .use(router)
    .use(i18n)
    .use(vuetify)
    .mount('#app')
