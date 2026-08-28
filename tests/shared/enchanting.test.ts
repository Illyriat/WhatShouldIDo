import { describe, it, expect } from 'vitest'
import {
  computeGlyph,
  glyphForEssence,
  runesForGlyph,
  runeIconUrl,
  glyphIconUrl,
  GLYPHS
} from '../../src/shared/enchanting'

describe('glyphForEssence', () => {
  it('additive and subtractive potency pick different glyphs from the same essence', () => {
    expect(glyphForEssence('oko', 'additive')?.id).toBe('health')
    expect(glyphForEssence('oko', 'subtractive')?.id).toBe('absorb-health')
  })

  it('returns undefined for an unknown essence id', () => {
    expect(glyphForEssence('not-a-real-essence', 'additive')).toBeUndefined()
  })
})

describe('runesForGlyph', () => {
  it('round-trips every glyph back to the essence/potency pair that produces it', () => {
    for (const glyph of GLYPHS) {
      const runes = runesForGlyph(glyph.id)
      expect(runes, `no reverse lookup for glyph "${glyph.id}"`).not.toBeNull()
      expect(glyphForEssence(runes!.essence.id, runes!.potencyType)?.id).toBe(glyph.id)
    }
  })

  it('returns null for an unknown glyph id', () => {
    expect(runesForGlyph('not-a-real-glyph')).toBeNull()
  })
})

describe('computeGlyph', () => {
  it('resolves a full glyph from potency + essence, aspect optional', () => {
    const result = computeGlyph('jora', 'oko', 'kuta')
    expect(result?.glyph.id).toBe('health')
    expect(result?.qualityLabel).toBe('Legendary')
  })

  it('reports a pending quality label when aspect is not chosen yet', () => {
    const result = computeGlyph('jora', 'oko', null)
    expect(result?.qualityLabel).toBe('depends on Aspect rune')
  })

  it('returns null until both potency and essence are chosen', () => {
    expect(computeGlyph(null, 'oko', null)).toBeNull()
    expect(computeGlyph('jora', null, null)).toBeNull()
    expect(computeGlyph(null, null, null)).toBeNull()
  })

  it('returns null for unknown rune ids', () => {
    expect(computeGlyph('not-real', 'oko', null)).toBeNull()
    expect(computeGlyph('jora', 'not-real', null)).toBeNull()
  })
})

describe('icon URL helpers', () => {
  // Regression guard for the shipped-broken-icons bug - see alchemy.test.ts.
  it('runeIconUrl/glyphIconUrl are relative paths', () => {
    expect(runeIconUrl('jora')).toBe('./enchanting/runes/jora.png')
    expect(glyphIconUrl('health')).toBe('./enchanting/glyphs/health.png')
  })
})
