import { app } from 'electron'
import { join } from 'path'
import { DATA_COLLECTOR_ADDON, installDataCollector } from './eso/addonInstaller'
import { readPersistedSettings } from './settingsStore'

// Where the Data Collector addon that ships with this app lives. Packaged builds get it
// from electron-builder's extraResources (electron-builder.yml); in dev it's read straight
// from the git submodule the installer is built from (see .gitmodules).
export function bundledDataCollectorDir(): string {
  if (app.isPackaged) return join(process.resourcesPath, 'addons', DATA_COLLECTOR_ADDON)
  return join(app.getAppPath(), 'vendor', DATA_COLLECTOR_ADDON, DATA_COLLECTOR_ADDON)
}

// Runs at launch: brings an already-installed Data Collector up to the version bundled
// with this build. It never installs into a profile that doesn't have the addon (that's
// the Settings "Install" button) and never downgrades. A failure here (read-only folder,
// antivirus lock, ...) must not stop the app opening, so it's only logged.
export async function updateInstalledDataCollector(): Promise<void> {
  try {
    const settings = await readPersistedSettings()
    const updated = await installDataCollector(bundledDataCollectorDir(), 'update', settings.documentsPathOverride)
    if (updated.length > 0) console.info(`Updated the Data Collector addon in: ${updated.join(', ')}`)
  } catch (error) {
    console.warn('Could not update the Data Collector addon:', error)
  }
}
