import { dialog, ipcMain } from 'electron'
import { homedir } from 'os'
import { join } from 'path'
import type { AddonStatus, AppSettings } from '@shared/types'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import { readPersistedSettings, writePersistedSettings } from '../settingsStore'
import { detectAddons } from '../eso/addonDetector'

function defaultDocumentsPath(): string {
  return join(homedir(), 'Documents')
}

export async function getAppSettings(): Promise<AppSettings> {
  const stored = await readPersistedSettings()
  return {
    documentsPathOverride: stored.documentsPathOverride,
    defaultDocumentsPath: defaultDocumentsPath(),
    disabledFeatures: stored.disabledFeatures ?? []
  }
}

export async function getAddonStatus(): Promise<AddonStatus> {
  const stored = await readPersistedSettings()
  return detectAddons(stored.documentsPathOverride)
}

export async function setDocumentsPathOverride(path: string | null): Promise<AppSettings> {
  const stored = await readPersistedSettings()
  await writePersistedSettings({ ...stored, documentsPathOverride: path ?? undefined })
  return getAppSettings()
}

export async function setDisabledFeatures(flags: string[]): Promise<AppSettings> {
  const stored = await readPersistedSettings()
  await writePersistedSettings({ ...stored, disabledFeatures: flags })
  return getAppSettings()
}

// Opens a native folder picker. Null if the user cancelled.
export async function pickDocumentsFolder(): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    title: 'Select your Documents folder (containing "Elder Scrolls Online")',
    properties: ['openDirectory']
  })
  if (result.canceled || result.filePaths.length === 0) return null
  return result.filePaths[0]
}

export function registerSettingsIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.getAppSettings, () => getAppSettings())
  ipcMain.handle(IPC_CHANNELS.getAddonStatus, () => getAddonStatus())
  ipcMain.handle(IPC_CHANNELS.setDocumentsPathOverride, (_event, path: string | null) =>
    setDocumentsPathOverride(path)
  )
  ipcMain.handle(IPC_CHANNELS.setDisabledFeatures, (_event, flags: string[]) => setDisabledFeatures(flags))
  ipcMain.handle(IPC_CHANNELS.pickDocumentsFolder, () => pickDocumentsFolder())
}
