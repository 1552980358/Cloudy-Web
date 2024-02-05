import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import VuetifyTheme from '@/vuetify/theme/vuetify-theme.ts';

export default createVuetify({
    components: components,
    directives: directives,
    blueprint: md3,
    theme: {
        defaultTheme: VuetifyTheme.default,
        themes: VuetifyTheme.themes
    },
    defaults: {
        VTextField: {
            'base-color': 'outline',
            'color': 'primary',
            'hideDetails': 'auto',
            'variant': 'outlined',
        }
    }
})