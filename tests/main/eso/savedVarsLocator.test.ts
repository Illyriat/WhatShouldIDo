import { describe, it, expect, afterEach } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { findSavedVariablesFiles } from '../../../src/main/eso/savedVarsLocator'

const tmpDirs: string[] = []
afterEach(async () => {
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

async function makeDocumentsDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'wsid-locator-'))
  tmpDirs.push(dir)
  return dir
}

describe('findSavedVariablesFiles', () => {
  it('finds the file under every profile that has it (e.g. "live" and "pts")', async () => {
    const documentsDir = await makeDocumentsDir()
    for (const profile of ['live', 'pts']) {
      const dir = join(documentsDir, 'Elder Scrolls Online', profile, 'SavedVariables')
      await mkdir(dir, { recursive: true })
      await writeFile(join(dir, 'WhatShouldIDoDataCollector.lua'), 'WhatShouldIDoDataCollectorVars={}', 'utf-8')
    }

    const found = await findSavedVariablesFiles('WhatShouldIDoDataCollector.lua', documentsDir)
    expect(found).toHaveLength(2)
    expect(found.some((p) => p.includes('live'))).toBe(true)
    expect(found.some((p) => p.includes('pts'))).toBe(true)
  })

  it('skips a profile that does not have the requested file, without throwing', async () => {
    const documentsDir = await makeDocumentsDir()
    const withFile = join(documentsDir, 'Elder Scrolls Online', 'live', 'SavedVariables')
    const withoutFile = join(documentsDir, 'Elder Scrolls Online', 'pts', 'SavedVariables')
    await mkdir(withFile, { recursive: true })
    await mkdir(withoutFile, { recursive: true })
    await writeFile(join(withFile, 'WhatShouldIDoDataCollector.lua'), 'WhatShouldIDoDataCollectorVars={}', 'utf-8')

    const found = await findSavedVariablesFiles('WhatShouldIDoDataCollector.lua', documentsDir)
    expect(found).toHaveLength(1)
    expect(found[0]).toContain('live')
  })

  it('returns an empty list when there is no "Elder Scrolls Online" folder at all', async () => {
    const documentsDir = await makeDocumentsDir()
    expect(await findSavedVariablesFiles('WhatShouldIDoDataCollector.lua', documentsDir)).toEqual([])
  })
})
