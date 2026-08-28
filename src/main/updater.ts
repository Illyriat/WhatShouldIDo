import { app, ipcMain, type BrowserWindow } from 'electron'
import electronUpdater from 'electron-updater'
import { IPC_CHANNELS } from '@shared/ipcChannels'
import type { UpdateStatus } from '@shared/types'

// electron-updater is CommonJS; its named exports aren't statically analyzable by
// Node's ESM interop once bundled, so this app's ESM main process (package.json has
// "type": "module") must go through the default export instead - see
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

/**
 * Checks GitHub Releases (see electron-builder.yml's `publish` block) for a newer
 * version, downloading it automatically in the background if found - the renderer
 * finds out via `update-status` events and prompts the user to restart once
 * `update-downloaded` fires. No-ops with a friendly status outside a packaged build,
 * since electron-updater has nothing to check against in dev (no app-update.yml).
 */
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

/** Call once, after the main window is created, so update-status events have somewhere to go. */
export function setUpdateTargetWindow(window: BrowserWindow): void {
  targetWindow = window
}

export function registerUpdateIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.checkForUpdates, () => checkForUpdates())
  ipcMain.handle(IPC_CHANNELS.quitAndInstallUpdate, () => autoUpdater.quitAndInstall())
}
