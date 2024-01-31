import LightTheme from './vuetify-theme-light.ts';
import DarkTheme from './vuetify-theme-dark.ts';

const LightThemeName = 'LightTheme';
const DarkThemeName = 'DarkTheme';

export default class VuetifyTheme {

    public static get themes() {
        return {
            LightTheme,
            DarkTheme
        };
    }

    public static get default() {
        return LightThemeName;
    }

    public static get light() {
        return LightThemeName;
    }

    public static get dark() {
        return DarkThemeName;
    }

}