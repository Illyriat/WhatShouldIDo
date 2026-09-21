import { describe, it, expect } from 'vitest'
import { compareVersions, parseManifest } from '../../../src/main/eso/addonManifest'

describe('parseManifest', () => {
  it('reads the Data Collector style manifest (Version present, AddonVersion not an integer)', () => {
    const text = [
      '## Title: What Should I Do - Data Collector',
      '## APIVersion: 101050',
      '## Version: 1.5.0',
      '## AddonVersion: 1.5.0',
      '## DependsOn: LibUndauntedPledges>=102020'
    ].join('\r\n')

    expect(parseManifest(text).version).toBe('1.5.0')
  })

  it('reads the library style manifest (integer AddOnVersion)', () => {
    const text = '## Version: 1.2.2\n## AddOnVersion: 102020\n## APIVersion: 101046 101047\n'
    expect(parseManifest(text)).toEqual({ version: '1.2.2', addOnVersion: 102020 })
  })

  it('does not mistake AddOnVersion for Version', () => {
    expect(parseManifest('## AddOnVersion: 102020\n')).toEqual({ version: null, addOnVersion: 102020 })
  })

  it('returns nulls for a manifest with neither', () => {
    expect(parseManifest('## Title: Nothing\n')).toEqual({ version: null, addOnVersion: null })
  })
})

describe('compareVersions', () => {
  it('compares numerically per segment, not as text', () => {
    expect(compareVersions('1.10.0', '1.9.0')).toBeGreaterThan(0)
    expect(compareVersions('1.4.1', '1.5.0')).toBeLessThan(0)
  })

  it('treats a missing trailing segment as zero', () => {
    expect(compareVersions('1.5', '1.5.0')).toBe(0)
    expect(compareVersions('1.5.1', '1.5')).toBeGreaterThan(0)
  })

  it('treats a non-numeric segment as zero rather than throwing', () => {
    expect(compareVersions('1.x.0', '1.0.0')).toBe(0)
  })
})
