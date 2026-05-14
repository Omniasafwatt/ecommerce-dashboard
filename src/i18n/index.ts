import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './en'
import ar from './ar'

export const defaultNS = 'translation'
export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const

const savedLang = localStorage.getItem('i18nextLng') ?? 'en'

i18n
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    lng: ['en', 'ar'].includes(savedLang) ? savedLang : 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

// Apply RTL direction when Arabic is active
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
  document.documentElement.setAttribute('lang', lng)
})

export default i18n
