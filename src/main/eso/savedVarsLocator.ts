import { homedir } from 'os'
import { join } from 'path'
import { readdir, access } from 'fs/promises'
import { constants } from 'fs'

// Every folder directly under Documents/Elder Scrolls Online/. <profile> is usually
// "live" but can be "liveeu", "pts", etc., so scan rather than hardcode.
export async function listEsoProfileDirs(documentsOverride?: string): Promise<string[]> {
  const documentsDir = documentsOverride ?? join(homedir(), 'Documents')
  const esoDir = join(documentsDir, 'Elder Scrolls Online')

  try {
    return (await readdir(esoDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(esoDir, entry.name))
  } catch {
    return []
  }
}

// Finds `<fileName>` in every Documents/Elder Scrolls Online/<profile>/SavedVariables/
// folder.
export async function findSavedVariablesFiles(fileName: string, documentsOverride?: string): Promise<string[]> {
  const found: string[] = []
  for (const profileDir of await listEsoProfileDirs(documentsOverride)) {
    const candidate = join(profileDir, 'SavedVariables', fileName)
    try {
      await access(candidate, constants.R_OK)
      found.push(candidate)
    } catch {
      // not in this profile
    }
  }

  return found
}
