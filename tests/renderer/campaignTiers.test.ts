import { describe, it, expect } from 'vitest'
import { hasCampaignEnded } from '../../src/renderer/src/pages/CampaignTiersPage'
import type { CampaignTierStatus } from '../../src/shared/types'

const status = (endsAt: number): CampaignTierStatus => ({
  campaignId: 95,
  campaignName: 'Gray Host',
  tier: 2,
  progress: 1500,
  nextTierTotal: 4000,
  endsAt
})

describe('hasCampaignEnded', () => {
  const now = 1_800_000_000_000 // ms

  it('is false while the campaign is still running', () => {
    expect(hasCampaignEnded(status(now / 1000 + 60), now)).toBe(false)
  })

  it('is true once the end time has passed', () => {
    expect(hasCampaignEnded(status(now / 1000 - 60), now)).toBe(true)
  })

  it('is false when the end time is unknown (0)', () => {
    expect(hasCampaignEnded(status(0), now)).toBe(false)
  })
})
