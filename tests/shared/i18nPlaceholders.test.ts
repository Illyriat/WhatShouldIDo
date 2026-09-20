import { describe, it, expect } from 'vitest'
import { en } from '../../src/shared/i18n/locales/en'
import { fr } from '../../src/shared/i18n/locales/fr'
import { de } from '../../src/shared/i18n/locales/de'
import { es } from '../../src/shared/i18n/locales/es'
import { pl } from '../../src/shared/i18n/locales/pl'
import { ru } from '../../src/shared/i18n/locales/ru'

// `typeof en` (see i18next.d.ts and each locale file's header comment) guarantees every
// locale has the same set of KEYS as en.ts, but says nothing about a key's VALUE - a
// translation could drop a `{{count}}` interpolation placeholder, typo one, or lose a
// <bold>/<esoui>/<support> markup tag, and the build would still pass. i18next silently
// renders a dropped placeholder as literal "{{count}}" text and Trans just omits content
// wrapped in a missing tag, so this is a real, user-visible failure mode with no other
// safety net. This walks every string leaf in en.ts and checks each locale's string at
// the same path carries the exact same set of placeholders and tags (order doesn't
// matter - a translation is free to reorder words around them).
const LOCALES: Record<string, unknown> = { fr, de, es, pl, ru }

function leafPaths(value: unknown, prefix: string, out: [string, string][]): void {
  if (typeof value === 'string') {
    out.push([prefix, value])
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      leafPaths(child, prefix ? `${prefix}.${key}` : key, out)
    }
  }
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort()
}

function tags(text: string): string[] {
  return [...text.matchAll(/<(\w+)>/g)].map((m) => m[1]).sort()
}

function at(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((o, part) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[part] : undefined), obj)
}

const enLeaves: [string, string][] = []
leafPaths(en, '', enLeaves)

describe('locale placeholder and markup-tag consistency', () => {
  it('collected a non-trivial number of English strings (guards against the walker itself going stale)', () => {
    expect(enLeaves.length).toBeGreaterThan(100)
  })

  for (const [localeCode, locale] of Object.entries(LOCALES)) {
    describe(localeCode, () => {
      it.each(enLeaves)('%s keeps the same placeholders and tags as English', (path, enValue) => {
        const localeValue = at(locale, path)
        expect(typeof localeValue).toBe('string')
        expect(placeholders(localeValue as string)).toEqual(placeholders(enValue))
        expect(tags(localeValue as string)).toEqual(tags(enValue))
      })
    })
  }
})
