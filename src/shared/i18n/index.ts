import { en } from './locales/en'
import { fr } from './locales/fr'

// One entry per supported language. Adding a new one (Spanish, German, Polish, Russian,
// US English) is just another locale file + an entry here - no other plumbing changes.
export const RESOURCES = {
  en: { translation: en },
  fr: { translation: fr }
}

export type SupportedLanguage = keyof typeof RESOURCES

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' }
]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return value in RESOURCES
}
