import { app, ipcMain, type BrowserWindow } from 'electron'
import electronUpdater from 'electron-updater'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type { UpdateStatus } from '@shared/types'

// electron-updater is CommonJS; the ESM main process can't destructure its named
// exports after bundling, so pull autoUpdater off the default export.
// https://github.com/electron-userland/electron-builder/issues/7976
const { autoUpdater } = electronUpdater

let targetWindow: BrowserWindow | null = null

function sendStatus(status: UpdateStatus): void {
  targetWindow?.webContents.send(IPC_CHANNELS.updateStatus, status)
}

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('checking-for-update', () => sendStatus({ state: 'checking' }))
autoUpdater.on('update-available', (info) => sendStatus({ state: 'available', version: info.version }))
autoUpdater.on('update-not-available', () => sendStatus({ state: 'not-available' }))
autoUpdater.on('download-progress', (progress) =>
  sendStatus({ state: 'downloading', percent: Math.round(progress.percent) })
)
autoUpdater.on('update-downloaded', (info) => sendStatus({ state: 'downloaded', version: info.version }))
autoUpdater.on('error', (err) => sendStatus({ state: 'error', message: err.message }))

// Checks GitHub Releases (electron-builder.yml `publish` block) and auto-downloads a
// newer version in the background; the renderer reacts to the update-status events.
// Dev builds have no app-update.yml to check against, so bail out early.
export async function checkForUpdates(): Promise<void> {
  if (!app.isPackaged) {
    sendStatus({ state: 'error', message: "Updates aren't available in a dev build." })
    return
  }
  try {
    await autoUpdater.checkForUpdates()
  } catch (err) {
    sendStatus({ state: 'error', message: err instanceof Error ? err.message : String(err) })
  }
}

// Call once the main window exists, before checkForUpdates runs.
export function setUpdateTargetWindow(window: BrowserWindow): void {
  targetWindow = window
}

export function registerUpdateIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.checkForUpdates, () => checkForUpdates())
  ipcMain.handle(IPC_CHANNELS.quitAndInstallUpdate, () => autoUpdater.quitAndInstall())
}
