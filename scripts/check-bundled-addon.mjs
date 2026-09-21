// Fails the build if the Data Collector addon that gets bundled into the installer is
// missing. It comes from a git submodule (see .gitmodules), and a clone that never fetched
// it would otherwise build cleanly and ship an installer with no addon inside.
import { existsSync } from 'fs'
import { resolve } from 'path'

const manifest = resolve('vendor/WhatShouldIDoDataCollector/WhatShouldIDoDataCollector/WhatShouldIDoDataCollector.txt')

if (!existsSync(manifest)) {
  console.error(
    [
      'The bundled Data Collector addon is missing.',
      `Expected: ${manifest}`,
      '',
      'It is a git submodule. Fetch it with:',
      '  git submodule update --init',
      '',
      'On CI this means the checkout step is missing `submodules: true`, or its token cannot',
      'read the addon repo (see the ADDON_REPO_TOKEN secret in .github/workflows/release.yml).'
    ].join('\n')
  )
  process.exit(1)
}
