import { mkdtemp, writeFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

/**
 * Test-only helper (not matched by vitest.config.ts's `*.test.ts` include, so it
 * never runs as a suite itself): writes a minified Lua SavedVariables-style fixture
 * to a real temp file, since the parser reads from disk rather than accepting a
 * string directly. Call `cleanup()` (e.g. from `afterEach`) to remove every temp dir
 * this writer created.
 */
export function createLuaFixtureWriter(): {
  write: (fileName: string, content: string) => Promise<string>
  cleanup: () => Promise<void>
} {
  const dirs: string[] = []

  async function write(fileName: string, content: string): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), 'wsid-lua-'))
    dirs.push(dir)
    const filePath = join(dir, fileName)
    await writeFile(filePath, content, 'utf-8')
    return filePath
  }

  async function cleanup(): Promise<void> {
    await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
  }

  return { write, cleanup }
}
