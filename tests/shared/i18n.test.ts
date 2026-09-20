import { describe, it, expect } from 'vitest'
import i18next from 'i18next'
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
    expect(isSupportedLanguage('pl')).toBe(true)
    expect(isSupportedLanguage('ru')).toBe(true)
    expect(isSupportedLanguage('it')).toBe(false)
  })
})

describe('isLanguageEnabled', () => {
  it('matches the languageSupport flag for known codes', () => {
    for (const entry of FEATURE_FLAGS.languageSupport) {
      expect(isLanguageEnabled(entry.code)).toBe(entry.enabled)
    }
  })

  it('is false for a code with no languageSupport entry at all', () => {
    expect(isLanguageEnabled('it')).toBe(false)
  })
})

// Polish and Russian have four CLDR plural categories (one/few/many/other), not just
// English's one/other - see pl.ts's and ru.ts's header comments for how the extra
// `_few` keys get past the `typeof en` typing. This guards against that trick silently
// regressing into a plain two-form translation (which i18next would then paper over by
// falling back to the English `_other` string for "few" counts, per i18n.ts's
// `fallbackLng`, rather than actually resolving to Polish/Russian text).
describe('Polish and Russian plural forms', () => {
  const pluralClusters = ['pledges.showUpcoming', 'alchemy.combinationsFound', 'settings.foundAccounts', 'settings.foundCharacters']

  it.each(['pl', 'ru'] as const)('%s defines a _few form for every pluralized key', (code) => {
    const translation = RESOURCES[code].translation as unknown as Record<string, Record<string, unknown>>
    for (const cluster of pluralClusters) {
      const [section, key] = cluster.split('.')
      expect(translation[section][`${key}_few`]).toEqual(expect.any(String))
    }
  })

  it.each(['pl', 'ru'] as const)('%s resolves a plural count of 2 to its own _few text, not the English fallback', async (code) => {
    const instance = i18next.createInstance()
    await instance.init({ lng: code, fallbackLng: 'en', resources: RESOURCES, interpolation: { escapeValue: false } })
    const pl2 = instance.t('settings.foundAccounts', { count: 2 })
    const en2 = i18next.createInstance()
    await en2.init({ lng: 'en', resources: RESOURCES })
    expect(pl2).not.toBe(en2.t('settings.foundAccounts', { count: 2 }))
  })
})
