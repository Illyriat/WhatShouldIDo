// IPC channel names, shared by the main handlers (src/main/ipc/*.ts) and the preload
// bridge (src/preload/index.ts) so the two sides can't drift.
export const IPC_CHANNELS = {
  getAccounts: 'get-accounts',
  getRecommendations: 'get-recommendations',
  getAppSettings: 'get-app-settings',
  setDocumentsPathOverride: 'set-documents-path-override',
  pickDocumentsFolder: 'pick-documents-folder',
  checkForUpdates: 'check-for-updates',
  quitAndInstallUpdate: 'quit-and-install-update',
  // main -> renderer push, not invoke/handle
  updateStatus: 'update-status'
} as const
