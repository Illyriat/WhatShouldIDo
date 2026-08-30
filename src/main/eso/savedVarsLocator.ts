import { homedir } from 'os'
import { join } from 'path'
import { readdir, access } from 'fs/promises'
import { constants } from 'fs'

// Finds `<fileName>` in every Documents/Elder Scrolls Online/<profile>/SavedVariables/
// folder. <profile> is usually "live" but can be "liveeu", "pts", etc., so scan rather
// than hardcode.
export async function findSavedVariablesFiles(fileName: string, documentsOverride?: string): Promise<string[]> {
  const documentsDir = documentsOverride ?? join(homedir(), 'Documents')
  const esoDir = join(documentsDir, 'Elder Scrolls Online')

  let profiles: string[]
  try {
    profiles = (await readdir(esoDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  } catch {
    return []
  }

  const found: string[] = []
  for (const profile of profiles) {
    const candidate = join(esoDir, profile, 'SavedVariables', fileName)
    try {
      await access(candidate, constants.R_OK)
      found.push(candidate)
    } catch {
      // not in this profile
    }
  }

  return found
}
