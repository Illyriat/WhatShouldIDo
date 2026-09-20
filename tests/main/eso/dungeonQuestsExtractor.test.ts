import { describe, it, expect, afterEach } from 'vitest'
import { extractCompletedDungeonQuests } from '../../../src/main/eso/dungeonQuestsExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('extractCompletedDungeonQuests', () => {
  it('reads completed dungeon keys for a character, filtering out incomplete (0) entries', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["completedDungeonQuests"]={["BC1"]=1,["EH1"]=1,["WS1"]=0}}` +
        `}}}}}`
    )
    const result = await extractCompletedDungeonQuests(filePath)
    expect(result.get('1001')?.sort()).toEqual(['BC1', 'EH1'])
  })

  it('joins multiple characters across realm buckets', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["1001"]={["completedDungeonQuests"]={["BC1"]=1}}},` +
        `["EU Megaserver"]={["2001"]={["completedDungeonQuests"]={["TC"]=1}}}` +
        `}}}}`
    )
    const result = await extractCompletedDungeonQuests(filePath)
    expect(result.get('1001')).toEqual(['BC1'])
    expect(result.get('2001')).toEqual(['TC'])
  })

  it('gives an empty list (not undefined) for a character with no completed dungeons yet', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["completedDungeonQuests"]={}}` +
        `}}}}}`
    )
    const result = await extractCompletedDungeonQuests(filePath)
    expect(result.get('1001')).toEqual([])
  })

  it('ignores non-character keys under a realm bucket (e.g. "version")', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
        `["1001"]={["completedDungeonQuests"]={["BC1"]=1}},` +
        `["version"]=1` +
        `}}}}}`
    )
    const result = await extractCompletedDungeonQuests(filePath)
    expect(result.has('version')).toBe(false)
    expect(result.size).toBe(1)
  })

  it('returns an empty map when the file has no $AccountWide data', async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', `WhatShouldIDoDataCollectorVars={}`)
    expect((await extractCompletedDungeonQuests(filePath)).size).toBe(0)
  })
})
