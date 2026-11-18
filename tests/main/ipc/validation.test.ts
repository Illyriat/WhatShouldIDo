import { describe, it, expect } from 'vitest'
import { join } from 'path'
import { homedir } from 'os'
import {
  validateDisabledFeatures,
  validateDocumentsPathOverride,
  validateLanguage
} from '../../../src/main/ipc/validation'

describe('validateDocumentsPathOverride', () => {
  it('accepts null and absolute paths', () => {
    const path = join(homedir(), 'Documents')
    expect(validateDocumentsPathOverride(null)).toBeNull()
    expect(validateDocumentsPathOverride(path)).toBe(path)
  })

  it('rejects relative paths, empty strings and non-strings', () => {
    expect(() => validateDocumentsPathOverride('Documents')).toThrow(TypeError)
    expect(() => validateDocumentsPathOverride('')).toThrow(TypeError)
    expect(() => validateDocumentsPathOverride(undefined)).toThrow(TypeError)
    expect(() => validateDocumentsPathOverride(42)).toThrow(TypeError)
    expect(() => validateDocumentsPathOverride({})).toThrow(TypeError)
  })
})

describe('validateDisabledFeatures', () => {
  it('keeps known feature flags', () => {
    expect(validateDisabledFeatures(['alchemy', 'musicBoxes'])).toEqual(['alchemy', 'musicBoxes'])
  })

  it('drops unknown names, inherited property names and non-strings', () => {
    expect(validateDisabledFeatures(['alchemy', 'notAFlag', 'toString', '__proto__', 7, null])).toEqual([
      'alchemy'
    ])
  })

  it('rejects anything that is not an array', () => {
    expect(() => validateDisabledFeatures('alchemy')).toThrow(TypeError)
    expect(() => validateDisabledFeatures(null)).toThrow(TypeError)
  })
})

describe('validateLanguage', () => {
  it('accepts a language the app has', () => {
    expect(validateLanguage('en')).toBe('en')
    expect(validateLanguage('de')).toBe('de')
  })

  it('rejects unknown codes and non-strings', () => {
    expect(() => validateLanguage('xx')).toThrow(TypeError)
    expect(() => validateLanguage('')).toThrow(TypeError)
    expect(() => validateLanguage(null)).toThrow(TypeError)
  })
})
