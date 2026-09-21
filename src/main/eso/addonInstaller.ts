import { join } from 'path'
import { access, cp, mkdir, rename, rm } from 'fs/promises'
import type {
  AddonInstallStatus,
  DataCollectorInstallStatus,
  LibraryInstallStatus
} from '@shared/types'
import { listEsoProfileDirs } from './savedVarsLocator'
import { compareVersions, readManifest } from './addonManifest'

export const DATA_COLLECTOR_ADDON = 'WhatShouldIDoDataCollector'
// Third-party dependency of the Data Collector (`## DependsOn: LibUndauntedPledges>=102020`).
// Not ours to redistribute, so it's only ever detected, never installed.
export const LIBRARY_ADDON = 'LibUndauntedPledges'
export const LIBRARY_MIN_ADDON_VERSION = 102020

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

// Folders under "Elder Scrolls Online" that are real game profiles, so an unrelated
// folder never gets an AddOns directory created inside it.
async function listGameProfiles(documentsOverride?: string): Promise<string[]> {
  const profiles: string[] = []
  for (const dir of await listEsoProfileDirs(documentsOverride)) {
    const markers = ['AddOns', 'SavedVariables', 'UserSettings.txt']
    if ((await Promise.all(markers.map((marker) => exists(join(dir, marker))))).some(Boolean)) {
      profiles.push(dir)
    }
  }
  return profiles
}

function lowestVersion(versions: string[]): string | null {
  if (versions.length === 0) return null
  return versions.reduce((lowest, version) => (compareVersions(version, lowest) < 0 ? version : lowest))
}

// Every profile's installed Data Collector version (null = not installed there).
async function installedCollectorVersions(profiles: string[]): Promise<Map<string, string | null>> {
  const versions = new Map<string, string | null>()
  for (const profile of profiles) {
    const manifest = await readManifest(join(profile, 'AddOns', DATA_COLLECTOR_ADDON), DATA_COLLECTOR_ADDON)
    versions.set(profile, manifest ? (manifest.version ?? '0') : null)
  }
  return versions
}

async function collectorStatus(
  bundledDir: string,
  profiles: string[],
  installed: Map<string, string | null>
): Promise<DataCollectorInstallStatus> {
  const bundledVersion = (await readManifest(bundledDir, DATA_COLLECTOR_ADDON))?.version ?? null
  const installedVersion = lowestVersion([...installed.values()].filter((v): v is string => v !== null))

  if (profiles.length === 0) return { state: 'no-game-folder', bundledVersion, installedVersion }
  if (bundledVersion === null) return { state: 'bundle-missing', bundledVersion, installedVersion }
  if (installedVersion === null) return { state: 'not-installed', bundledVersion, installedVersion }
  const state = compareVersions(installedVersion, bundledVersion) < 0 ? 'update-available' : 'up-to-date'
  return { state, bundledVersion, installedVersion }
}

// The library has to sit next to the Data Collector, so it's judged on the profiles the
// Data Collector is installed in (or every profile, before it's installed anywhere).
async function libraryStatus(profiles: string[]): Promise<LibraryInstallStatus> {
  if (profiles.length === 0) return { state: 'no-game-folder', version: null }

  const versions: string[] = []
  let missing = false
  let outdated = false
  for (const profile of profiles) {
    const manifest = await readManifest(join(profile, 'AddOns', LIBRARY_ADDON), LIBRARY_ADDON)
    if (!manifest) {
      missing = true
      continue
    }
    if (manifest.version) versions.push(manifest.version)
    if ((manifest.addOnVersion ?? 0) < LIBRARY_MIN_ADDON_VERSION) outdated = true
  }

  const version = lowestVersion(versions)
  if (missing) return { state: 'missing', version }
  return { state: outdated ? 'outdated' : 'installed', version }
}

export async function getAddonInstallStatus(
  bundledDir: string,
  documentsOverride?: string
): Promise<AddonInstallStatus> {
  const profiles = await listGameProfiles(documentsOverride)
  const installed = await installedCollectorVersions(profiles)
  const collectorProfiles = profiles.filter((profile) => installed.get(profile) !== null)

  return {
    dataCollector: await collectorStatus(bundledDir, profiles, installed),
    library: await libraryStatus(collectorProfiles.length > 0 ? collectorProfiles : profiles)
  }
}

// Copies into a sibling staging folder first and swaps it in, so a failed copy never
// leaves a half-written addon in the folder the game loads from.
async function copyAddonInto(bundledDir: string, addOnsDir: string): Promise<void> {
  const target = join(addOnsDir, DATA_COLLECTOR_ADDON)
  const staging = join(addOnsDir, `.${DATA_COLLECTOR_ADDON}.installing`)

  await mkdir(addOnsDir, { recursive: true })
  await rm(staging, { recursive: true, force: true })
  await cp(bundledDir, staging, { recursive: true })
  await rm(target, { recursive: true, force: true })
  await rename(staging, target)
}

/**
 * Copies the bundled Data Collector into each game profile's AddOns folder and returns
 * the profile folders it wrote to.
 *
 * - 'install' also puts it in profiles that don't have it (an explicit user action).
 * - 'update' only refreshes profiles that already have it (safe to run silently at launch).
 *
 * Either way a profile whose installed version is already the bundled one or newer is left
 * alone, so this never downgrades (e.g. someone running a newer build from GitHub).
 */
export async function installDataCollector(
  bundledDir: string,
  mode: 'install' | 'update',
  documentsOverride?: string
): Promise<string[]> {
  const bundledVersion = (await readManifest(bundledDir, DATA_COLLECTOR_ADDON))?.version
  if (!bundledVersion) throw new Error('This build of the app does not include the Data Collector addon.')

  const profiles = await listGameProfiles(documentsOverride)
  const installed = await installedCollectorVersions(profiles)

  const written: string[] = []
  for (const profile of profiles) {
    const installedVersion = installed.get(profile) ?? null
    if (installedVersion === null && mode === 'update') continue
    if (installedVersion !== null && compareVersions(installedVersion, bundledVersion) >= 0) continue

    await copyAddonInto(bundledDir, join(profile, 'AddOns'))
    written.push(profile)
  }
  return written
}
