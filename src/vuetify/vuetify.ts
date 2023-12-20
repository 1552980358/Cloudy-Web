import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import light from './vuetify-theme-light'
import dark from '@/vuetify/vuetify-theme-dark'

export const LightTheme = 'light'
export const DarkTheme = 'dark'

const vuetify = createVuetify({
    components: components,
    directives: directives,
    blueprint: md3,
    theme: {
        defaultTheme: LightTheme,
        themes: {
            light,
            dark
        }
    }
})

export default vuetify