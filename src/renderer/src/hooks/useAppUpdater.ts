import { useCallback, useEffect, useState } from 'react'
import type { UpdateStatus } from '@shared/types'

export interface AppUpdater {
  status: UpdateStatus
  checkForUpdates: () => void
  quitAndInstallUpdate: () => void
}

/**
 * Mirrors the main process's auto-updater state (see src/main/updater.ts) - main checks
 * once automatically on launch, and this also exposes a manual trigger for Settings'
 * "Check for Updates" button.
 */
export function useAppUpdater(): AppUpdater {
  const [status, setStatus] = useState<UpdateStatus>({ state: 'idle' })

  useEffect(() => window.api.onUpdateStatus(setStatus), [])

  const checkForUpdates = useCallback(() => {
    window.api.checkForUpdates()
  }, [])

  const quitAndInstallUpdate = useCallback(() => {
    window.api.quitAndInstallUpdate()
  }, [])

  return { status, checkForUpdates, quitAndInstallUpdate }
}
