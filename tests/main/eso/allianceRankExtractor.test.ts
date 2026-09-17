import { describe, it, expect, afterEach } from 'vitest'
import { extractAllianceRankStatus } from '../../../src/main/eso/allianceRankExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('extractAllianceRankStatus', () => {
  it('reads rank/subRank/currentAP/apForMaxRank/currentRank window for a character', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["allianceRank"]={["rank"]=23,["subRank"]=1,["currentAP"]=6200000,["apForMaxRank"]=64680000,` +
        `["currentRankStartAP"]=6072000,["currentRankEndAP"]=6918400}}` +
        `}}}}}`
    )
    const result = await extractAllianceRankStatus(filePath)
    expect(result.get('1001')).toEqual({
      rank: 23,
      subRank: 1,
      currentAP: 6200000,
      apForMaxRank: 64680000,
      currentRankStartAP: 6072000,
      currentRankEndAP: 6918400
    })
  })

  it('joins multiple characters across realm buckets', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["1001"]={["allianceRank"]={["rank"]=0,["subRank"]=1,["currentAP"]=0,["apForMaxRank"]=64680000,` +
        `["currentRankStartAP"]=0,["currentRankEndAP"]=700}}},` +
        `["EU Megaserver"]={["2001"]={["allianceRank"]={["rank"]=50,["subRank"]=2,["currentAP"]=64680000,["apForMaxRank"]=64680000,` +
        `["currentRankStartAP"]=60838400,["currentRankEndAP"]=64680000}}}` +
        `}}}}`
    )
    const result = await extractAllianceRankStatus(filePath)
    expect(result.get('1001')).toEqual({
      rank: 0,
      subRank: 1,
      currentAP: 0,
      apForMaxRank: 64680000,
      currentRankStartAP: 0,
      currentRankEndAP: 700
    })
    expect(result.get('2001')).toEqual({
      rank: 50,
      subRank: 2,
      currentAP: 64680000,
      apForMaxRank: 64680000,
      currentRankStartAP: 60838400,
      currentRankEndAP: 64680000
    })
  })

  it('ignores non-character keys under a realm bucket (e.g. "version")', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["allianceRank"]={["rank"]=23,["subRank"]=1,["currentAP"]=6200000,["apForMaxRank"]=64680000,` +
        `["currentRankStartAP"]=6072000,["currentRankEndAP"]=6918400}},` +
        `["version"]=1` +
        `}}}}}`
    )
    const result = await extractAllianceRankStatus(filePath)
    expect(result.has('version')).toBe(false)
    expect(result.size).toBe(1)
  })

  it('skips a character with no .allianceRank key yet (e.g. only a future sibling feature ran)', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["someOtherFeature"]={["foo"]=1}}` +
        `}}}}}`
    )
    const result = await extractAllianceRankStatus(filePath)
    expect(result.size).toBe(0)
  })

  it('skips a character entry with a missing/incomplete field', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["allianceRank"]={["rank"]=23,["subRank"]=1}}` +
        `}}}}}`
    )
    const result = await extractAllianceRankStatus(filePath)
    expect(result.size).toBe(0)
  })

  it('returns an empty map when the file has no $AccountWide data', async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', `WhatShouldIDoDataCollectorVars={}`)
    const result = await extractAllianceRankStatus(filePath)
    expect(result.size).toBe(0)
  })
})
