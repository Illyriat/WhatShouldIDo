import { describe, it, expect, afterEach } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { buildAccounts } from '../../../src/main/eso/accountBuilder'

const tmpDirs: string[] = []
afterEach(async () => {
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

/**
 * Builds a fake `<Documents>/Elder Scrolls Online/live/SavedVariables/` folder with
 * the three addons' files, matching the real on-disk layout `findSavedVariablesFiles`
 * scans - this is what makes it an integration test of the whole main/eso pipeline
 * (locator + parser + all three extractors + the merge in buildAccounts) rather than
 * a unit test of any one piece.
 */
async function writeFixtureDocuments(): Promise<string> {
  const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-docs-'))
  tmpDirs.push(documentsDir)
  const savedVarsDir = join(documentsDir, 'Elder Scrolls Online', 'live', 'SavedVariables')
  await mkdir(savedVarsDir, { recursive: true })

  // Alice (NA) and Bob live in the default bucket; Carol is under a nested EU bucket -
  // see uspfExtractor's doc comment for why that nesting is structured this way.
  await writeFile(
    join(savedVarsDir, 'USPF.lua'),
    `USPF_Settings={["Default"]={["@TestAccount"]={` +
      `["charInfo"]={{["charId"]="1001",["charName"]="Alice"},{["charId"]="1002",["charName"]="Bob"}},` +
      `["ptsData"]={["1001"]={["GD"]={["BC1"]=1}},["1002"]={["GD"]={}}},` +
      `["EU Megaserver"]={` +
      `["charInfo"]={{["charId"]="2001",["charName"]="Carol"}},` +
      `["ptsData"]={["2001"]={["GD"]={["BC1"]=1,["EH1"]=1}}}` +
      `}}}}`,
    'utf-8'
  )

  // Deliberately omits Bob, so buildAccounts must fall back to "Unknown Server" for him.
  await writeFile(
    join(savedVarsDir, 'SkillLines.lua'),
    `SkillLinesSavedVars={["Default"]={["@TestAccount"]={["$AccountWide"]={` +
      `["NA Megaserver"]={["@TestAccount"]={["Alice"]={}}},` +
      `["EU Megaserver"]={["@TestAccount"]={["Carol"]={}}}` +
      `}}}}`,
    'utf-8'
  )

  // Only Alice (maxed) has riding data - Bob and Carol must fall back to "no data yet".
  await writeFile(
    join(savedVarsDir, 'DailyCraftStatus.lua'),
    `DailyCraftStatusVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={` +
      `["1001"]={["ridingStats"]={["s1"]=60,["max1"]=60,["s2"]=60,["max2"]=60,["s3"]=60,["max3"]=60}}` +
      `}}}}}`,
    'utf-8'
  )

  return documentsDir
}

describe('buildAccounts', () => {
  it('joins USPF quest completion, SkillLines server labels and riding status by character, with correct fallbacks', async () => {
    const documentsDir = await writeFixtureDocuments()

    const accounts = await buildAccounts(documentsDir)

    expect(accounts).toHaveLength(1)
    expect(accounts[0].accountName).toBe('@TestAccount')
    expect(accounts[0].characters).toEqual([
      {
        charId: '1001',
        charName: 'Alice',
        server: 'NA Megaserver',
        completedDungeonKeys: ['BC1'],
        ridingMaxed: true,
        readyToTrainRiding: false
      },
      {
        charId: '1002',
        charName: 'Bob',
        server: 'Unknown Server', // not present in the SkillLines fixture
        completedDungeonKeys: [],
        ridingMaxed: false,
        readyToTrainRiding: false // not present in the DailyCraftStatus fixture
      },
      {
        charId: '2001',
        charName: 'Carol',
        server: 'EU Megaserver',
        completedDungeonKeys: ['BC1', 'EH1'],
        ridingMaxed: false,
        readyToTrainRiding: false
      }
    ])
  })

  it('returns an empty list when there is no ESO data at the given path', async () => {
    const emptyDir = await mkdtemp(join(tmpdir(), 'wsid-empty-'))
    tmpDirs.push(emptyDir)
    expect(await buildAccounts(emptyDir)).toEqual([])
  })
})
