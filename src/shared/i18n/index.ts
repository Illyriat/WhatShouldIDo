import { FEATURE_FLAGS } from '../featureFlags'
import { en } from './locales/en'
import { fr } from './locales/fr'
import { de } from './locales/de'
import { es } from './locales/es'

// One entry per supported language. Adding a new one (Polish, Russian, US English) is
// just another locale file + an entry here, plus a FEATURE_FLAGS.languageSupport entry
// in featureFlags.ts - no other plumbing changes. Every language's translation content
// ships in the bundle regardless of its flag; languageSupport only controls what's
// offered below.
export const RESOURCES = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es }
}

export type SupportedLanguage = keyof typeof RESOURCES

const ALL_LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español'
}

function isEnabledCode(code: string): boolean {
  return FEATURE_FLAGS.languageSupport.some((l) => l.code === code && l.enabled)
}

// Only offer languages that both exist (a locale file was written) and are
// developer-enabled (FEATURE_FLAGS.languageSupport in featureFlags.ts) - a language
// mid-translation can ship in the bundle without appearing in the Settings picker yet.
export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string }[] = (
  Object.keys(RESOURCES) as SupportedLanguage[]
)
  .filter(isEnabledCode)
  .map((code) => ({ code, label: ALL_LANGUAGE_LABELS[code] }))

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return value in RESOURCES
}

// A previously-persisted choice can still exist after the developer disables that
// language's entry in a later build - useLanguage() checks this before applying it.
export function isLanguageEnabled(value: string): boolean {
  return isEnabledCode(value)
}
