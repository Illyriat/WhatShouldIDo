import { describe, it, expect, afterEach } from 'vitest'
import { extractRidingStatus } from '../../../src/main/eso/ridingExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

const NOW = new Date(5000 * 1000) // nowSeconds = 5000

describe('extractRidingStatus', () => {
  it('maxed on all three stats -> ridingMaxed true, nothing left to train', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["ridingStats"]={["capacity"]=60,["capacityMax"]=60,["stamina"]=60,["staminaMax"]=60,["speed"]=60,["speedMax"]=60}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1001')).toEqual({ ridingMaxed: true, readyToTrainRiding: false })
  })

  it('not maxed and training slot already available -> ready to train', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1002"]={["ridingStats"]={["capacity"]=10,["capacityMax"]=60,["stamina"]=10,["staminaMax"]=60,["speed"]=10,["speedMax"]=60,["trainableAt"]=1}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1002')).toEqual({ ridingMaxed: false, readyToTrainRiding: true })
  })

  it('not maxed and next training slot is still in the future -> not ready', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1003"]={["ridingStats"]={["capacity"]=10,["capacityMax"]=60,["stamina"]=10,["staminaMax"]=60,["speed"]=10,["speedMax"]=60,["trainableAt"]=9999999999}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1003')).toEqual({ ridingMaxed: false, readyToTrainRiding: false })
  })

  it('no trainableAt field (data from before the addon recorded it) -> ready to train', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1004"]={["ridingStats"]={["capacity"]=0,["capacityMax"]=60,["stamina"]=0,["staminaMax"]=60,["speed"]=0,["speedMax"]=60}}` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.get('1004')).toEqual({ ridingMaxed: false, readyToTrainRiding: true })
  })

  it('ignores non-character keys under a realm bucket (e.g. "version")', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["ridingStats"]={["capacity"]=60,["capacityMax"]=60,["stamina"]=60,["staminaMax"]=60,["speed"]=60,["speedMax"]=60}},` +
        `["version"]=1` +
        `}}}}}`
    )
    const result = await extractRidingStatus(filePath, NOW)
    expect(result.has('version')).toBe(false)
    expect(result.size).toBe(1)
  })
})
