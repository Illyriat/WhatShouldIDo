import type { Account } from '@shared/types'
import { findSavedVariablesFiles } from './savedVarsLocator'
import { extractAccountsFromUspf, type RawAccount } from './uspfExtractor'
import { extractCharacterServers } from './skillLinesExtractor'
import { extractRidingStatus, type RidingStatus } from './ridingExtractor'

const UNKNOWN_SERVER = 'Unknown Server'
const NO_RIDING_DATA: RidingStatus = { ridingMaxed: false, readyToTrainRiding: false }

function mergeRawAccounts(rawAccountLists: RawAccount[][]): Map<string, RawAccount> {
  const merged = new Map<string, RawAccount>()
  for (const list of rawAccountLists) {
    for (const account of list) {
      const existing = merged.get(account.accountName)
      if (!existing) {
        merged.set(account.accountName, { accountName: account.accountName, characters: [...account.characters] })
        continue
      }
      const charIds = new Set(existing.characters.map((c) => c.charId))
      for (const character of account.characters) {
        if (!charIds.has(character.charId)) existing.characters.push(character)
      }
    }
  }
  return merged
}

/**
 * Builds the Account[] the app renders. Reads USPF (per-character dungeon-quest
 * completion, one file per profile), SkillLines (server labels) and DailyCraftStatus
 * (riding-training status) and joins them onto each character.
 *
 * Dungeon-quest and riding data are per-character in ESO, so there's no cross-character
 * unioning - a character's own flags are correct once it has logged in with the addon.
 */
export async function buildAccounts(documentsOverride?: string): Promise<Account[]> {
  const [uspfFiles, skillLinesFiles, ridingFiles] = await Promise.all([
    findSavedVariablesFiles('USPF.lua', documentsOverride),
    findSavedVariablesFiles('SkillLines.lua', documentsOverride),
    findSavedVariablesFiles('DailyCraftStatus.lua', documentsOverride)
  ])

  const rawAccountLists = await Promise.all(uspfFiles.map((file) => extractAccountsFromUspf(file)))
  const rawAccounts = mergeRawAccounts(rawAccountLists)

  const serverMapsByFile = await Promise.all(skillLinesFiles.map((file) => extractCharacterServers(file)))
  const serversByAccount = new Map<string, Map<string, string>>()
  for (const serverMaps of serverMapsByFile) {
    for (const [accountName, charToServer] of serverMaps) {
      const existing = serversByAccount.get(accountName)
      if (!existing) {
        serversByAccount.set(accountName, new Map(charToServer))
        continue
      }
      for (const [charName, server] of charToServer) existing.set(charName, server)
    }
  }

  const ridingMapsByFile = await Promise.all(ridingFiles.map((file) => extractRidingStatus(file)))
  const ridingByCharId = new Map<string, RidingStatus>()
  for (const ridingMap of ridingMapsByFile) {
    for (const [charId, status] of ridingMap) ridingByCharId.set(charId, status)
  }

  const accounts: Account[] = []

  for (const rawAccount of rawAccounts.values()) {
    const charNameToServer = serversByAccount.get(rawAccount.accountName) ?? new Map<string, string>()

    const characters: Account['characters'] = rawAccount.characters.map((character) => {
      const riding = ridingByCharId.get(character.charId) ?? NO_RIDING_DATA
      return {
        charId: character.charId,
        charName: character.charName,
        server: charNameToServer.get(character.charName) ?? UNKNOWN_SERVER,
        completedDungeonKeys: character.completedDungeonKeys,
        ridingMaxed: riding.ridingMaxed,
        readyToTrainRiding: riding.readyToTrainRiding
      }
    })

    accounts.push({
      accountName: rawAccount.accountName,
      characters: characters.sort((a, b) => a.charName.localeCompare(b.charName))
    })
  }

  return accounts.sort((a, b) => a.accountName.localeCompare(b.accountName))
}
