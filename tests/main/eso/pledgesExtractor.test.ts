import { describe, it, expect, afterEach } from 'vitest'
import { extractPledgesByRealm } from '../../../src/main/eso/pledgesExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

function pledgesArray(days: Array<{ esoDay: string; base1: number; base2: number; dlc1: number }>): string {
  const entries = days.map(
    (d) =>
      `{["esoDay"]="${d.esoDay}",` +
      `["base1"]={["zoneId"]=${d.base1},["name"]="Base1 Dungeon"},` +
      `["base2"]={["zoneId"]=${d.base2},["name"]="Base2 Dungeon"},` +
      `["dlc1"]={["zoneId"]=${d.dlc1},["name"]="Dlc1 Dungeon"}}`
  )
  return `{${entries.join(',')}}`
}

describe('extractPledgesByRealm', () => {
  it("resolves today's rotation and upcoming days for a realm", async () => {
    const days = [
      { esoDay: '2026-09-20', base1: 380, base2: 176, dlc1: 678 }, // BC1, CA1, ICP
      { esoDay: '2026-09-21', base1: 935, base2: 681, dlc1: 843 } // BC2, CA2, RM
    ]
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["pledges"]=${pledgesArray(days)}` +
        `}}}}}`
    )

    const result = await extractPledgesByRealm(filePath)
    const na = result.get('NA Megaserver')
    expect(na).toBeDefined()
    expect(na?.esoDay).toBe('2026-09-20')
    expect(na?.pledges.map((p) => p.dungeon?.key)).toEqual(['BC1', 'CA1', 'ICP'])
    expect(na?.pledges.map((p) => p.master.name)).toEqual([
      'Maj al-Ragath',
      'Glirion the Redbeard',
      'Urgarlag Chief-bane'
    ])
    expect(na?.upcoming).toHaveLength(1)
    expect(na?.upcoming[0].esoDay).toBe('2026-09-21')
    expect(na?.upcoming[0].pledges.map((p) => p.dungeon?.key)).toEqual(['BC2', 'CA2', 'RM'])
  })

  it('keeps NA and EU rotations separate for the same account', async () => {
    const naDays = [{ esoDay: '2026-09-20', base1: 380, base2: 176, dlc1: 678 }]
    const euDays = [{ esoDay: '2026-09-20', base1: 935, base2: 681, dlc1: 843 }]
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["pledges"]=${pledgesArray(naDays)}},` +
        `["EU Megaserver"]={["pledges"]=${pledgesArray(euDays)}}` +
        `}}}}`
    )

    const result = await extractPledgesByRealm(filePath)
    expect(result.get('NA Megaserver')?.pledges.map((p) => p.dungeon?.key)).toEqual(['BC1', 'CA1', 'ICP'])
    expect(result.get('EU Megaserver')?.pledges.map((p) => p.dungeon?.key)).toEqual(['BC2', 'CA2', 'RM'])
  })

  it('leaves dungeon null (without throwing) for a zoneId this app does not recognize', async () => {
    const days = [{ esoDay: '2026-09-20', base1: 999999, base2: 176, dlc1: 678 }]
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["pledges"]=${pledgesArray(days)}` +
        `}}}}}`
    )

    const result = await extractPledgesByRealm(filePath)
    const pledge = result.get('NA Megaserver')?.pledges[0]
    expect(pledge?.dungeon).toBeNull()
    expect(pledge?.dungeonName).toBe('Base1 Dungeon')
  })

  it('skips a realm bucket with no .pledges key yet', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["championPoints"]=810` +
        `}}}}}`
    )

    const result = await extractPledgesByRealm(filePath)
    expect(result.has('NA Megaserver')).toBe(false)
  })

  it('returns an empty map when the file has no $AccountWide data', async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', `WhatShouldIDoDataCollectorVars={}`)
    const result = await extractPledgesByRealm(filePath)
    expect(result.size).toBe(0)
  })
})
