import { parseSavedVariables } from './luaSavedVarsParser'
import type { AllianceRankStatus } from '@shared/types'

type PlainObject = Record<string, unknown>

function asPlainObject(value: unknown): PlainObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PlainObject
  }
  return null
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' ? value : null
}

// Realm-bucket keys under $AccountWide that aren't character ids.
const NON_CHAR_KEYS = new Set(['version'])

/**
 * Reads each character's Alliance Rank / AP progress from WhatShouldIDoDataCollector.lua (a
 * purpose-built companion addon - see the WhatShouldIDoDataCollector repo). Layout mirrors
 * DailyCraftStatus: `["Default"]["@Account"]["$AccountWide"]["<Realm> Megaserver"][charId]`,
 * keyed directly by charId with no character-name list, so callers join onto the known
 * character list by charId (same as ridingExtractor). Alliance rank data lives under its
 * own `.allianceRank` key on each character entry, since the addon is a generic
 * per-character data collector meant to grow more features (siblings of `.allianceRank`)
 * over time without renaming or re-keying.
 *
 * The addon reads `rank`/`currentAP`/`apForMaxRank` live from the game's own AvA rank API
 * (GetUnitAvARank, GetUnitAvARankPoints, GetNumPointsNeededForAvARank) rather than us
 * hardcoding the AP-per-rank curve, so this stays correct across any future rebalance.
 */
export async function extractAllianceRankStatus(filePath: string): Promise<Map<string, AllianceRankStatus>> {
  const result = new Map<string, AllianceRankStatus>()

  const parsed = await parseSavedVariables(filePath, 'WhatShouldIDoDataCollectorVars')
  const defaultProfile = asPlainObject(parsed) && asPlainObject((parsed as PlainObject)['Default'])
  if (!defaultProfile) return result

  for (const accountValue of Object.values(defaultProfile)) {
    const accountObject = asPlainObject(accountValue)
    const accountWide = asPlainObject(accountObject?.['$AccountWide'])
    if (!accountWide) continue

    for (const realmValue of Object.values(accountWide)) {
      const realmObject = asPlainObject(realmValue)
      if (!realmObject) continue

      for (const [charId, charValue] of Object.entries(realmObject)) {
        if (NON_CHAR_KEYS.has(charId) || !/^\d+$/.test(charId)) continue
        const charObject = asPlainObject(charValue)
        const allianceRank = asPlainObject(charObject?.['allianceRank'])
        if (!allianceRank) continue

        const rank = asNumber(allianceRank['rank'])
        const subRank = asNumber(allianceRank['subRank'])
        const currentAP = asNumber(allianceRank['currentAP'])
        const apForMaxRank = asNumber(allianceRank['apForMaxRank'])
        const currentRankStartAP = asNumber(allianceRank['currentRankStartAP'])
        const currentRankEndAP = asNumber(allianceRank['currentRankEndAP'])
        if (
          rank === null ||
          subRank === null ||
          currentAP === null ||
          apForMaxRank === null ||
          currentRankStartAP === null ||
          currentRankEndAP === null
        ) {
          continue
        }

        result.set(charId, { rank, subRank, currentAP, apForMaxRank, currentRankStartAP, currentRankEndAP })
      }
    }
  }

  return result
}
