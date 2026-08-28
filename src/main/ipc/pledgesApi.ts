import { app, ipcMain } from 'electron'
import { join } from 'path'
import type { Account, RecommendationsResult } from '@shared/types'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import { buildAccounts } from '../eso/accountBuilder'
import { getTodaysPledges } from '../eso/pledgeScraper'
import { getAppSettings } from './settingsApi'

function cachePath(): string {
  return join(app.getPath('userData'), 'pledge-cache.json')
}

export async function getAccounts(): Promise<Account[]> {
  const settings = await getAppSettings()
  return buildAccounts(settings.documentsPathOverride)
}

export async function getRecommendations(): Promise<RecommendationsResult> {
  const [accounts, todaysPledges] = await Promise.all([getAccounts(), getTodaysPledges(cachePath())])

  const pledges = todaysPledges.pledges.map((pledge) => ({
    master: pledge.master,
    dungeon: pledge.dungeon,
    scrapedName: pledge.scrapedName,
    characters: pledge.dungeon
      ? accounts.flatMap((account) =>
          account.characters.map((character) => ({
            charId: character.charId,
            charName: character.charName,
            accountName: account.accountName,
            server: character.server,
            recommended: !character.completedDungeonKeys.includes(pledge.dungeon!.key)
          }))
        )
      : []
  }))

  return { pledges, stale: todaysPledges.stale, fetchedAt: todaysPledges.fetchedAt }
}

export function registerPledgesIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.getAccounts, () => getAccounts())
  ipcMain.handle(IPC_CHANNELS.getRecommendations, () => getRecommendations())
}
