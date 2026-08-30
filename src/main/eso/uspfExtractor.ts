import { parseSavedVariables } from './luaSavedVarsParser'

type PlainObject = Record<string, unknown>

function asPlainObject(value: unknown): PlainObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PlainObject
  }
  return null
}

function extractCompletedKeys(gd: unknown): string[] {
  const gdObject = asPlainObject(gd)
  if (!gdObject) return []
  return Object.entries(gdObject)
    .filter(([, value]) => value === 1)
    .map(([key]) => key)
}

// A realm bucket carries `charInfo` and `ptsData`. USPF puts the primary bucket at
// "$AccountWide", but nests any other realm ("EU Megaserver" etc.) one level deeper
// inside it. Match on the shape rather than realm names/depth to cope with that.
function findRealmBuckets(container: PlainObject, depth = 0): PlainObject[] {
  const buckets: PlainObject[] = []
  if (depth > 2) return buckets

  const looksLikeBucket = Array.isArray(container['charInfo']) && asPlainObject(container['ptsData']) !== null
  if (looksLikeBucket) buckets.push(container)

  for (const value of Object.values(container)) {
    const nested = asPlainObject(value)
    if (nested) buckets.push(...findRealmBuckets(nested, depth + 1))
  }

  return buckets
}

export interface RawCharacter {
  charId: string
  charName: string
  // GD (Group Dungeon quest) keys this character has completed. Quest completion is
  // per-character in ESO, so no account-wide unioning is needed here.
  completedDungeonKeys: string[]
}

export interface RawAccount {
  accountName: string
  characters: RawCharacter[]
}

// Reads USPF.lua into one RawAccount per @AccountName, merging characters (deduped by
// charId) across all of that account's realm buckets.
export async function extractAccountsFromUspf(filePath: string): Promise<RawAccount[]> {
  const parsed = await parseSavedVariables(filePath, 'USPF_Settings')
  const defaultProfile = asPlainObject(parsed) && asPlainObject((parsed as PlainObject)['Default'])
  if (!defaultProfile) return []

  const accounts: RawAccount[] = []

  for (const [accountName, accountValue] of Object.entries(defaultProfile)) {
    const accountObject = asPlainObject(accountValue)
    if (!accountName.startsWith('@') || !accountObject) continue

    const charactersByCharId = new Map<string, RawCharacter>()

    for (const realmBucket of findRealmBuckets(accountObject)) {
      const charInfo = realmBucket['charInfo'] as unknown[]
      const ptsData = asPlainObject(realmBucket['ptsData']) ?? {}

      for (const rawEntry of charInfo) {
        const entry = asPlainObject(rawEntry)
        const charId = entry?.['charId']
        const charName = entry?.['charName']
        if (typeof charId !== 'string' || typeof charName !== 'string') continue

        const charPtsData = asPlainObject(ptsData[charId])
        const completedDungeonKeys = extractCompletedKeys(charPtsData?.['GD'])

        charactersByCharId.set(charId, { charId, charName, completedDungeonKeys })
      }
    }

    if (charactersByCharId.size > 0) {
      accounts.push({
        accountName,
        characters: Array.from(charactersByCharId.values()).sort((a, b) =>
          a.charName.localeCompare(b.charName)
        )
      })
    }
  }

  return accounts.sort((a, b) => a.accountName.localeCompare(b.accountName))
}
