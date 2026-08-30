import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'
import type { Account, AddonStatus, AppSettings, RecommendationsResult, UpdateStatus } from '@shared/types'
import { IPC_CHANNELS } from '@shared/ipcChannels'

const api = {
  getAccounts: (): Promise<Account[]> => ipcRenderer.invoke(IPC_CHANNELS.getAccounts),
  getRecommendations: (): Promise<RecommendationsResult> => ipcRenderer.invoke(IPC_CHANNELS.getRecommendations),
  getAppSettings: (): Promise<AppSettings> => ipcRenderer.invoke(IPC_CHANNELS.getAppSettings),
  getAddonStatus: (): Promise<AddonStatus> => ipcRenderer.invoke(IPC_CHANNELS.getAddonStatus),
  setDocumentsPathOverride: (path: string | null): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC_CHANNELS.setDocumentsPathOverride, path),
  pickDocumentsFolder: (): Promise<string | null> => ipcRenderer.invoke(IPC_CHANNELS.pickDocumentsFolder),
  checkForUpdates: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.checkForUpdates),
  quitAndInstallUpdate: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.quitAndInstallUpdate),
  // Subscribes to update-status pushes from main; call the returned fn to unsubscribe.
  onUpdateStatus: (callback: (status: UpdateStatus) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, status: UpdateStatus): void => callback(status)
    ipcRenderer.on(IPC_CHANNELS.updateStatus, listener)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.updateStatus, listener)
  }
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
