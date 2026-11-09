import { describe, it, expect, afterEach } from 'vitest'
import { extractCampaignTiers } from '../../../src/main/eso/campaignTierExtractor'
import { createLuaFixtureWriter } from './testLuaFixture'

const fixture = createLuaFixtureWriter()
afterEach(fixture.cleanup)

const wrap = (realmBody: string): string =>
  `WhatShouldIDoDataCollectorVars={["Default"]={["@TestAccount"]={["$AccountWide"]={["NA Megaserver"]={${realmBody}}}}}}`

const GRAY_HOST =
  `["campaignTier"]={["campaignId"]=95,["campaignName"]="Gray Host",["sequenceId"]=7,["tier"]=2,` +
  `["progress"]=1500,["nextTierTotal"]=4000,["endsAt"]=1800000000,["recordedAt"]=1700000000}`

describe('extractCampaignTiers', () => {
  it("reads a character's home campaign tier, progress and end time", async () => {
    const filePath = await fixture.write('WhatShouldIDoDataCollector.lua', wrap(`["1001"]={${GRAY_HOST}}`))

    const result = await extractCampaignTiers(filePath)

    expect(result.get('1001')).toEqual({
      campaignId: 95,
      campaignName: 'Gray Host',
      tier: 2,
      progress: 1500,
      nextTierTotal: 4000,
      endsAt: 1800000000
    })
  })

  it('leaves out characters with no campaign data', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      wrap(`["1001"]={${GRAY_HOST}},["1002"]={["name"]="Bob"}`)
    )

    const result = await extractCampaignTiers(filePath)

    expect(result.has('1001')).toBe(true)
    expect(result.has('1002')).toBe(false)
  })

  it('skips an entry with a missing or malformed field rather than guessing', async () => {
    const filePath = await fixture.write(
      'WhatShouldIDoDataCollector.lua',
      wrap(`["1001"]={["campaignTier"]={["campaignId"]=95,["campaignName"]="Gray Host",["tier"]="two"}}`)
    )

    const result = await extractCampaignTiers(filePath)

    expect(result.size).toBe(0)
  })
})
