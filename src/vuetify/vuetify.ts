import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import VuetifyTheme from './theme/vuetify-theme.ts'

// DO NOT IMPORT THIS IN any .ts FILE other than main.ts
export default createVuetify({
    components: components,
    directives: directives,
    blueprint: md3,
    theme: {
        defaultTheme: VuetifyTheme.default,
        themes: VuetifyTheme.themes,
    },
})