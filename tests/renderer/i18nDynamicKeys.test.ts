import { describe, it, expect } from 'vitest'
import { en } from '../../src/shared/i18n/locales/en'
import { USER_TOGGLEABLE_FEATURES } from '../../src/renderer/src/hooks/useFeaturePreferences'
import { ALL_NAV_ITEMS } from '../../src/renderer/src/components/Sidebar'
import { ADDONS, THEME_OPTIONS } from '../../src/renderer/src/pages/SettingsPage'
import { musicBoxAchievement, allianceRankAchievement, wealthAchievement } from '../../src/shared/achievements'

// Every one of these sources holds a translation key as plain `string` data (a
// labelKey/descriptionKey/nameKey/titleKey field), read at render time via tKey() -
// src/renderer/src/i18nDynamicKey.ts's escape hatch for exactly this case, since t()'s
// literal-key typing (see i18next.d.ts) can only check a key written directly as
// t('...'). That means a typo'd or renamed key in any of these arrays is NOT a compile
// error - it would only surface as a raw, untranslated key string shown to the user.
// This walks each source for every field ending in "Key" and asserts it resolves to a
// real string in en.ts, the source of truth every other locale is typed against.
function collectDynamicKeys(value: unknown, out: Set<string> = new Set()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectDynamicKeys(item, out)
  } else if (value && typeof value === 'object') {
    for (const [field, fieldValue] of Object.entries(value)) {
      if (field.endsWith('Key') && typeof fieldValue === 'string') {
        out.add(fieldValue)
      } else {
        collectDynamicKeys(fieldValue, out)
      }
    }
  }
  return out
}

function resolvesInEn(key: string): boolean {
  const value = key.split('.').reduce<unknown>((obj, part) => {
    return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[part] : undefined
  }, en)
  return typeof value === 'string'
}

const keys = collectDynamicKeys([
  USER_TOGGLEABLE_FEATURES,
  ALL_NAV_ITEMS,
  ADDONS,
  THEME_OPTIONS,
  musicBoxAchievement(52),
  allianceRankAchievement(),
  wealthAchievement()
])

describe('data-driven translation keys', () => {
  it('collected a non-trivial number of keys (guards against the collector itself going stale)', () => {
    expect(keys.size).toBeGreaterThan(30)
  })

  it.each([...keys].sort())('%s resolves to a string in en.ts', (key) => {
    expect(resolvesInEn(key)).toBe(true)
  })
})
