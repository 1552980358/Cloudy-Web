import { createI18n } from 'vue-i18n';
import en from './locales/en.json';

const DefaultLocale = 'en';

const vueI18n =  createI18n({
    legacy: false,
    locale: DefaultLocale,
    fallbackLocale: DefaultLocale,
    messages: {
        en: en
    }
});

export default vueI18n;

export const setupVueI18n = async () => {
    const vueI18nGlobal = vueI18n.global;
    const currentLocale = vueI18nGlobal.locale.value;
    if (!vueI18nGlobal.availableLocales.includes(currentLocale)) {
        const locale = await import(`./locales/${currentLocale}.json`)
            .catch(() => en);
        vueI18nGlobal.setLocaleMessage(currentLocale, locale);
    }
}