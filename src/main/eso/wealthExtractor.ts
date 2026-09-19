import { parseSavedVariables } from './luaSavedVarsParser'
import type { WealthAmounts } from '@shared/types'

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

function asWealthAmounts(value: unknown): WealthAmounts | null {
  const obj = asPlainObject(value)
  if (!obj) return null

  const gold = asNumber(obj['gold'])
  const alliancePoints = asNumber(obj['alliancePoints'])
  const telVarStones = asNumber(obj['telVarStones'])
  const writVouchers = asNumber(obj['writVouchers'])
  if (gold === null || alliancePoints === null || telVarStones === null || writVouchers === null) return null

  return { gold, alliancePoints, telVarStones, writVouchers }
}

// Realm-bucket keys under $AccountWide that aren't character ids.
const NON_CHAR_KEYS = new Set(['version'])
// Realm-bucket keys under $AccountWide that aren't realm/server names.
const NON_REALM_KEYS = new Set(['version'])

/**
 * Reads each character's carried currency (Gold, Alliance Points, Tel Var Stones, Writ
 * Vouchers) from WhatShouldIDoDataCollector.lua - see data/Wealth.lua in the
 * WhatShouldIDoDataCollector repo. Same layout as allianceRankExtractor: keyed by charId
 * with no character-name list, so callers join onto the known character list by charId.
 */
export async function extractCharacterWealth(filePath: string): Promise<Map<string, WealthAmounts>> {
  const result = new Map<string, WealthAmounts>()

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
        const wealth = asWealthAmounts(charObject?.['wealth'])
        if (!wealth) continue

        result.set(charId, wealth)
      }
    }
  }

  return result
}

/**
 * Reads each realm's shared account-wide bank currency totals from
 * WhatShouldIDoDataCollector.lua. Same account+realm scoping as championPointsExtractor -
 * every character on the same account and megaserver shares one bank. Returns
 * account -> realm -> WealthAmounts.
 */
export async function extractBankWealth(filePath: string): Promise<Map<string, Map<string, WealthAmounts>>> {
  const result = new Map<string, Map<string, WealthAmounts>>()

  const parsed = await parseSavedVariables(filePath, 'WhatShouldIDoDataCollectorVars')
  const defaultProfile = asPlainObject(parsed) && asPlainObject((parsed as PlainObject)['Default'])
  if (!defaultProfile) return result

  for (const [accountName, accountValue] of Object.entries(defaultProfile)) {
    const accountObject = asPlainObject(accountValue)
    if (!accountName.startsWith('@') || !accountObject) continue

    const accountWide = asPlainObject(accountObject['$AccountWide'])
    if (!accountWide) continue

    const realmToWealth = new Map<string, WealthAmounts>()

    for (const [realmName, realmValue] of Object.entries(accountWide)) {
      if (NON_REALM_KEYS.has(realmName)) continue
      const realmObject = asPlainObject(realmValue)
      const wealth = asWealthAmounts(realmObject?.['bankWealth'])
      if (!wealth) continue

      realmToWealth.set(realmName, wealth)
    }

    if (realmToWealth.size > 0) result.set(accountName, realmToWealth)
  }

  return result
}
