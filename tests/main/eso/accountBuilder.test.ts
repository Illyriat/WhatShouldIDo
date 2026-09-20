import { describe, it, expect, afterEach } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { buildAccounts } from '../../../src/main/eso/accountBuilder'

const tmpDirs: string[] = []
afterEach(async () => {
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

// Writes a fake Documents/Elder Scrolls Online/live/SavedVariables/ folder with the
// addon's file in the real on-disk layout, so this exercises the whole pipeline end to
// end: locator, parser, every extractor, and the merge in buildAccounts.
async function writeFixtureDocuments(): Promise<string> {
  const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-docs-'))
  tmpDirs.push(documentsDir)
  const savedVarsDir = join(documentsDir, 'Elder Scrolls Online', 'live', 'SavedVariables')
  await mkdir(savedVarsDir, { recursive: true })

  // Alice and Bob are on NA; Carol is on EU. All three, plus their dungeon-quest
  // completion, riding status, Alliance Rank, Wealth, Champion Points and bank totals,
  // come from a single WhatShouldIDoDataCollector.lua fixture - it's the app's sole
  // addon dependency now (no more USPF/SkillLines/DailyCraftStatus). Only Alice has
  // riding data (maxed); Bob and Carol fall back to "no data yet".
  await writeFile(
    join(savedVarsDir, 'WhatShouldIDoDataCollector.lua'),
    `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
      `["NA Megaserver"]={` +
      `["championPoints"]=810,` +
      `["bankWealth"]={["gold"]=500000,["alliancePoints"]=12000,["telVarStones"]=3000,["writVouchers"]=200},` +
      `["1001"]={["name"]="Alice",` +
      `["allianceRank"]={["rank"]=23,["subRank"]=1,["currentAP"]=6200000,["apForMaxRank"]=64680000,` +
      `["currentRankStartAP"]=6072000,["currentRankEndAP"]=6918400},` +
      `["wealth"]={["gold"]=15000,["alliancePoints"]=800,["telVarStones"]=50,["writVouchers"]=10},` +
      `["completedDungeonQuests"]={["BC1"]=1},` +
      `["ridingStats"]={["capacity"]=60,["capacityMax"]=60,["stamina"]=60,["staminaMax"]=60,["speed"]=60,["speedMax"]=60}},` +
      `["1002"]={["name"]="Bob",["completedDungeonQuests"]={}}` +
      `},` +
      `["EU Megaserver"]={` +
      `["2001"]={["name"]="Carol",["completedDungeonQuests"]={["BC1"]=1,["EH1"]=1}}` +
      `}}}}}`,
    'utf-8'
  )

  return documentsDir
}

describe('buildAccounts', () => {
  it('joins the character list, dungeon-quest completion, server labels and riding status by character, with correct fallbacks', async () => {
    const documentsDir = await writeFixtureDocuments()

    const accounts = await buildAccounts(documentsDir)

    expect(accounts).toHaveLength(1)
    expect(accounts[0].accountName).toBe('@TestAccount')
    // Account-wide per realm - NA has data, EU (Carol's realm) doesn't yet.
    expect(accounts[0].championPoints).toEqual({ 'NA Megaserver': 810 })
    expect(accounts[0].bankWealth).toEqual({
      'NA Megaserver': { gold: 500000, alliancePoints: 12000, telVarStones: 3000, writVouchers: 200 }
    })
    expect(accounts[0].characters).toEqual([
      {
        charId: '1001',
        charName: 'Alice',
        server: 'NA Megaserver',
        completedDungeonKeys: ['BC1'],
        ridingMaxed: true,
        readyToTrainRiding: false,
        allianceRank: {
          rank: 23,
          subRank: 1,
          currentAP: 6200000,
          apForMaxRank: 64680000,
          currentRankStartAP: 6072000,
          currentRankEndAP: 6918400
        },
        wealth: { gold: 15000, alliancePoints: 800, telVarStones: 50, writVouchers: 10 }
      },
      {
        charId: '1002',
        charName: 'Bob',
        server: 'NA Megaserver',
        completedDungeonKeys: [],
        ridingMaxed: false,
        readyToTrainRiding: false, // no .ridingStats in the fixture for Bob
        allianceRank: null,
        wealth: null
      },
      {
        charId: '2001',
        charName: 'Carol',
        server: 'EU Megaserver',
        completedDungeonKeys: ['BC1', 'EH1'],
        ridingMaxed: false,
        readyToTrainRiding: false,
        allianceRank: null,
        wealth: null
      }
    ])
  })

  it('skips a character bucket that has no name yet (addon data collected before an upgrade)', async () => {
    const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-docs-'))
    tmpDirs.push(documentsDir)
    const savedVarsDir = join(documentsDir, 'Elder Scrolls Online', 'live', 'SavedVariables')
    await mkdir(savedVarsDir, { recursive: true })

    await writeFile(
      join(savedVarsDir, 'WhatShouldIDoDataCollector.lua'),
      `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
        `["NA Megaserver"]={["1001"]={["allianceRank"]={["rank"]=1,["subRank"]=1,["currentAP"]=0,` +
        `["apForMaxRank"]=64680000,["currentRankStartAP"]=0,["currentRankEndAP"]=700}}}` +
        `}}}}`,
      'utf-8'
    )

    expect(await buildAccounts(documentsDir)).toEqual([])
  })

  it('returns an empty list when there is no ESO data at the given path', async () => {
    const emptyDir = await mkdtemp(join(tmpdir(), 'wsid-empty-'))
    tmpDirs.push(emptyDir)
    expect(await buildAccounts(emptyDir)).toEqual([])
  })
})
