import {createI18n} from 'vue-i18n'

const i18n = createI18n(
    {
        legacy: false,
        locale: 'en',
        fallbackLocale: 'en',
    }
)

export default i18n

export const i18nLoadText = async () => {
    const locale = i18n.global.locale.value
    const locale_text = await import(`./locale/${locale}.json`)
    i18n.global.setLocaleMessage(locale, locale_text)
}