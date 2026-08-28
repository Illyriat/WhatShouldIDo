/**
 * Single source of truth for IPC channel names, shared by main (registers handlers)
 * and preload (invokes them) so the two sides can never drift out of sync on a typo'd
 * string - see src/main/ipc/*.ts for the `register*IpcHandlers` functions that consume
 * these, and src/preload/index.ts for the renderer-facing `window.api` that invokes them.
 */
export const IPC_CHANNELS = {
  getAccounts: 'get-accounts',
  getRecommendations: 'get-recommendations',
  getAppSettings: 'get-app-settings',
  setDocumentsPathOverride: 'set-documents-path-override',
  pickDocumentsFolder: 'pick-documents-folder',
  checkForUpdates: 'check-for-updates',
  quitAndInstallUpdate: 'quit-and-install-update',
  /** main -> renderer push, not invoke/handle - see registerUpdateIpcHandlers */
  updateStatus: 'update-status'
} as const
