import { describe, it, expect, afterEach } from 'vitest'
import { extractCharacters } from '../../../src/main/eso/characterExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('extractCharacters', () => {
  it('reads charId/charName/server for a character, with the realm bucket key as the server', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["name"]="Alice"}` +
        `}}}}}`
    )
    const accounts = await extractCharacters(filePath)
    expect(accounts).toEqual([
      { accountName: '@TestAccount', characters: [{ charId: '1001', charName: 'Alice', server: 'NA Megaserver' }] }
    ])
  })

  it('joins characters across realm buckets and sorts by name', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["1002"]={["name"]="Bob"}},` +
        `["EU Megaserver"]={["2001"]={["name"]="Carol"}}` +
        `}}}}`
    )
    const accounts = await extractCharacters(filePath)
    expect(accounts).toEqual([
      {
        accountName: '@TestAccount',
        characters: [
          { charId: '1002', charName: 'Bob', server: 'NA Megaserver' },
          { charId: '2001', charName: 'Carol', server: 'EU Megaserver' }
        ]
      }
    ])
  })

  it('ignores non-character keys under a realm bucket (e.g. "championPoints", "bankWealth", "version")', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["version"]=1,` +
        `["NA Megaserver"]={["1001"]={["name"]="Alice"},["championPoints"]=810,["bankWealth"]={["gold"]=1}}` +
        `}}}}`
    )
    const accounts = await extractCharacters(filePath)
    expect(accounts).toEqual([
      { accountName: '@TestAccount', characters: [{ charId: '1001', charName: 'Alice', server: 'NA Megaserver' }] }
    ])
  })

  it('skips a character bucket with no .name yet (data collected before upgrading to a version that records it)', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["allianceRank"]={["rank"]=1}}` +
        `}}}}}`
    )
    const accounts = await extractCharacters(filePath)
    expect(accounts).toEqual([])
  })

  it('returns an empty list when the file has no $AccountWide data', async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', `WhatShouldIDoDataCollectorVars={}`)
    expect(await extractCharacters(filePath)).toEqual([])
  })
})
