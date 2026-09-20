import type { Account, AllianceRankStatus, WealthAmounts } from '@shared/types'
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

/**
 * Builds the Account[] the app renders. Reads WhatShouldIDoDataCollector.lua (the
 * character list with server labels, per-character dungeon-quest completion, Alliance
 * Rank, Champion Points, Wealth) and DailyCraftStatus.lua (riding-training status) and
 * joins them by charId. WhatShouldIDoDataCollector is a purpose-built companion addon
 * (github.com/Illyriat/WhatShouldIDoDataCollector) that replaced USPF + SkillLines as
 * the character/dungeon-quest data source - see its own data/DungeonQuests.lua.
 *
 * Dungeon-quest and riding data are per-character in ESO, so there's no cross-character
 * unioning - a character's own flags are correct once it has logged in with the addon.
 * Champion Points are account+realm scoped instead (every character on the same account
 * and megaserver shares one CP total), so they live on Account.championPoints rather
 * than on each character.
 */
export async function buildAccounts(documentsOverride?: string): Promise<Account[]> {
  const [wsidcFiles, ridingFiles] = await Promise.all([
    findSavedVariablesFiles('WhatShouldIDoDataCollector.lua', documentsOverride),
    findSavedVariablesFiles('DailyCraftStatus.lua', documentsOverride)
  ])

  const rawAccountLists = await Promise.all(wsidcFiles.map((file) => extractCharacters(file)))
  const rawAccounts = mergeRawAccounts(rawAccountLists)

  const dungeonQuestMapsByFile = await Promise.all(wsidcFiles.map((file) => extractCompletedDungeonQuests(file)))
  const dungeonQuestsByCharId = new Map<string, string[]>()
  for (const dungeonQuestMap of dungeonQuestMapsByFile) {
    for (const [charId, keys] of dungeonQuestMap) dungeonQuestsByCharId.set(charId, keys)
  }

  const ridingMapsByFile = await Promise.all(ridingFiles.map((file) => extractRidingStatus(file)))
  const ridingByCharId = new Map<string, RidingStatus>()
  for (const ridingMap of ridingMapsByFile) {
    for (const [charId, status] of ridingMap) ridingByCharId.set(charId, status)
  }

  const allianceRankMapsByFile = await Promise.all(wsidcFiles.map((file) => extractAllianceRankStatus(file)))
  const allianceRankByCharId = new Map<string, AllianceRankStatus>()
  for (const allianceRankMap of allianceRankMapsByFile) {
    for (const [charId, status] of allianceRankMap) allianceRankByCharId.set(charId, status)
  }

  // Same file as the character list, but account+realm scoped rather than per-character.
  const championPointsMapsByFile = await Promise.all(wsidcFiles.map((file) => extractChampionPoints(file)))
  const championPointsByAccount = new Map<string, Map<string, number>>()
  for (const championPointsMap of championPointsMapsByFile) {
    for (const [accountName, realmToPoints] of championPointsMap) {
      const existing = championPointsByAccount.get(accountName)
      if (!existing) {
        championPointsByAccount.set(accountName, new Map(realmToPoints))
        continue
      }
      for (const [realm, points] of realmToPoints) existing.set(realm, points)
    }
  }

  // Same file, per-character carried currency (see wealthExtractor.ts).
  const wealthMapsByFile = await Promise.all(wsidcFiles.map((file) => extractCharacterWealth(file)))
  const wealthByCharId = new Map<string, WealthAmounts>()
  for (const wealthMap of wealthMapsByFile) {
    for (const [charId, wealth] of wealthMap) wealthByCharId.set(charId, wealth)
  }

  // Same file, account+realm scoped shared bank total (see wealthExtractor.ts).
  const bankWealthMapsByFile = await Promise.all(wsidcFiles.map((file) => extractBankWealth(file)))
  const bankWealthByAccount = new Map<string, Map<string, WealthAmounts>>()
  for (const bankWealthMap of bankWealthMapsByFile) {
    for (const [accountName, realmToWealth] of bankWealthMap) {
      const existing = bankWealthByAccount.get(accountName)
      if (!existing) {
        bankWealthByAccount.set(accountName, new Map(realmToWealth))
        continue
      }
      for (const [realm, wealth] of realmToWealth) existing.set(realm, wealth)
    }
  }

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
