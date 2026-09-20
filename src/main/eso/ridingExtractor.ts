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
const NON_CHAR_KEYS = new Set(['version'])

function computeStatus(ridingStats: PlainObject, nowSeconds: number): RidingStatus {
  const capacity = ridingStats['capacity']
  const capacityMax = ridingStats['capacityMax']
  const stamina = ridingStats['stamina']
  const staminaMax = ridingStats['staminaMax']
  const speed = ridingStats['speed']
  const speedMax = ridingStats['speedMax']

  const maxed = capacity === capacityMax && stamina === staminaMax && speed === speedMax
  if (maxed) return { ridingMaxed: true, readyToTrainRiding: false }

  const trainableAt = ridingStats['trainableAt']
  const canTrain = typeof trainableAt !== 'number' || trainableAt <= nowSeconds
  return { ridingMaxed: false, readyToTrainRiding: canTrain }
}

/**
 * Reads each character's riding-training status from WhatShouldIDoDataCollector.lua's
 * `.ridingStats` (see the addon's data/RidingTraining.lua). `$AccountWide` holds realm
 * buckets keyed straight by charId, so callers join this onto known characters by charId.
 *
 * Training has one daily cooldown per character, not per stat: maxed on all 3 stats
 * means nothing to do; otherwise compare `trainableAt` (an absolute unix-seconds
 * timestamp - at or before now means a training slot is available) against now.
 */
export async function extractRidingStatus(
  filePath: string,
  now: Date = new Date()
): Promise<Map<string, RidingStatus>> {
  const result = new Map<string, RidingStatus>()
  const nowSeconds = Math.floor(now.getTime() / 1000)

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
        const ridingStats = asPlainObject(charObject?.['ridingStats'])
        if (!ridingStats) continue

        result.set(charId, computeStatus(ridingStats, nowSeconds))
      }
    }
  }

  return result
}
