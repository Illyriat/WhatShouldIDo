import type { AddonStatus } from '@shared/types'
import { findSavedVariablesFiles } from './savedVarsLocator'

// The SavedVariables files this app reads.
export const ADDON_SAVED_VARS = ['USPF.lua', 'SkillLines.lua', 'DailyCraftStatus.lua'] as const

// Reports which addon files exist under the configured Documents folder. An addon
// only writes its file once you've logged in with it enabled, so a present file
// means "installed and has run".
export async function detectAddons(documentsOverride?: string): Promise<AddonStatus> {
  const entries = await Promise.all(
    ADDON_SAVED_VARS.map(async (fileName) => {
      const matches = await findSavedVariablesFiles(fileName, documentsOverride)
      return [fileName, matches.length > 0] as const
    })
  )
  return Object.fromEntries(entries)
}
