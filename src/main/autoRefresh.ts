import type { BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import { watchSavedVariables } from './eso/savedVarsWatcher'

let targetWindow: BrowserWindow | null = null
let disposeWatcher: (() => void) | null = null

// Call once the main window exists, before restartAutoRefreshWatcher runs.
export function setAutoRefreshTargetWindow(window: BrowserWindow): void {
  targetWindow = window
}

// (Re)starts watching the given Documents folder for addon SavedVariables changes,
// tearing down any previous watcher first. Call on startup with the persisted setting,
// and again whenever the user changes the Documents folder override in Settings.
export function restartAutoRefreshWatcher(documentsOverride: string | undefined): void {
  disposeWatcher?.()
  disposeWatcher = watchSavedVariables(documentsOverride, () => {
    targetWindow?.webContents.send(IPC_CHANNELS.savedVariablesChanged)
  })
}
