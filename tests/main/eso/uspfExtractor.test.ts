import { describe, it, expect, afterEach } from 'vitest'
import { extractAccountsFromUspf } from '../../../src/main/eso/uspfExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

describe('extractAccountsFromUspf', () => {
  it('merges characters from the default bucket and a nested named realm bucket', async () => {
    // Mirrors real USPF.lua structure: the default ("NA") bucket sits directly on the
    // account, while any other realm (e.g. "EU Megaserver") is nested one level deeper
    // as a sibling of that same account's own charInfo/ptsData - not a top-level sibling
    // of the account itself. See findRealmBuckets's doc comment for why this matters.
    const filePath = await fixture.write(
      'USPF.lua',
      `USPF_Settings={["Default"]={["@TestAccount"]={` +
        `["charInfo"]={{["charId"]="1001",["charName"]="Alice"},{["charId"]="1002",["charName"]="Bob"}},` +
        `["ptsData"]={["1001"]={["GD"]={["BC1"]=1,["BC2"]=0}},["1002"]={["GD"]={["BC1"]=0}}},` +
        `["EU Megaserver"]={` +
        `["charInfo"]={{["charId"]="2001",["charName"]="Carol"}},` +
        `["ptsData"]={["2001"]={["GD"]={["BC1"]=1,["EH1"]=1}}}` +
        `}}}}`
    )

    const accounts = await extractAccountsFromUspf(filePath)

    expect(accounts).toHaveLength(1)
    expect(accounts[0].accountName).toBe('@TestAccount')
    expect(accounts[0].characters).toEqual([
      { charId: '1001', charName: 'Alice', completedDungeonKeys: ['BC1'] },
      { charId: '1002', charName: 'Bob', completedDungeonKeys: [] },
      { charId: '2001', charName: 'Carol', completedDungeonKeys: ['BC1', 'EH1'] }
    ])
  })

  it('only treats GD keys with value 1 as completed', async () => {
    const filePath = await fixture.write(
      'USPF.lua',
      `USPF_Settings={["Default"]={["@TestAccount"]={` +
        `["charInfo"]={{["charId"]="1001",["charName"]="Alice"}},` +
        `["ptsData"]={["1001"]={["GD"]={["BC1"]=1,["BC2"]=0,["EH1"]=1}}}` +
        `}}}`
    )
    const accounts = await extractAccountsFromUspf(filePath)
    expect(accounts[0].characters[0].completedDungeonKeys.sort()).toEqual(['BC1', 'EH1'])
  })

  it('ignores account keys that are not @-prefixed', async () => {
    const filePath = await fixture.write(
      'USPF.lua',
      `USPF_Settings={["Default"]={["version"]=1,["@TestAccount"]={` +
        `["charInfo"]={{["charId"]="1001",["charName"]="Alice"}},` +
        `["ptsData"]={["1001"]={["GD"]={}}}` +
        `}}}`
    )
    const accounts = await extractAccountsFromUspf(filePath)
    expect(accounts.map((a) => a.accountName)).toEqual(['@TestAccount'])
  })

  it('returns an empty list when the file has no Default profile', async () => {
    const filePath = await fixture.write('USPF.lua', `USPF_Settings={["NotDefault"]={}}`)
    expect(await extractAccountsFromUspf(filePath)).toEqual([])
  })
})
