import { parseSavedVariables } from './luaSavedVarsParser'

type PlainObject = Record<string, unknown>

function asPlainObject(value: unknown): PlainObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PlainObject
  }
  return null
}

export interface RawCharacter {
  charId: string
  charName: string
  server: string
}

export interface RawAccount {
  accountName: string
  characters: RawCharacter[]
}

// Realm-bucket keys under $AccountWide that aren't character ids.
const NON_CHAR_KEYS = new Set(['version'])

/**
 * Reads each account's character list (charId, charName, server) from
 * WhatShouldIDoDataCollector.lua. Unlike USPF (charInfo list) + SkillLines (a separate
 * addon just for server labels), this addon keys characters directly by charId under
 * each realm bucket with no charInfo indirection, and the realm bucket's own key *is*
 * the server label - so this single read replaces both of those addons' character data.
 * `.name` (see the addon's Main.lua) only exists once you've logged into that character
 * with the addon active - characters without it yet are skipped rather than shown
 * nameless.
 */
export async function extractCharacters(filePath: string): Promise<RawAccount[]> {
  const accounts: RawAccount[] = []

  const parsed = await parseSavedVariables(filePath, 'WhatShouldIDoDataCollectorVars')
  const defaultProfile = asPlainObject(parsed) && asPlainObject((parsed as PlainObject)['Default'])
  if (!defaultProfile) return accounts

  for (const [accountName, accountValue] of Object.entries(defaultProfile)) {
    const accountObject = asPlainObject(accountValue)
    if (!accountName.startsWith('@') || !accountObject) continue

    const accountWide = asPlainObject(accountObject['$AccountWide'])
    if (!accountWide) continue

    const characters: RawCharacter[] = []

    for (const [realmName, realmValue] of Object.entries(accountWide)) {
      const realmObject = asPlainObject(realmValue)
      if (!realmObject) continue

      for (const [charId, charValue] of Object.entries(realmObject)) {
        if (NON_CHAR_KEYS.has(charId) || !/^\d+$/.test(charId)) continue
        const charObject = asPlainObject(charValue)
        const charName = charObject?.['name']
        if (typeof charName !== 'string') continue

        characters.push({ charId, charName, server: realmName })
      }
    }

    if (characters.length > 0) {
      accounts.push({
        accountName,
        characters: characters.sort((a, b) => a.charName.localeCompare(b.charName))
      })
    }
  }

  return accounts.sort((a, b) => a.accountName.localeCompare(b.accountName))
}
