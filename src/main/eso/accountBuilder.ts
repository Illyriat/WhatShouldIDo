import type { Account } from '@shared/types'
import { findSavedVariablesFiles } from './savedVarsLocator'
import { extractCharacters, type RawAccount } from './characterExtractor'
import { extractCompletedDungeonQuests } from './dungeonQuestsExtractor'
import { extractRidingStatus, type RidingStatus } from './ridingExtractor'
import { extractAllianceRankStatus } from './allianceRankExtractor'
import { extractChampionPoints } from './championPointsExtractor'
import { extractCharacterWealth, extractBankWealth } from './wealthExtractor'

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

// Folds each file's map into one. A key present in more than one file (the same
// character seen from two ESO profiles) takes the later file's value.
function mergeMaps<V>(maps: Map<string, V>[]): Map<string, V> {
  const merged = new Map<string, V>()
  for (const map of maps) {
    for (const [key, value] of map) merged.set(key, value)
  }
  return merged
}

// Same, for account -> realm -> value maps: realms are merged per account rather than
// one file's account entry replacing another's.
function mergeNestedMaps<V>(maps: Map<string, Map<string, V>>[]): Map<string, Map<string, V>> {
  const merged = new Map<string, Map<string, V>>()
  for (const map of maps) {
    for (const [outerKey, inner] of map) {
      const existing = merged.get(outerKey)
      if (!existing) {
        merged.set(outerKey, new Map(inner))
        continue
      }
      for (const [innerKey, value] of inner) existing.set(innerKey, value)
    }
  }
  return merged
}

/**
 * Builds the Account[] the app renders. Reads everything from WhatShouldIDoDataCollector.lua
 * (the character list with server labels, per-character dungeon-quest completion,
 * riding-training status, Alliance Rank, Champion Points, Wealth) and joins it by
 * charId. WhatShouldIDoDataCollector is a purpose-built companion addon
 * (github.com/Illyriat/WhatShouldIDoDataCollector) - the app's sole ESO addon
 * dependency, having replaced USPF, Skill Lines and DailyCraftStatus in turn.
 *
 * Dungeon-quest and riding data are per-character in ESO, so there's no cross-character
 * unioning - a character's own flags are correct once it has logged in with the addon.
 * Champion Points are account+realm scoped instead (every character on the same account
 * and megaserver shares one CP total), so they live on Account.championPoints rather
 * than on each character.
 */
export async function buildAccounts(documentsOverride?: string): Promise<Account[]> {
  const wsidcFiles = await findSavedVariablesFiles('WhatShouldIDoDataCollector.lua', documentsOverride)

  const fromEachFile = <T>(extract: (file: string) => Promise<T>): Promise<T[]> =>
    Promise.all(wsidcFiles.map((file) => extract(file)))

  // All of these read the same file (one shared parse - see luaSavedVarsParser.ts) and
  // differ only in scope: per-character data is keyed by charId, while Champion Points
  // and the shared bank are account+realm scoped (account -> realm -> value).
  const [rawAccountLists, dungeonQuestMaps, ridingMaps, allianceRankMaps, wealthMaps, championPointsMaps, bankWealthMaps] =
    await Promise.all([
      fromEachFile(extractCharacters),
      fromEachFile(extractCompletedDungeonQuests),
      fromEachFile(extractRidingStatus),
      fromEachFile(extractAllianceRankStatus),
      fromEachFile(extractCharacterWealth),
      fromEachFile(extractChampionPoints),
      fromEachFile(extractBankWealth)
    ])

  const rawAccounts = mergeRawAccounts(rawAccountLists)
  const dungeonQuestsByCharId = mergeMaps(dungeonQuestMaps)
  const ridingByCharId = mergeMaps(ridingMaps)
  const allianceRankByCharId = mergeMaps(allianceRankMaps)
  const wealthByCharId = mergeMaps(wealthMaps)
  const championPointsByAccount = mergeNestedMaps(championPointsMaps)
  const bankWealthByAccount = mergeNestedMaps(bankWealthMaps)

  const accounts: Account[] = []

  for (const rawAccount of rawAccounts.values()) {
    const characters: Account['characters'] = rawAccount.characters.map((character) => {
      const riding = ridingByCharId.get(character.charId) ?? NO_RIDING_DATA
      return {
        charId: character.charId,
        charName: character.charName,
        server: character.server,
        completedDungeonKeys: dungeonQuestsByCharId.get(character.charId) ?? [],
        ridingMaxed: riding.ridingMaxed,
        readyToTrainRiding: riding.readyToTrainRiding,
        allianceRank: allianceRankByCharId.get(character.charId) ?? null,
        wealth: wealthByCharId.get(character.charId) ?? null
      }
    })

    const championPoints = championPointsByAccount.get(rawAccount.accountName)
    const bankWealth = bankWealthByAccount.get(rawAccount.accountName)

    accounts.push({
      accountName: rawAccount.accountName,
      characters: characters.sort((a, b) => a.charName.localeCompare(b.charName)),
      championPoints: championPoints ? Object.fromEntries(championPoints) : {},
      bankWealth: bankWealth ? Object.fromEntries(bankWealth) : {}
    })
  }

  return accounts.sort((a, b) => a.accountName.localeCompare(b.accountName))
}
