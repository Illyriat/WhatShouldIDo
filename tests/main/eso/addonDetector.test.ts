import { describe, it, expect, afterEach } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { detectAddons } from '../../../src/main/eso/addonDetector'

const tmpDirs: string[] = []
afterEach(async () => {
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

async function makeDocumentsDir(files: string[]): Promise<string> {
  const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-addons-'))
  tmpDirs.push(documentsDir)
  const savedVarsDir = join(documentsDir, 'Elder Scrolls Online', 'live', 'SavedVariables')
  await mkdir(savedVarsDir, { recursive: true })
  for (const file of files) {
    await writeFile(join(savedVarsDir, file), `${file.replace('.lua', '')}Vars={}`, 'utf-8')
  }
  return documentsDir
}

describe('detectAddons', () => {
  it('flags each addon file that is present and each that is missing', async () => {
    const documentsDir = await makeDocumentsDir(['USPF.lua', 'SkillLines.lua'])

    expect(await detectAddons(documentsDir)).toEqual({
      'USPF.lua': true,
      'SkillLines.lua': true,
      'DailyCraftStatus.lua': false
    })
  })

  it('reports every addon missing when there is no ESO folder', async () => {
    const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-addons-'))
    tmpDirs.push(documentsDir)

    expect(await detectAddons(documentsDir)).toEqual({
      'USPF.lua': false,
      'SkillLines.lua': false,
      'DailyCraftStatus.lua': false
    })
  })

  it('detects a file that exists under any profile, not just "live"', async () => {
    const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-addons-'))
    tmpDirs.push(documentsDir)
    const ptsDir = join(documentsDir, 'Elder Scrolls Online', 'pts', 'SavedVariables')
    await mkdir(ptsDir, { recursive: true })
    await writeFile(join(ptsDir, 'DailyCraftStatus.lua'), 'DailyCraftStatusVars={}', 'utf-8')

    const status = await detectAddons(documentsDir)
    expect(status['DailyCraftStatus.lua']).toBe(true)
  })
})
