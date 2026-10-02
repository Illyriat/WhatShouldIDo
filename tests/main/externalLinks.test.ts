import { describe, it, expect } from 'vitest'
import { isSafeExternalUrl } from '../../src/main/externalLinks'
import { SUPPORT_URL } from '../../src/shared/links'

describe('isSafeExternalUrl', () => {
  it('allows the https links the app opens', () => {
    expect(isSafeExternalUrl(SUPPORT_URL)).toBe(true)
    expect(isSafeExternalUrl('https://www.esoui.com/downloads/info3946-LibUndauntedPledges.html')).toBe(true)
  })

  it('refuses anything that is not https', () => {
    expect(isSafeExternalUrl('http://example.com/')).toBe(false)
    expect(isSafeExternalUrl('file:///C:/Windows/System32/calc.exe')).toBe(false)
    expect(isSafeExternalUrl('ms-settings:privacy')).toBe(false)
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false)
  })

  it('refuses a string that is not a URL at all', () => {
    expect(isSafeExternalUrl('')).toBe(false)
    expect(isSafeExternalUrl('not a url')).toBe(false)
  })
})
