import { readFile } from 'fs/promises'
import luaparse from 'luaparse'

/**
 * ESO SavedVariables files are minified single-line Lua chunks of the form
 * `VarName={...}`. This parses just the table literal into a plain JS value,
 * using luaparse's AST rather than eval (these files aren't attacker-controlled,
 * but there's no reason to execute arbitrary Lua either).
 */

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

  // Mixed array+keyed table: fold array part in with 1-based numeric string keys
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
      // Source was read as latin1 + parsed with encodingMode 'pseudo-latin1' (see
      // parseSavedVariables) so multi-byte UTF-8 sequences in character names etc.
      // survive intact as raw bytes here - decode them back to real text.
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

/**
 * Parses a SavedVariables .lua file and returns the value assigned to `globalName`
 * (e.g. "USPF_Settings"), or null if that global isn't assigned in the file.
 */
export async function parseSavedVariables(filePath: string, globalName: string): Promise<LuaTable | null> {
  // Read as latin1 (byte-for-byte, no UTF-8 decoding) so luaparse's
  // 'pseudo-latin1' encoding mode can hand back string literal bytes losslessly -
  // needed both to populate StringLiteral.value at all (luaparse leaves it null
  // under the default 'none' mode) and to correctly round-trip non-ASCII
  // characters in e.g. character names.
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
