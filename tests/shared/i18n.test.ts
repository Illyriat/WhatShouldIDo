import { describe, it, expect } from 'vitest'
import { FEATURE_FLAGS } from '../../src/shared/featureFlags'
import { RESOURCES, SUPPORTED_LANGUAGES, isLanguageEnabled, isSupportedLanguage } from '../../src/shared/i18n'

describe('SUPPORTED_LANGUAGES', () => {
  it('only offers languages that are both translated and developer-enabled', () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code)
    for (const code of codes) {
      expect(Object.keys(RESOURCES)).toContain(code)
      expect(FEATURE_FLAGS.languageSupport.find((l) => l.code === code)?.enabled).toBe(true)
    }
  })

  it('excludes any languageSupport entry that is disabled', () => {
    const disabledCodes = FEATURE_FLAGS.languageSupport.filter((l) => !l.enabled).map((l) => l.code)
    const offeredCodes = SUPPORTED_LANGUAGES.map((l) => l.code)
    for (const code of disabledCodes) {
      expect(offeredCodes).not.toContain(code)
    }
  })
})

describe('isSupportedLanguage', () => {
  it('is true only for languages with a locale file, regardless of the flag', () => {
    expect(isSupportedLanguage('en')).toBe(true)
    expect(isSupportedLanguage('fr')).toBe(true)
    expect(isSupportedLanguage('de')).toBe(true)
    expect(isSupportedLanguage('es')).toBe(true)
    expect(isSupportedLanguage('pl')).toBe(false)
  })
})

describe('isLanguageEnabled', () => {
  it('matches the languageSupport flag for known codes', () => {
    for (const entry of FEATURE_FLAGS.languageSupport) {
      expect(isLanguageEnabled(entry.code)).toBe(entry.enabled)
    }
  })

  it('is false for a code with no languageSupport entry at all', () => {
    expect(isLanguageEnabled('pl')).toBe(false)
  })
})
