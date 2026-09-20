import { describe, it, expect, afterEach } from 'vitest'
import { stat, writeFile, utimes } from 'fs/promises'
import { parseSavedVariables } from '../../../src/main/eso/luaSavedVarsParser'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('parseSavedVariables', () => {
  it('parses a nested table into a plain JS object', async () => {
    const filePath = await fixture.write(
      'Fixture.lua',
      `MyAddon_Settings={["Default"]={["@Acct"]={["charInfo"]={{["charId"]="1001",["charName"]="Alice"}},["flag"]=true}}}`
    )
    const result = await parseSavedVariables(filePath, 'MyAddon_Settings')
    expect(result).toEqual({
      Default: {
        '@Acct': {
          charInfo: [{ charId: '1001', charName: 'Alice' }],
          flag: true
        }
      }
    })
  })

  it('returns null when the requested global is not assigned in the file', async () => {
    const filePath = await fixture.write('Fixture.lua', `SomeOtherGlobal={["x"]=1}`)
    expect(await parseSavedVariables(filePath, 'MyAddon_Settings')).toBeNull()
  })

  it('folds a mixed array+keyed table into 1-based numeric string keys', async () => {
    const filePath = await fixture.write('Fixture.lua', `T={[1]="a",[2]="b",["foo"]="bar"}`)
    const result = await parseSavedVariables(filePath, 'T')
    expect(result).toEqual({ '1': 'a', '2': 'b', foo: 'bar' })
  })

  it('parses negative numbers', async () => {
    const filePath = await fixture.write('Fixture.lua', `T={["n"]=-42}`)
    expect(await parseSavedVariables(filePath, 'T')).toEqual({ n: -42 })
  })

  it('round-trips non-ASCII characters in string literals', async () => {
    // Exercises the latin1-read + pseudo-latin1-parse + utf-8-decode round trip -
    // character names can contain non-ASCII (e.g. "M Æ Ĝ I" per the real addon data).
    const filePath = await fixture.write('Fixture.lua', `T={["charName"]="M Æ Ĝ I - 日本語"}`)
    expect(await parseSavedVariables(filePath, 'T')).toEqual({ charName: 'M Æ Ĝ I - 日本語' })
  })

  it('returns a plain array for a purely array-like table', async () => {
    const filePath = await fixture.write('Fixture.lua', `T={"a","b","c"}`)
    expect(await parseSavedVariables(filePath, 'T')).toEqual(['a', 'b', 'c'])
  })

  describe('caching', () => {
    it('serves a cached result without re-parsing when mtime is unchanged, even if the file content changed underneath', async () => {
      const filePath = await fixture.write('Fixture.lua', `T={["n"]=1}`)
      const originalStat = await stat(filePath)
      expect(await parseSavedVariables(filePath, 'T')).toEqual({ n: 1 })

      // Overwrite with content that would fail to parse, but pin the mtime back to
      // what it was - if the cache is keyed on mtime as intended, a repeat call must
      // serve the cached value rather than re-parsing (which would throw here).
      await writeFile(filePath, `this is not valid lua {{{`, 'utf-8')
      await utimes(filePath, originalStat.atime, originalStat.mtime)

      await expect(parseSavedVariables(filePath, 'T')).resolves.toEqual({ n: 1 })
    })

    it('re-parses once the file is rewritten with a new mtime', async () => {
      const filePath = await fixture.write('Fixture.lua', `T={["n"]=1}`)
      expect(await parseSavedVariables(filePath, 'T')).toEqual({ n: 1 })

      await writeFile(filePath, `T={["n"]=2}`, 'utf-8')
      const future = new Date(Date.now() + 5000)
      await utimes(filePath, future, future)

      expect(await parseSavedVariables(filePath, 'T')).toEqual({ n: 2 })
    })

    it('caches independently per global name for the same file', async () => {
      const filePath = await fixture.write('Fixture.lua', `A={["x"]=1} B={["x"]=2}`)
      expect(await parseSavedVariables(filePath, 'A')).toEqual({ x: 1 })
      expect(await parseSavedVariables(filePath, 'B')).toEqual({ x: 2 })
    })
  })
})
