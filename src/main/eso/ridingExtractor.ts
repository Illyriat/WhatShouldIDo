import { parseSavedVariables } from './luaSavedVarsParser'

type PlainObject = Record<string, unknown>

function asPlainObject(value: unknown): PlainObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PlainObject
  }
  return null
}

export interface RidingStatus {
  ridingMaxed: boolean
  readyToTrainRiding: boolean
}

// Realm-bucket keys under $AccountWide that aren't character ids.
const NON_CHAR_KEYS = new Set(['version', 'lowStockHist'])

function computeStatus(ridingStats: PlainObject, nowSeconds: number): RidingStatus {
  const s1 = ridingStats['s1']
  const max1 = ridingStats['max1']
  const s2 = ridingStats['s2']
  const max2 = ridingStats['max2']
  const s3 = ridingStats['s3']
  const max3 = ridingStats['max3']

  const maxed = s1 === max1 && s2 === max2 && s3 === max3
  if (maxed) return { ridingMaxed: true, readyToTrainRiding: false }

  const timeToTrain = ridingStats['timeToTrain']
  const canTrain = typeof timeToTrain !== 'number' || timeToTrain <= 0 || timeToTrain <= nowSeconds
  return { ridingMaxed: false, readyToTrainRiding: canTrain }
}

/**
 * Reads DailyCraftStatus.lua (an already-installed addon, unrelated to USPF) for each
 * character's riding-training status. `$AccountWide` holds realm buckets (e.g.
 * "NA Megaserver"/"EU Megaserver") each keyed by charId directly - mirrors USPF's/
 * SkillLines' nesting pattern but without a charInfo list, so this is joined onto
 * existing characters by charId elsewhere rather than used as a name source.
 * Training itself has one shared daily cooldown per character (not per stat) - see
 * DailyCraftStatus's own AltsModule.lua `DCS_canTrainAltRiding` for the source logic
 * this mirrors: maxed on all 3 stats -> nothing to do ever; otherwise compare
 * `timeToTrain` (unix seconds) against now.
 */
export async function extractRidingStatus(
  filePath: string,
  now: Date = new Date()
): Promise<Map<string, RidingStatus>> {
  const result = new Map<string, RidingStatus>()
  const nowSeconds = Math.floor(now.getTime() / 1000)

  const parsed = await parseSavedVariables(filePath, 'DailyCraftStatusVars')
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
        const ridingStats = asPlainObject(charObject?.['ridingStats'])
        if (!ridingStats) continue

        result.set(charId, computeStatus(ridingStats, nowSeconds))
      }
    }
  }

  return result
}
