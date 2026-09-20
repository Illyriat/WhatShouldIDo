import { describe, it, expect } from 'vitest'
import { isFeatureFlagOn } from '../../src/shared/featureFlags'

describe('isFeatureFlagOn', () => {
  it('passes plain booleans through unchanged', () => {
    expect(isFeatureFlagOn(true)).toBe(true)
    expect(isFeatureFlagOn(false)).toBe(false)
  })

  it('is true for a language array with at least one entry enabled', () => {
    expect(isFeatureFlagOn([{ code: 'en', enabled: true }])).toBe(true)
    expect(isFeatureFlagOn([{ code: 'en', enabled: false }, { code: 'fr', enabled: true }])).toBe(true)
  })

  it('is false for a language array with every entry disabled, or empty', () => {
    expect(isFeatureFlagOn([{ code: 'en', enabled: false }])).toBe(false)
    expect(isFeatureFlagOn([])).toBe(false)
  })
})
