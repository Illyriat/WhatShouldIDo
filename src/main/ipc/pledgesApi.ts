import { ipcMain } from 'electron'
import type { Account, RealmPledgeRecommendations, RecommendationsResult } from '@shared/types'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import { buildAccounts } from '../eso/accountBuilder'
import { findSavedVariablesFiles } from '../eso/savedVarsLocator'
import { extractPledgesByRealm, type RealmPledgesData } from '../eso/pledgesExtractor'
import { getAppSettings } from './settingsApi'

export async function getAccounts(): Promise<Account[]> {
  const settings = await getAppSettings()
  return buildAccounts(settings.documentsPathOverride)
}

async function getPledgesByRealm(documentsOverride?: string): Promise<Map<string, RealmPledgesData>> {
  const wsidcFiles = await findSavedVariablesFiles('WhatShouldIDoDataCollector.lua', documentsOverride)
  const pledgesMapsByFile = await Promise.all(wsidcFiles.map((file) => extractPledgesByRealm(file)))

  const merged = new Map<string, RealmPledgesData>()
  for (const pledgesMap of pledgesMapsByFile) {
    for (const [realm, data] of pledgesMap) merged.set(realm, data)
  }
  return merged
}

// Pledges are resolved by the WhatShouldIDoDataCollector addon (via LibUndauntedPledges),
// realm by realm, rather than scraped from a website (see pledgesExtractor.ts) - so
// recommendations are grouped per realm too, since NA and EU can show different
// dungeons on the same calendar day.
export async function getRecommendations(): Promise<RecommendationsResult> {
  const settings = await getAppSettings()
  const [accounts, pledgesByRealm] = await Promise.all([
    buildAccounts(settings.documentsPathOverride),
    getPledgesByRealm(settings.documentsPathOverride)
  ])

  const pledgesByRealmResult: RealmPledgeRecommendations[] = Array.from(pledgesByRealm.entries()).map(
    ([server, data]) => ({
      server,
      upcoming: data.upcoming,
      pledges: data.pledges.map((pledge) => ({
        master: pledge.master,
        dungeon: pledge.dungeon,
        dungeonName: pledge.dungeonName,
        characters: pledge.dungeon
          ? accounts.flatMap((account) =>
              account.characters
                .filter((character) => character.server === server)
                .map((character) => ({
                  charId: character.charId,
                  charName: character.charName,
                  accountName: account.accountName,
                  server: character.server,
                  recommended: !character.completedDungeonKeys.includes(pledge.dungeon!.key)
                }))
            )
          : []
      }))
    })
  )

  return { pledgesByRealm: pledgesByRealmResult.sort((a, b) => a.server.localeCompare(b.server)) }
}

export function registerPledgesIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.getAccounts, () => getAccounts())
  ipcMain.handle(IPC_CHANNELS.getRecommendations, () => getRecommendations())
}
