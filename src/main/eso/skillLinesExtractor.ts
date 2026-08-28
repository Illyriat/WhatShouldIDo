import { parseSavedVariables } from './luaSavedVarsParser'

type PlainObject = Record<string, unknown>

function asPlainObject(value: unknown): PlainObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PlainObject
  }
  return null
}

// Keys under $AccountWide that are settings, not realm/server buckets.
const NON_REALM_KEYS = new Set(['settings', 'windowSize', 'windowPosition', 'version'])

/**
 * SkillLines.lua explicitly labels which megaserver each character is on - unlike
 * USPF, which only distinguishes an implicit default bucket from separately-named
 * ones. Structure (confirmed against the live file):
 *   ["Default"]["@AccountName"]["$AccountWide"]["NA Megaserver"]["@AccountName"][charName] = {...}
 *   ["Default"]["@AccountName"]["$AccountWide"]["EU Megaserver"]["@AccountName"][charName] = {...}
 * (the inner "@AccountName" repeats the outer one). Returns accountName -> charName -> server label.
 */
export async function extractCharacterServers(filePath: string): Promise<Map<string, Map<string, string>>> {
  const result = new Map<string, Map<string, string>>()

  const parsed = await parseSavedVariables(filePath, 'SkillLinesSavedVars')
  const defaultProfile = asPlainObject(parsed) && asPlainObject((parsed as PlainObject)['Default'])
  if (!defaultProfile) return result

  for (const [accountName, accountValue] of Object.entries(defaultProfile)) {
    const accountObject = asPlainObject(accountValue)
    if (!accountName.startsWith('@') || !accountObject) continue

    const accountWide = asPlainObject(accountObject['$AccountWide'])
    if (!accountWide) continue

    const charToServer = new Map<string, string>()

    for (const [realmName, realmValue] of Object.entries(accountWide)) {
      if (NON_REALM_KEYS.has(realmName)) continue
      const realmObject = asPlainObject(realmValue)
      const innerAccount = asPlainObject(realmObject?.[accountName])
      if (!innerAccount) continue

      for (const charName of Object.keys(innerAccount)) {
        charToServer.set(charName, realmName)
      }
    }

    if (charToServer.size > 0) result.set(accountName, charToServer)
  }

  return result
}
