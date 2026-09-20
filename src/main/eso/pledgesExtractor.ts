import { parseSavedVariables } from './luaSavedVarsParser'
import { findPledgeDungeonByZoneId, PLEDGE_MASTERS } from '@shared/pledgeDungeons'
import type { TodaysPledge, UpcomingPledgeDay } from '@shared/types'

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

interface PledgeSlot {
  zoneId: number
  name: string
}

function asPledgeSlot(value: unknown): PledgeSlot | null {
  const obj = asPlainObject(value)
  if (!obj) return null
  const zoneId = asNumber(obj['zoneId'])
  if (zoneId === null) return null
  return { zoneId, name: typeof obj['name'] === 'string' ? obj['name'] : '' }
}

interface ResolvedDay {
  esoDay: string
  pledges: TodaysPledge[]
}

// One entry of the addon's `.pledges` array (see WhatShouldIDoDataCollector's
// data/Pledges.lua) - one day's rotation for the three pledge givers, in the fixed
// base1/base2/dlc1 order matching PLEDGE_MASTERS.
function resolveDay(day: PlainObject): ResolvedDay | null {
  const esoDay = typeof day['esoDay'] === 'string' ? day['esoDay'] : null
  const slots = [asPledgeSlot(day['base1']), asPledgeSlot(day['base2']), asPledgeSlot(day['dlc1'])]
  if (!esoDay || slots.some((s) => s === null)) return null

  const pledges: TodaysPledge[] = PLEDGE_MASTERS.map((master, i) => {
    const slot = slots[i] as PledgeSlot
    return { master, dungeon: findPledgeDungeonByZoneId(slot.zoneId), dungeonName: slot.name }
  })

  return { esoDay, pledges }
}

export interface RealmPledgesData {
  esoDay: string
  pledges: TodaysPledge[]
  upcoming: UpcomingPledgeDay[]
}

// Realm-bucket keys under $AccountWide that aren't realm/server names.
const NON_REALM_KEYS = new Set(['version'])

/**
 * Reads today's + upcoming Undaunted Pledge rotation from WhatShouldIDoDataCollector.lua's
 * `.pledges` (an array of 6 day-entries, today first, computed by the addon via
 * LibUndauntedPledges - see data/Pledges.lua). Unlike championPointsExtractor/
 * wealthExtractor's bank total, this isn't returned account -> realm -> data: the
 * rotation is genuinely realm-wide, not account-specific (every account on the same
 * megaserver sees the same pledges), so if more than one of the user's accounts has
 * logged into the same realm, later entries here simply overwrite earlier ones with the
 * same values. Returns realm -> pledge data.
 */
export async function extractPledgesByRealm(filePath: string): Promise<Map<string, RealmPledgesData>> {
  const result = new Map<string, RealmPledgesData>()

  const parsed = await parseSavedVariables(filePath, 'WhatShouldIDoDataCollectorVars')
  const defaultProfile = asPlainObject(parsed) && asPlainObject((parsed as PlainObject)['Default'])
  if (!defaultProfile) return result

  for (const accountValue of Object.values(defaultProfile)) {
    const accountObject = asPlainObject(accountValue)
    const accountWide = asPlainObject(accountObject?.['$AccountWide'])
    if (!accountWide) continue

    for (const [realmName, realmValue] of Object.entries(accountWide)) {
      if (NON_REALM_KEYS.has(realmName)) continue
      const realmObject = asPlainObject(realmValue)
      const rawDays = realmObject?.['pledges']
      if (!Array.isArray(rawDays) || rawDays.length === 0) continue

      const days = rawDays.map((d) => {
        const obj = asPlainObject(d)
        return obj ? resolveDay(obj) : null
      })

      const today = days[0]
      if (!today) continue

      const upcoming: UpcomingPledgeDay[] = days
        .slice(1)
        .filter((d): d is ResolvedDay => d !== null)
        .map((d) => ({ esoDay: d.esoDay, pledges: d.pledges }))

      result.set(realmName, { esoDay: today.esoDay, pledges: today.pledges, upcoming })
    }
  }

  return result
}
