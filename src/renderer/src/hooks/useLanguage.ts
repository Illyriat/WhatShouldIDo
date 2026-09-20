import { useEffect, useState } from 'react'
import { DEFAULT_LANGUAGE, isLanguageEnabled, isSupportedLanguage, type SupportedLanguage } from '@shared/i18n'
import i18n from '../i18n'

export interface LanguageControl {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
}

// Persisted via IPC into settings.json (see src/main/ipc/settingsApi.ts), same reasoning
// as useFeaturePreferences - a reset language on every restart would be a much bigger
// annoyance for a non-English speaker than it is for e.g. the theme preference.
export function useLanguage(): LanguageControl {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE)

  useEffect(() => {
    let cancelled = false
    window.api.getAppSettings().then((settings) => {
      if (cancelled) return
      const stored = settings.language
      // A previously-picked language whose languageSupport entry got disabled since (or
      // was never enabled) falls back to the default, same as no preference at all.
      if (stored && isSupportedLanguage(stored) && isLanguageEnabled(stored) && stored !== DEFAULT_LANGUAGE) {
        setLanguageState(stored)
        i18n.changeLanguage(stored)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  function setLanguage(next: SupportedLanguage): void {
    setLanguageState(next)
    i18n.changeLanguage(next)
    window.api.setLanguage(next)
  }

  return { language, setLanguage }
}
