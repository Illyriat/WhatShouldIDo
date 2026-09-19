import { describe, it, expect, afterEach } from 'vitest'
import { extractCharacterWealth, extractBankWealth } from '../../../src/main/eso/wealthExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('extractCharacterWealth', () => {
  it('reads a character carried currency amounts', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["wealth"]={["gold"]=15000,["alliancePoints"]=800,["telVarStones"]=50,["writVouchers"]=10}}` +
        `}}}}}`
    )
    const result = await extractCharacterWealth(filePath)
    expect(result.get('1001')).toEqual({ gold: 15000, alliancePoints: 800, telVarStones: 50, writVouchers: 10 })
  })

  it('joins multiple characters across realm buckets', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["1001"]={["wealth"]={["gold"]=100,["alliancePoints"]=1,["telVarStones"]=0,["writVouchers"]=0}}},` +
        `["EU Megaserver"]={["2001"]={["wealth"]={["gold"]=200,["alliancePoints"]=2,["telVarStones"]=0,["writVouchers"]=0}}}` +
        `}}}}`
    )
    const result = await extractCharacterWealth(filePath)
    expect(result.get('1001')?.gold).toBe(100)
    expect(result.get('2001')?.gold).toBe(200)
  })

  it('ignores non-character keys under a realm bucket (e.g. "version")', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["wealth"]={["gold"]=1,["alliancePoints"]=1,["telVarStones"]=1,["writVouchers"]=1}},` +
        `["version"]=1` +
        `}}}}}`
    )
    const result = await extractCharacterWealth(filePath)
    expect(result.has('version')).toBe(false)
    expect(result.size).toBe(1)
  })

  it('skips a character with no .wealth key yet', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["allianceRank"]={["rank"]=23}}` +
        `}}}}}`
    )
    const result = await extractCharacterWealth(filePath)
    expect(result.size).toBe(0)
  })

  it('skips a character entry with a missing/incomplete field', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["wealth"]={["gold"]=1,["alliancePoints"]=1}}` +
        `}}}}}`
    )
    const result = await extractCharacterWealth(filePath)
    expect(result.size).toBe(0)
  })

  it('returns an empty map when the file has no $AccountWide data', async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', `WhatShouldIDoDataCollectorVars={}`)
    const result = await extractCharacterWealth(filePath)
    expect(result.size).toBe(0)
  })
})

describe('extractBankWealth', () => {
  it('reads the account-wide bank total for a realm', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["bankWealth"]={["gold"]=500000,["alliancePoints"]=12000,["telVarStones"]=3000,["writVouchers"]=200}` +
        `}}}}}`
    )
    const result = await extractBankWealth(filePath)
    expect(result.get('@TestAccount')?.get('NA Megaserver')).toEqual({
      gold: 500000,
      alliancePoints: 12000,
      telVarStones: 3000,
      writVouchers: 200
    })
  })

  it('keeps NA/EU bank totals separate for the same account', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["bankWealth"]={["gold"]=300,["alliancePoints"]=1,["telVarStones"]=1,["writVouchers"]=1}},` +
        `["EU Megaserver"]={["bankWealth"]={["gold"]=1450,["alliancePoints"]=2,["telVarStones"]=2,["writVouchers"]=2}}` +
        `}}}}`
    )
    const result = await extractBankWealth(filePath)
    expect(result.get('@TestAccount')?.get('NA Megaserver')?.gold).toBe(300)
    expect(result.get('@TestAccount')?.get('EU Megaserver')?.gold).toBe(1450)
  })

  it('keeps separate accounts apart', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={` +
        `["@AccountOne"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["bankWealth"]={["gold"]=100,["alliancePoints"]=1,["telVarStones"]=1,["writVouchers"]=1}}}},` +
        `["@AccountTwo"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["bankWealth"]={["gold"]=900,["alliancePoints"]=2,["telVarStones"]=2,["writVouchers"]=2}}}}` +
        `}}`
    )
    const result = await extractBankWealth(filePath)
    expect(result.get('@AccountOne')?.get('NA Megaserver')?.gold).toBe(100)
    expect(result.get('@AccountTwo')?.get('NA Megaserver')?.gold).toBe(900)
  })

  it('ignores non-realm keys under $AccountWide (e.g. "version")', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["version"]=1,["NA Megaserver"]={["bankWealth"]={["gold"]=810,["alliancePoints"]=1,["telVarStones"]=1,["writVouchers"]=1}}` +
        `}}}}`
    )
    const result = await extractBankWealth(filePath)
    expect(result.get('@TestAccount')?.has('version')).toBe(false)
    expect(result.get('@TestAccount')?.size).toBe(1)
  })

  it('skips a realm bucket with no .bankWealth key yet', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["championPoints"]=810` +
        `}}}}}`
    )
    const result = await extractBankWealth(filePath)
    expect(result.has('@TestAccount')).toBe(false)
  })

  it('returns an empty map when the file has no $AccountWide data', async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', `WhatShouldIDoDataCollectorVars={}`)
    const result = await extractBankWealth(filePath)
    expect(result.size).toBe(0)
  })
})
