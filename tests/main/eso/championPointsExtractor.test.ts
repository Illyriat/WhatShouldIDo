import { describe, it, expect, afterEach } from 'vitest'
import { extractChampionPoints } from '../../../src/main/eso/championPointsExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('extractChampionPoints', () => {
  it('reads the account-wide CP total for a realm', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["championPoints"]=810,["1001"]={["allianceRank"]={["rank"]=23}}` +
        `}}}}}`
    )
    const result = await extractChampionPoints(filePath)
    expect(result.get('@TestAccount')?.get('NA Megaserver')).toBe(810)
  })

  it('keeps NA/EU CP totals separate for the same account', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["championPoints"]=300},` +
        `["EU Megaserver"]={["championPoints"]=1450}` +
        `}}}}`
    )
    const result = await extractChampionPoints(filePath)
    expect(result.get('@TestAccount')?.get('NA Megaserver')).toBe(300)
    expect(result.get('@TestAccount')?.get('EU Megaserver')).toBe(1450)
  })

  it('keeps separate accounts apart', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={` +
        `["@AccountOne"]={["$AccountWide"]={["NA Megaserver"]={["championPoints"]=100}}},` +
        `["@AccountTwo"]={["$AccountWide"]={["NA Megaserver"]={["championPoints"]=900}}}` +
        `}}`
    )
    const result = await extractChampionPoints(filePath)
    expect(result.get('@AccountOne')?.get('NA Megaserver')).toBe(100)
    expect(result.get('@AccountTwo')?.get('NA Megaserver')).toBe(900)
  })

  it('ignores non-realm keys under $AccountWide (e.g. "version")', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["version"]=1,["NA Megaserver"]={["championPoints"]=810}` +
        `}}}}`
    )
    const result = await extractChampionPoints(filePath)
    expect(result.get('@TestAccount')?.has('version')).toBe(false)
    expect(result.get('@TestAccount')?.size).toBe(1)
  })

  it('skips a realm bucket with no .championPoints key yet', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["allianceRank"]={["rank"]=23}}` +
        `}}}}}`
    )
    const result = await extractChampionPoints(filePath)
    expect(result.has('@TestAccount')).toBe(false)
  })

  it('returns an empty map when the file has no $AccountWide data', async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', `WhatShouldIDoDataCollectorVars={}`)
    const result = await extractChampionPoints(filePath)
    expect(result.size).toBe(0)
  })
})
