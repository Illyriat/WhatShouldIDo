import { describe, it, expect, afterEach } from 'vitest'
import { extractRidingStatus } from '../../../src/main/eso/ridingExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

const NOW = new Date(5000 * 1000) // nowSeconds = 5000

describe('extractRidingStatus', () => {
  it('maxed on all three stats -> ridingMaxed true, nothing left to train', async () => {
    const filePath = await fixture.write(
      'DailyCraftStatus.lua',
      `DailyCraftStatusVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["ridingStats"]={["s1"]=60,["max1"]=60,["s2"]=60,["max2"]=60,["s3"]=60,["max3"]=60}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1001')).toEqual({ ridingMaxed: true, readyToTrainRiding: false })
  })

  it('not maxed and cooldown already elapsed -> ready to train', async () => {
    const filePath = await fixture.write(
      'DailyCraftStatus.lua',
      `DailyCraftStatusVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1002"]={["ridingStats"]={["s1"]=10,["max1"]=60,["s2"]=10,["max2"]=60,["s3"]=10,["max3"]=60,["timeToTrain"]=1}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1002')).toEqual({ ridingMaxed: false, readyToTrainRiding: true })
  })

  it('not maxed and cooldown still in the future -> not ready', async () => {
    const filePath = await fixture.write(
      'DailyCraftStatus.lua',
      `DailyCraftStatusVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1003"]={["ridingStats"]={["s1"]=10,["max1"]=60,["s2"]=10,["max2"]=60,["s3"]=10,["max3"]=60,["timeToTrain"]=9999999999}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1003')).toEqual({ ridingMaxed: false, readyToTrainRiding: false })
  })

  it('never trained yet (no timeToTrain field) -> ready to train', async () => {
    const filePath = await fixture.write(
      'DailyCraftStatus.lua',
      `DailyCraftStatusVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1004"]={["ridingStats"]={["s1"]=0,["max1"]=60,["s2"]=0,["max2"]=60,["s3"]=0,["max3"]=60}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1004')).toEqual({ ridingMaxed: false, readyToTrainRiding: true })
  })

  it('ignores non-character keys under a realm bucket (e.g. "version")', async () => {
    const filePath = await fixture.write(
      'DailyCraftStatus.lua',
      `DailyCraftStatusVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["ridingStats"]={["s1"]=60,["max1"]=60,["s2"]=60,["max2"]=60,["s3"]=60,["max3"]=60}},` +
        `["version"]=1` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.has('version')).toBe(false)
    expect(result.size).toBe(1)
  })
})
