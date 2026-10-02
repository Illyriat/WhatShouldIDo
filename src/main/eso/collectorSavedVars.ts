import { parseSavedVariables } from './luaSavedVarsParser'

// Shared by the extractors that read WhatShouldIDoDataCollector.lua: the way into the
// addon's saved table, and narrowing helpers for the untyped values the Lua parser hands
// back.

export type PlainObject = Record<string, unknown>

export function asPlainObject(value: unknown): PlainObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as PlainObject
  }
  return null
}

export function asNumber(value: unknown): number | null {
  return typeof value === 'number' ? value : null
}

// The addon's saved table: `WhatShouldIDoDataCollectorVars["Default"]`, holding one
// "@Account" entry per account. Null if the file doesn't have that shape.
export async function readDefaultProfile(filePath: string): Promise<PlainObject | null> {
  const parsed = await parseSavedVariables(filePath, 'WhatShouldIDoDataCollectorVars')
  return asPlainObject(asPlainObject(parsed)?.['Default'])
}

// A realm bucket under $AccountWide holds one entry per character, keyed by its
// all-digits id, next to keys that aren't characters ("version", "championPoints", ...).
export function isCharId(key: string): boolean {
  return /^\d+$/.test(key)
}
