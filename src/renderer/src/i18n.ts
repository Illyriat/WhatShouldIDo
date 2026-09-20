import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { RESOURCES, DEFAULT_LANGUAGE } from '@shared/i18n'

// Initialized once at app startup (imported for its side effect from main.tsx, before
// anything renders). useLanguage() switches the active language once the persisted
// preference loads from settings.json.
i18n.use(initReactI18next).init({
  resources: RESOURCES,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false
})

export default i18n
