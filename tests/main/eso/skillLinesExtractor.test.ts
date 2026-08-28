import { describe, it, expect, afterEach } from 'vitest'
import { extractCharacterServers } from '../../../src/main/eso/skillLinesExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('extractCharacterServers', () => {
  it('labels each character with its megaserver, and skips the settings bucket', async () => {
    const filePath = await fixture.write(
      'SkillLines.lua',
      `SkillLinesSavedVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["@TestAccount"]={["Alice"]={},["Bob"]={}}},` +
        `["EU Megaserver"]={["@TestAccount"]={["Carol"]={}}},` +
        `["settings"]={["foo"]=1}` +
        `}}}}`
    )

    const result = await extractCharacterServers(filePath)

    expect(result.get('@TestAccount')).toEqual(
      new Map([
        ['Alice', 'NA Megaserver'],
        ['Bob', 'NA Megaserver'],
        ['Carol', 'EU Megaserver']
      ])
    )
  })

  it('skips an account with no realm buckets', async () => {
    const filePath = await fixture.write(
      'SkillLines.lua',
      `SkillLinesSavedVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["settings"]={["foo"]=1}}}}}`
    )
    const result = await extractCharacterServers(filePath)
    expect(result.has('@TestAccount')).toBe(false)
  })

  it('returns an empty map when the file has no Default profile', async () => {
    const filePath = await fixture.write('SkillLines.lua', `SkillLinesSavedVars={["NotDefault"]={}}`)
    expect((await extractCharacterServers(filePath)).size).toBe(0)
  })
})
