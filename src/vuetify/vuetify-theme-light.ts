import {ThemeDefinition, useTheme} from 'vuetify'

const light: ThemeDefinition = {
    dark: false,
    colors: {
        primary: '#2D5DA7',
        'on-primary': '#FFF',

        secondary: '#565E71',
        'on-secondary': '#FFF',

        info: '#705574',
        'on-info': '#FFF',

        background: '#FDFBFF',
        'on-background': '#1A1B1F',

        surface: '#FAf9FD',
        'on-surface': '#1A1B1F',

        // success: string,
        // 'on-success': string,

        // warning: string,
        // 'on-warning': string,

        error: '#BA1A1A',
        'on-error': '#FFF',
    }
}

export default light