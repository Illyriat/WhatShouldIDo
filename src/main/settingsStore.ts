import { app } from 'electron'
import { join, dirname } from 'path'
import { readFile, writeFile, mkdir } from 'fs/promises'

interface PersistedSettings {
  documentsPathOverride?: string
}

function settingsFilePath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

export async function readPersistedSettings(): Promise<PersistedSettings> {
  try {
    const raw = await readFile(settingsFilePath(), 'utf-8')
    return JSON.parse(raw) as PersistedSettings
  } catch {
    return {}
  }
}

export async function writePersistedSettings(settings: PersistedSettings): Promise<void> {
  const filePath = settingsFilePath()
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8')
}
