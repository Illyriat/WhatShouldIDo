import { parseSavedVariables } from './luaSavedVarsParser'

type PlainObject = Record<string, unknown>

function asPlainObject(value: unknown): PlainObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PlainObject
  }
  return null
}

function extractCompletedKeys(value: unknown): string[] {
  const obj = asPlainObject(value)
  if (!obj) return []
  return Object.entries(obj)
    .filter(([, v]) => v === 1)
    .map(([key]) => key)
}

// Realm-bucket keys under $AccountWide that aren't character ids.
const NON_CHAR_KEYS = new Set(['version'])

/**
 * Reads each character's completed Undaunted Pledge dungeon quest keys from
 * WhatShouldIDoDataCollector.lua's `.completedDungeonQuests` (see the addon's own
 * data/DungeonQuests.lua and its WSIDC.PLEDGE_DUNGEONS table) - keyed the same short
 * way as this app's PLEDGE_DUNGEONS list (src/shared/pledgeDungeons.ts), replacing
 * USPF's `GD` table. Quest completion is genuinely per-character in ESO with no
 * account-wide or per-server caveat, so no unioning across characters is needed.
 */
export async function extractCompletedDungeonQuests(filePath: string): Promise<Map<string, string[]>> {
  const result = new Map<string, string[]>()

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
        result.set(charId, extractCompletedKeys(charObject?.['completedDungeonQuests']))
      }
    }
  }

  return result
}
