import light from './vuetify-theme-light.ts'
import dark from './vuetify-theme-dark.ts'

const Light = 'light'
const Dark = 'dark'

export default class VuetifyTheme {

    public static get default() {
        return Light
    }

    public static get themes() {
        return { light, dark }
    }

    public static get light() {
        return Light
    }

    public static get dark() {
        return Dark
    }

}