import { readFile } from 'fs/promises'
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

// Returns the value assigned to `globalName` (e.g. "USPF_Settings") in a
// SavedVariables file, or null if it isn't assigned there.
export async function parseSavedVariables(filePath: string, globalName: string): Promise<LuaTable | null> {
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
