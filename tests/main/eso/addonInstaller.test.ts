import { describe, it, expect, afterEach } from 'vitest'
import { mkdtemp, mkdir, writeFile, readFile, rm, readdir } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { getAddonInstallStatus, installDataCollector } from '../../../src/main/eso/addonInstaller'

const tmpDirs: string[] = []
afterEach(async () => {
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

async function tempDir(prefix: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), prefix))
  tmpDirs.push(dir)
  return dir
}

function collectorManifest(version: string): string {
  return `## Title: What Should I Do - Data Collector\n## Version: ${version}\n\nMain.lua\n`
}

// A stand-in for the bundled addon folder (manifest + a nested file).
async function makeBundle(version: string): Promise<string> {
  const dir = await tempDir('wsid-bundle-')
  await writeFile(join(dir, 'WhatShouldIDoDataCollector.txt'), collectorManifest(version), 'utf-8')
  await writeFile(join(dir, 'Main.lua'), `-- bundled ${version}`, 'utf-8')
  await mkdir(join(dir, 'data'))
  await writeFile(join(dir, 'data', 'Wealth.lua'), '-- wealth', 'utf-8')
  return dir
}

// Documents folder with an ESO profile per name. A profile counts as a real game profile
// once it has AddOns/SavedVariables/UserSettings.txt, so each gets a UserSettings.txt.
async function makeDocuments(profiles: string[]): Promise<string> {
  const documentsDir = await tempDir('wsid-docs-')
  for (const profile of profiles) {
    const profileDir = join(documentsDir, 'Elder Scrolls Online', profile)
    await mkdir(profileDir, { recursive: true })
    await writeFile(join(profileDir, 'UserSettings.txt'), '', 'utf-8')
  }
  return documentsDir
}

async function installCollector(documentsDir: string, profile: string, version: string): Promise<string> {
  const dir = join(documentsDir, 'Elder Scrolls Online', profile, 'AddOns', 'WhatShouldIDoDataCollector')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'WhatShouldIDoDataCollector.txt'), collectorManifest(version), 'utf-8')
  await writeFile(join(dir, 'Main.lua'), `-- installed ${version}`, 'utf-8')
  return dir
}

async function installLibrary(documentsDir: string, profile: string, addOnVersion: number): Promise<void> {
  const dir = join(documentsDir, 'Elder Scrolls Online', profile, 'AddOns', 'LibUndauntedPledges')
  await mkdir(dir, { recursive: true })
  await writeFile(
    join(dir, 'LibUndauntedPledges.addon'),
    `## Version: 1.2.2\n## AddOnVersion: ${addOnVersion}\n`,
    'utf-8'
  )
}

describe('getAddonInstallStatus - Data Collector', () => {
  it('reports no-game-folder when there is no Elder Scrolls Online folder', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await tempDir('wsid-docs-')

    const { dataCollector } = await getAddonInstallStatus(bundle, documentsDir)
    expect(dataCollector).toEqual({ state: 'no-game-folder', bundledVersion: '1.5.0', installedVersion: null })
  })

  it('ignores a folder under Elder Scrolls Online that is not a game profile', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await tempDir('wsid-docs-')
    await mkdir(join(documentsDir, 'Elder Scrolls Online', 'Some Random Folder'), { recursive: true })

    expect((await getAddonInstallStatus(bundle, documentsDir)).dataCollector.state).toBe('no-game-folder')
  })

  it('reports not-installed when the profile has no addon', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])

    const { dataCollector } = await getAddonInstallStatus(bundle, documentsDir)
    expect(dataCollector).toEqual({ state: 'not-installed', bundledVersion: '1.5.0', installedVersion: null })
  })

  it('reports update-available when the installed copy is older', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])
    await installCollector(documentsDir, 'live', '1.4.1')

    const { dataCollector } = await getAddonInstallStatus(bundle, documentsDir)
    expect(dataCollector).toEqual({ state: 'update-available', bundledVersion: '1.5.0', installedVersion: '1.4.1' })
  })

  it('reports up-to-date for an equal install, and for a newer one (never downgrades)', async () => {
    const bundle = await makeBundle('1.5.0')
    const equal = await makeDocuments(['live'])
    await installCollector(equal, 'live', '1.5.0')
    const newer = await makeDocuments(['live'])
    await installCollector(newer, 'live', '1.6.0')

    expect((await getAddonInstallStatus(bundle, equal)).dataCollector.state).toBe('up-to-date')
    expect((await getAddonInstallStatus(bundle, newer)).dataCollector.state).toBe('up-to-date')
  })

  it('judges by the oldest install when several profiles have it', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live', 'liveeu'])
    await installCollector(documentsDir, 'live', '1.5.0')
    await installCollector(documentsDir, 'liveeu', '1.3.0')

    const { dataCollector } = await getAddonInstallStatus(bundle, documentsDir)
    expect(dataCollector.state).toBe('update-available')
    expect(dataCollector.installedVersion).toBe('1.3.0')
  })

  it('treats a folder with no manifest as not installed', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])
    const dir = join(documentsDir, 'Elder Scrolls Online', 'live', 'AddOns', 'WhatShouldIDoDataCollector')
    await mkdir(dir, { recursive: true })

    expect((await getAddonInstallStatus(bundle, documentsDir)).dataCollector.state).toBe('not-installed')
  })

  it('reports bundle-missing when this build has no addon inside it', async () => {
    const emptyBundle = await tempDir('wsid-bundle-')
    const documentsDir = await makeDocuments(['live'])

    expect((await getAddonInstallStatus(emptyBundle, documentsDir)).dataCollector.state).toBe('bundle-missing')
  })
})

