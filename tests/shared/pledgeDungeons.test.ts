import { describe, it, expect } from 'vitest'
import { findPledgeDungeonByName, PLEDGE_DUNGEONS } from '../../src/shared/pledgeDungeons'

describe('findPledgeDungeonByName', () => {
  it('matches an exact name', () => {
    expect(findPledgeDungeonByName('City of Ash II')?.key).toBe('CA2')
  })

  it('matches when eso-hub adds a leading "The " the stored name lacks', () => {
    // The exact regression this app shipped with: eso-hub scrapes "The Banished
    // Cells II" but this file stores "Banished Cells II" (no "The").
    expect(findPledgeDungeonByName('The Banished Cells II')?.key).toBe('BC2')
  })

  it('matches when both sides already have "The "', () => {
    expect(findPledgeDungeonByName('The Dread Cellar')?.key).toBe('TDC')
  })

  it('matches when the stored name has "The " but the scraped one does not', () => {
    expect(findPledgeDungeonByName('Cauldron')?.key).toBe('TC')
  })

  it('is case-insensitive and trims whitespace', () => {
    expect(findPledgeDungeonByName('  banished cells ii  ')?.key).toBe('BC2')
  })

  it('returns null for an unknown name', () => {
    expect(findPledgeDungeonByName('Not A Real Dungeon')).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(findPledgeDungeonByName('')).toBeNull()
  })

  it('every dungeon key is unique', () => {
    const keys = PLEDGE_DUNGEONS.map((d) => d.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('normalizing every stored name still resolves back to itself (no accidental collisions)', () => {
    for (const dungeon of PLEDGE_DUNGEONS) {
      expect(findPledgeDungeonByName(dungeon.dungeonName)?.key).toBe(dungeon.key)
    }
  })
})
