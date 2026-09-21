import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'
import type {
  Account,
  AddonInstallStatus,
  AddonStatus,
  AppSettings,
  RecommendationsResult,
  UpdateStatus
} from '@shared/types'
import { IPC_CHANNELS } from '@shared/ipcChannels'

const api = {
  getAccounts: (): Promise<Account[]> => ipcRenderer.invoke(IPC_CHANNELS.getAccounts),
  getRecommendations: (): Promise<RecommendationsResult> => ipcRenderer.invoke(IPC_CHANNELS.getRecommendations),
  getAppSettings: (): Promise<AppSettings> => ipcRenderer.invoke(IPC_CHANNELS.getAppSettings),
  getAddonStatus: (): Promise<AddonStatus> => ipcRenderer.invoke(IPC_CHANNELS.getAddonStatus),
  getAddonInstallStatus: (): Promise<AddonInstallStatus> => ipcRenderer.invoke(IPC_CHANNELS.getAddonInstallStatus),
  installDataCollectorAddon: (): Promise<AddonInstallStatus> =>
    ipcRenderer.invoke(IPC_CHANNELS.installDataCollectorAddon),
  setDocumentsPathOverride: (path: string | null): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC_CHANNELS.setDocumentsPathOverride, path),
  setDisabledFeatures: (flags: string[]): Promise<AppSettings> =>
    ipcRenderer.invoke(IPC_CHANNELS.setDisabledFeatures, flags),
  setLanguage: (language: string): Promise<AppSettings> => ipcRenderer.invoke(IPC_CHANNELS.setLanguage, language),
  pickDocumentsFolder: (): Promise<string | null> => ipcRenderer.invoke(IPC_CHANNELS.pickDocumentsFolder),
  checkForUpdates: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.checkForUpdates),
  quitAndInstallUpdate: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.quitAndInstallUpdate),
  // Subscribes to update-status pushes from main; call the returned fn to unsubscribe.
  onUpdateStatus: (callback: (status: UpdateStatus) => void): (() => void) => {
    const listener = (_event: IpcRendererEvent, status: UpdateStatus): void => callback(status)
    ipcRenderer.on(IPC_CHANNELS.updateStatus, listener)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.updateStatus, listener)
  },
  // Subscribes to "a watched SavedVariables file changed on disk" pushes from main
  // (src/main/autoRefresh.ts); call the returned fn to unsubscribe.
  onSavedVariablesChanged: (callback: () => void): (() => void) => {
    const listener = (): void => callback()
    ipcRenderer.on(IPC_CHANNELS.savedVariablesChanged, listener)
    return () => ipcRenderer.removeListener(IPC_CHANNELS.savedVariablesChanged, listener)
  }
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
