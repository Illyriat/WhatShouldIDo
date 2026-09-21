import { readFile } from 'fs/promises'
import { join } from 'path'

export interface AddonManifest {
  // "## Version:" - the human-readable version, e.g. "1.5.0".
  version: string | null
  // "## AddOnVersion:" - the integer ESO compares against a "## DependsOn: Lib>=N" clause.
  addOnVersion: number | null
}

function headerValue(text: string, key: string): string | null {
  const match = new RegExp(`^##\\s*${key}\\s*:\\s*(.+)$`, 'im').exec(text)
  return match ? match[1].trim() : null
}

export function parseManifest(text: string): AddonManifest {
  const addOnVersion = Number.parseInt(headerValue(text, 'AddOnVersion') ?? '', 10)
  return {
    version: headerValue(text, 'Version'),
    addOnVersion: Number.isNaN(addOnVersion) ? null : addOnVersion
  }
}

// Reads `<addonDir>/<name>.txt`, or `<name>.addon` (ESO accepts either extension - the
// Data Collector uses .txt, LibUndauntedPledges uses .addon). Null when neither exists,
// which also means a folder with no manifest doesn't count as an installed addon.
export async function readManifest(addonDir: string, name: string): Promise<AddonManifest | null> {
  for (const extension of ['txt', 'addon']) {
    try {
      return parseManifest(await readFile(join(addonDir, `${name}.${extension}`), 'utf-8'))
    } catch {
      // try the next extension
    }
  }
  return null
}

// Negative when a < b, zero when equal, positive when a > b. Compares dot-separated
// numeric segments ("1.10.0" > "1.9.0"); a non-numeric segment counts as 0.
export function compareVersions(a: string, b: string): number {
  const parts = (version: string): number[] =>
    version.split('.').map((segment) => {
      const n = Number.parseInt(segment, 10)
      return Number.isNaN(n) ? 0 : n
    })
  const left = parts(a)
  const right = parts(b)
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0)
    if (diff !== 0) return diff
  }
  return 0
}