describe('getAddonInstallStatus - LibUndauntedPledges', () => {
  it('is missing when the profile has no library', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])

    expect((await getAddonInstallStatus(bundle, documentsDir)).library).toEqual({ state: 'missing', version: null })
  })

  it('is installed when AddOnVersion meets the 102020 minimum', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])
    await installLibrary(documentsDir, 'live', 102020)

    expect((await getAddonInstallStatus(bundle, documentsDir)).library).toEqual({ state: 'installed', version: '1.2.2' })
  })

  it('is outdated when AddOnVersion is below the minimum', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])
    await installLibrary(documentsDir, 'live', 102010)

    expect((await getAddonInstallStatus(bundle, documentsDir)).library.state).toBe('outdated')
  })

  it('only judges the profiles the Data Collector is installed in', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live', 'pts'])
    await installCollector(documentsDir, 'live', '1.5.0')
    await installLibrary(documentsDir, 'live', 102020)
    // pts has neither - irrelevant, since the addon isn't installed there.

    expect((await getAddonInstallStatus(bundle, documentsDir)).library.state).toBe('installed')
  })

  it('is missing if any profile that has the Data Collector lacks the library', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live', 'liveeu'])
    await installCollector(documentsDir, 'live', '1.5.0')
    await installCollector(documentsDir, 'liveeu', '1.5.0')
    await installLibrary(documentsDir, 'live', 102020)

    expect((await getAddonInstallStatus(bundle, documentsDir)).library.state).toBe('missing')
  })
})

describe('installDataCollector', () => {
  it("'install' copies the whole addon, including nested folders, into a profile without it", async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])

    const written = await installDataCollector(bundle, 'install', documentsDir)

    const target = join(documentsDir, 'Elder Scrolls Online', 'live', 'AddOns', 'WhatShouldIDoDataCollector')
    expect(written).toEqual([join(documentsDir, 'Elder Scrolls Online', 'live')])
    expect(await readFile(join(target, 'Main.lua'), 'utf-8')).toBe('-- bundled 1.5.0')
    expect(await readFile(join(target, 'data', 'Wealth.lua'), 'utf-8')).toBe('-- wealth')
    expect((await getAddonInstallStatus(bundle, documentsDir)).dataCollector.state).toBe('up-to-date')
  })

  it("'install' creates the AddOns folder when the profile doesn't have one yet", async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])

    await installDataCollector(bundle, 'install', documentsDir)

    const addOns = await readdir(join(documentsDir, 'Elder Scrolls Online', 'live', 'AddOns'))
    expect(addOns).toEqual(['WhatShouldIDoDataCollector'])
  })

  it("'update' replaces an older install and drops files the new version no longer has", async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])
    const installed = await installCollector(documentsDir, 'live', '1.4.1')
    await writeFile(join(installed, 'Retired.lua'), '-- removed upstream', 'utf-8')

    const written = await installDataCollector(bundle, 'update', documentsDir)

    expect(written).toHaveLength(1)
    expect(await readFile(join(installed, 'Main.lua'), 'utf-8')).toBe('-- bundled 1.5.0')
    expect(await readdir(installed)).not.toContain('Retired.lua')
  })

  it("'update' never installs into a profile that doesn't already have the addon", async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live', 'pts'])
    await installCollector(documentsDir, 'live', '1.4.1')

    const written = await installDataCollector(bundle, 'update', documentsDir)

    expect(written).toEqual([join(documentsDir, 'Elder Scrolls Online', 'live')])
    expect(await readdir(join(documentsDir, 'Elder Scrolls Online', 'pts'))).not.toContain('AddOns')
  })

  it("'update' with nothing installed anywhere writes nothing", async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])

    expect(await installDataCollector(bundle, 'update', documentsDir)).toEqual([])
    expect(await readdir(join(documentsDir, 'Elder Scrolls Online', 'live'))).not.toContain('AddOns')
  })

  it('never overwrites an install that is the same version or newer', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live', 'liveeu'])
    const equal = await installCollector(documentsDir, 'live', '1.5.0')
    const newer = await installCollector(documentsDir, 'liveeu', '1.6.0')

    expect(await installDataCollector(bundle, 'install', documentsDir)).toEqual([])
    expect(await readFile(join(equal, 'Main.lua'), 'utf-8')).toBe('-- installed 1.5.0')
    expect(await readFile(join(newer, 'Main.lua'), 'utf-8')).toBe('-- installed 1.6.0')
  })

  it("'install' also brings older profiles up to date while adding missing ones", async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live', 'liveeu'])
    await installCollector(documentsDir, 'live', '1.4.0')

    const written = await installDataCollector(bundle, 'install', documentsDir)
    expect(written).toHaveLength(2)
  })

  it('leaves no staging folder behind', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])

    await installDataCollector(bundle, 'install', documentsDir)

    const addOns = await readdir(join(documentsDir, 'Elder Scrolls Online', 'live', 'AddOns'))
    expect(addOns.filter((name) => name.startsWith('.'))).toEqual([])
  })

  it('does not touch other addons in the AddOns folder', async () => {
    const bundle = await makeBundle('1.5.0')
    const documentsDir = await makeDocuments(['live'])
    await installLibrary(documentsDir, 'live', 102020)

    await installDataCollector(bundle, 'install', documentsDir)

    const addOns = (await readdir(join(documentsDir, 'Elder Scrolls Online', 'live', 'AddOns'))).sort()
    expect(addOns).toEqual(['LibUndauntedPledges', 'WhatShouldIDoDataCollector'])
  })

  it('throws when the build has no bundled addon, instead of half-installing', async () => {
    const emptyBundle = await tempDir('wsid-bundle-')
    const documentsDir = await makeDocuments(['live'])

    await expect(installDataCollector(emptyBundle, 'install', documentsDir)).rejects.toThrow(/does not include/)
  })
})
