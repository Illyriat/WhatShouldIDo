import { mkdtemp, writeFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

// Writes Lua SavedVariables fixtures to real temp files, since the parser reads from
// disk. Call cleanup() from afterEach to delete the temp dirs.
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
