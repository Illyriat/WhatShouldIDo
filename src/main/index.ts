import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { registerPledgesIpcHandlers } from './ipc/pledgesApi'
import { registerSettingsIpcHandlers } from './ipc/settingsApi'
import { checkForUpdates, registerUpdateIpcHandlers, setUpdateTargetWindow } from './updater'

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1400,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  window.on('ready-to-show', () => window.show())

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return window
}

app.whenReady().then(() => {
  registerPledgesIpcHandlers()
  registerSettingsIpcHandlers()
  registerUpdateIpcHandlers()

  const window = createWindow()
  setUpdateTargetWindow(window)
  checkForUpdates()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
