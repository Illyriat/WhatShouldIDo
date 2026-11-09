import { asNumber, asPlainObject, isCharId, readDefaultProfile } from './collectorSavedVars'
import type { CampaignTierStatus } from '@shared/types'

/**
 * Reads each character's home campaign reward tier from WhatShouldIDoDataCollector.lua's
 * `.campaignTier` (see the addon's data/CampaignTier.lua). The addon only records it once
 * the game has loaded the campaign leaderboard data, and clears it when the character has
 * no home campaign, so a missing entry means "nothing to show".
 */
export async function extractCampaignTiers(filePath: string): Promise<Map<string, CampaignTierStatus>> {
  const result = new Map<string, CampaignTierStatus>()

  const defaultProfile = await readDefaultProfile(filePath)
  if (!defaultProfile) return result

  for (const accountValue of Object.values(defaultProfile)) {
    const accountWide = asPlainObject(asPlainObject(accountValue)?.['$AccountWide'])
    if (!accountWide) continue

    for (const realmValue of Object.values(accountWide)) {
      const realmObject = asPlainObject(realmValue)
      if (!realmObject) continue

      for (const [charId, charValue] of Object.entries(realmObject)) {
        if (!isCharId(charId)) continue
        const campaignTier = asPlainObject(asPlainObject(charValue)?.['campaignTier'])
        if (!campaignTier) continue

        const campaignId = asNumber(campaignTier['campaignId'])
        const campaignName = campaignTier['campaignName']
        const tier = asNumber(campaignTier['tier'])
        const progress = asNumber(campaignTier['progress'])
        const nextTierTotal = asNumber(campaignTier['nextTierTotal'])
        const endsAt = asNumber(campaignTier['endsAt'])
        if (
          campaignId === null ||
          typeof campaignName !== 'string' ||
          tier === null ||
          progress === null ||
          nextTierTotal === null ||
          endsAt === null
        ) {
          continue
        }

        result.set(charId, { campaignId, campaignName, tier, progress, nextTierTotal, endsAt })
      }
    }
  }

  return result
}
