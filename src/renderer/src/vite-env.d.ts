/// <reference types="vite/client" />

import '../../preload/index.d'

declare global {
  // Injected at build time (electron.vite.config.ts).
  const __APP_VERSION__: string
  // Injected at build time: UTC timestamp, YYYYMMDD.HHmm.
  const __BUILD_NUMBER__: string
}
