import { readFile, stat } from 'fs/promises'
import luaparse from 'luaparse'

// ESO SavedVariables files are minified single-line Lua of the form `VarName={...}`.
// Parse the table literal into a plain JS value via luaparse's AST, not eval.

type LuaTable = Record<string, unknown> | unknown[]

function tableConstructorToJs(node: luaparse.TableConstructorExpression): LuaTable {
  const arrayValues: unknown[] = []
  const objectEntries: Record<string, unknown> = {}
  let isArrayLike = true
  let nextIndex = 1

  for (const field of node.fields) {
    if (field.type === 'TableKeyString') {
      isArrayLike = false
      objectEntries[field.key.name] = luaExpressionToJs(field.value)
    } else if (field.type === 'TableKey') {
      const key = luaExpressionToJs(field.key)
      const value = luaExpressionToJs(field.value)
      if (typeof key === 'number' && key === nextIndex) {
        arrayValues.push(value)
        nextIndex += 1
      } else {
        isArrayLike = false
        objectEntries[String(key)] = value
      }
    } else if (field.type === 'TableValue') {
      arrayValues.push(luaExpressionToJs(field.value))
      nextIndex += 1
    }
  }

  if (isArrayLike && Object.keys(objectEntries).length === 0) {
    return arrayValues
  }

  // Mixed table: fold the array part in under 1-based string keys.
  arrayValues.forEach((v, i) => {
    objectEntries[String(i + 1)] = v
  })
  return objectEntries
}

function luaExpressionToJs(node: luaparse.Expression): unknown {
  switch (node.type) {
    case 'TableConstructorExpression':
      return tableConstructorToJs(node)
    case 'StringLiteral':
      // The source was read as latin1 (see parseSavedVariables), so UTF-8 byte
      // sequences arrive here raw. Decode them back to text.
      return node.value === null ? null : Buffer.from(node.value, 'latin1').toString('utf-8')
    case 'NumericLiteral':
      return node.value
    case 'BooleanLiteral':
      return node.value
    case 'NilLiteral':
      return null
    case 'UnaryExpression':
      if (node.operator === '-') {
        const value = luaExpressionToJs(node.argument)
        return typeof value === 'number' ? -value : value
      }
      return null
    default:
      return null
  }
}

interface CacheEntry {
  mtimeMs: number
  value: LuaTable | null
}

// One buildAccounts() call reads the same one or two SavedVariables files through
// several independent extractors (character list, dungeon quests, riding, Alliance
// Rank, Champion Points, Wealth, bank Wealth), and the renderer's getAccounts() and
// getRecommendations() both build the full account list from scratch on every
// refresh - so without this, a single refresh can parse the same file well over a
// dozen times. Cached here by (filePath, globalName), invalidated by the file's own
// mtime - self-correcting (any real SavedVariables write changes mtime, including
// picked up correctly by the auto-refresh watcher in src/main/autoRefresh.ts) and
// unbounded growth isn't a concern since this app only ever reads a small, stable set
// of addon files.
const cache = new Map<string, CacheEntry>()

function cacheKey(filePath: string, globalName: string): string {
  return `${filePath}\u0000${globalName}`
}

// Returns the value assigned to `globalName` (e.g. "WhatShouldIDoDataCollectorVars") in a
// SavedVariables file, or null if it isn't assigned there.
export async function parseSavedVariables(filePath: string, globalName: string): Promise<LuaTable | null> {
  const key = cacheKey(filePath, globalName)
  // .mtime (whole milliseconds) rather than the more precise .mtimeMs - utimes() can
  // only set millisecond precision, so comparing at that same precision is what's
  // actually reproducible; real SavedVariables writes are never fractions of a
  // millisecond apart anyway.
  const mtimeMs = (await stat(filePath)).mtime.getTime()

  const cached = cache.get(key)
  if (cached && cached.mtimeMs === mtimeMs) return cached.value

  const value = await parseSavedVariablesUncached(filePath, globalName)
  cache.set(key, { mtimeMs, value })
  return value
}

async function parseSavedVariablesUncached(filePath: string, globalName: string): Promise<LuaTable | null> {
  // Read latin1 so luaparse's 'pseudo-latin1' mode hands back string bytes intact.
  // Under the default mode StringLiteral.value is null; this also round-trips
  // non-ASCII character names.
  const source = await readFile(filePath, 'latin1')
  const ast = luaparse.parse(source, { comments: false, scope: false, encodingMode: 'pseudo-latin1' })

  for (const statement of ast.body) {
    if (statement.type !== 'AssignmentStatement') continue
    for (let i = 0; i < statement.variables.length; i++) {
      const variable = statement.variables[i]
      if (variable.type === 'Identifier' && variable.name === globalName) {
        const init = statement.init[i]
        if (init && init.type === 'TableConstructorExpression') {
          return tableConstructorToJs(init)
        }
      }
    }
  }

  return null
}
