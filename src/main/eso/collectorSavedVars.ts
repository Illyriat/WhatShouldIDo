// Shared by the extractors that read WhatShouldIDoDataCollector.lua: narrowing helpers
// for the untyped values the Lua parser hands back.

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
