import { parseSavedVariables } from './luaSavedVarsParser'

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

// Realm-bucket keys under $AccountWide that aren't realm/server names.
const NON_REALM_KEYS = new Set(['version'])

/**
 * Reads each realm's account-wide Champion Points total from WhatShouldIDoDataCollector.lua.
 * Unlike Alliance Rank (per-character, see allianceRankExtractor.ts), Champion Points are
 * earned once per account per megaserver - every character on the same account + realm
 * shares the same CP total - so the addon records it directly on the realm bucket
 * (`.championPoints`), a sibling of the charId entries, rather than duplicating it under
 * every character. Layout: `["Default"][@Account]["$AccountWide"]["<Realm> Megaserver"].championPoints`.
 * Returns account -> realm -> CP.
 */
export async function extractChampionPoints(filePath: string): Promise<Map<string, Map<string, number>>> {
  const result = new Map<string, Map<string, number>>()

  const parsed = await parseSavedVariables(filePath, 'WhatShouldIDoDataCollectorVars')
  const defaultProfile = asPlainObject(parsed) && asPlainObject((parsed as PlainObject)['Default'])
  if (!defaultProfile) return result

  for (const [accountName, accountValue] of Object.entries(defaultProfile)) {
    const accountObject = asPlainObject(accountValue)
    if (!accountName.startsWith('@') || !accountObject) continue

    const accountWide = asPlainObject(accountObject['$AccountWide'])
    if (!accountWide) continue

    const realmToPoints = new Map<string, number>()

    for (const [realmName, realmValue] of Object.entries(accountWide)) {
      if (NON_REALM_KEYS.has(realmName)) continue
      const realmObject = asPlainObject(realmValue)
      const championPoints = asNumber(realmObject?.['championPoints'])
      if (championPoints === null) continue

      realmToPoints.set(realmName, championPoints)
    }

    if (realmToPoints.size > 0) result.set(accountName, realmToPoints)
  }

  return result
}
