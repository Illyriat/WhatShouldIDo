import { watch, type FSWatcher } from 'fs'
import { readdir } from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'
import { ADDON_SAVED_VARS } from './addonDetector'

const DEFAULT_DEBOUNCE_MS = 750

export interface WatchSavedVariablesOptions {
  // Which SavedVariables file names to react to. Defaults to everything this app reads.
  watchedFileNames?: readonly string[]
  // Coalesces a burst of change events (a single ESO write can fire more than one) into
  // one onChange call.
  debounceMs?: number
}

/**
 * Watches every "<profile>/SavedVariables" folder under Documents/Elder Scrolls Online
 * for changes to the files this app reads, and calls onChange (debounced) when one
 * changes - so the app can auto-refresh instead of requiring the user to click Refresh
 * after every /reloadui or logout.
 *
 * Watches directories rather than the files directly so this also picks up a file that
 * doesn't exist yet (e.g. before the user has ever logged in with the addon active) -
 * fs.watch on a not-yet-existing file throws immediately, but watching its parent
 * directory (once that exists) sees the file appear.
 *
 * Returns a dispose function. Safe to call even if the async directory scan hasn't
 * finished yet, or if the Documents/Elder Scrolls Online folder doesn't exist at all
 * (nothing to watch, onChange just never fires).
 */
export function watchSavedVariables(
  documentsOverride: string | undefined,
  onChange: () => void,
  options: WatchSavedVariablesOptions = {}
): () => void {
  const watchedFileNames = options.watchedFileNames ?? ADDON_SAVED_VARS
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS

  let disposed = false
  const watchers: FSWatcher[] = []
  let debounceTimer: NodeJS.Timeout | null = null

  function scheduleOnChange(): void {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      onChange()
    }, debounceMs)
  }

  async function setup(): Promise<void> {
    const documentsDir = documentsOverride ?? join(homedir(), 'Documents')
    const esoDir = join(documentsDir, 'Elder Scrolls Online')

    let profiles: string[]
    try {
      profiles = (await readdir(esoDir, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    } catch {
      return
    }

    for (const profile of profiles) {
      if (disposed) return
      const savedVarsDir = join(esoDir, profile, 'SavedVariables')
      try {
        const watcher = watch(savedVarsDir, (_eventType, filename) => {
          if (typeof filename === 'string' && watchedFileNames.includes(filename)) scheduleOnChange()
        })
        watcher.on('error', () => {
          // Folder removed/inaccessible mid-session - just drop this watcher; a later
          // documents-path change or app restart re-establishes it.
        })
        watchers.push(watcher)
      } catch {
        // No SavedVariables folder yet for this profile - nothing to watch there.
      }
    }
  }

  setup()

  return () => {
    disposed = true
    if (debounceTimer) clearTimeout(debounceTimer)
    for (const watcher of watchers) watcher.close()
  }
}
