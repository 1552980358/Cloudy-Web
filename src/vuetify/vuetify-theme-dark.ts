import {ThemeDefinition, useTheme} from 'vuetify'

const dark: ThemeDefinition = {
    dark: true,
    colors: {
        primary: '#ABC7FF',
        'on-primary': '#002F66',

        secondary: '#BEC6dC',
        'on-secondary': '#283041',

        info: '#DDBCE0',
        'on-info': '#3F2844',

        background: '#1A1B1F',
        'on-background': '#E3E2E6',

        surface: '#121316',
        'on-surface': '#C7C6CA',

        // success: string,
        // 'on-success': string,

        // warning: string,
        // 'on-warning': string,

        error: '#FFB4AB',
        'on-error': '#690005',
    }
}

export default dark