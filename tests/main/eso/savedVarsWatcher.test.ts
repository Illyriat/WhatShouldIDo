import { describe, it, expect, afterEach } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { setTimeout as sleep } from 'timers/promises'
import { watchSavedVariables } from '../../../src/main/eso/savedVarsWatcher'

const tmpDirs: string[] = []
const disposers: (() => void)[] = []

afterEach(async () => {
  disposers.splice(0).forEach((dispose) => dispose())
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

async function makeSavedVarsDir(): Promise<{ documentsDir: string; savedVarsDir: string }> {
  const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-watch-'))
  tmpDirs.push(documentsDir)
  const savedVarsDir = join(documentsDir, 'Elder Scrolls Online', 'live', 'SavedVariables')
  await mkdir(savedVarsDir, { recursive: true })
  return { documentsDir, savedVarsDir }
}

// The watcher's directory scan is async; give it a moment to attach before writing.
async function settleWatcherSetup(): Promise<void> {
  await sleep(150)
}

describe('watchSavedVariables', () => {
  it('calls onChange (debounced) when a watched file changes', async () => {
    const { documentsDir, savedVarsDir } = await makeSavedVarsDir()
    let calls = 0
    const dispose = watchSavedVariables(documentsDir, () => calls++, {
      watchedFileNames: ['Test.lua'],
      debounceMs: 50
    })
    disposers.push(dispose)
    await settleWatcherSetup()

    await writeFile(join(savedVarsDir, 'Test.lua'), 'TestVars={}', 'utf-8')
    await sleep(300)

    expect(calls).toBe(1)
  })

  it('ignores changes to files not in the watched list', async () => {
    const { documentsDir, savedVarsDir } = await makeSavedVarsDir()
    let calls = 0
    const dispose = watchSavedVariables(documentsDir, () => calls++, {
      watchedFileNames: ['Test.lua'],
      debounceMs: 50
    })
    disposers.push(dispose)
    await settleWatcherSetup()

    await writeFile(join(savedVarsDir, 'SomeOtherAddon.lua'), 'X={}', 'utf-8')
    await sleep(300)

    expect(calls).toBe(0)
  })

  it('debounces multiple rapid changes into a single onChange call', async () => {
    const { documentsDir, savedVarsDir } = await makeSavedVarsDir()
    let calls = 0
    const dispose = watchSavedVariables(documentsDir, () => calls++, {
      watchedFileNames: ['Test.lua'],
      debounceMs: 150
    })
    disposers.push(dispose)
    await settleWatcherSetup()

    const filePath = join(savedVarsDir, 'Test.lua')
    await writeFile(filePath, 'TestVars={a=1}', 'utf-8')
    await sleep(30)
    await writeFile(filePath, 'TestVars={a=2}', 'utf-8')
    await sleep(30)
    await writeFile(filePath, 'TestVars={a=3}', 'utf-8')
    await sleep(400)

    expect(calls).toBe(1)
  })

  it('does nothing when the Elder Scrolls Online folder does not exist', async () => {
    const documentsDir = await mkdtemp(join(tmpdir(), 'wsid-watch-empty-'))
    tmpDirs.push(documentsDir)
    let calls = 0

    const dispose = watchSavedVariables(documentsDir, () => calls++, {
      watchedFileNames: ['Test.lua'],
      debounceMs: 50
    })
    disposers.push(dispose)
    await sleep(300)

    expect(calls).toBe(0)
  })

  it('stops calling onChange after dispose', async () => {
    const { documentsDir, savedVarsDir } = await makeSavedVarsDir()
    let calls = 0
    const dispose = watchSavedVariables(documentsDir, () => calls++, {
      watchedFileNames: ['Test.lua'],
      debounceMs: 50
    })
    await settleWatcherSetup()

    dispose()
    await writeFile(join(savedVarsDir, 'Test.lua'), 'TestVars={}', 'utf-8')
    await sleep(300)

    expect(calls).toBe(0)
  })
})
