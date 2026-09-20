import { describe, it, expect } from 'vitest'
import { findPledgeDungeonByZoneId, PLEDGE_DUNGEONS, PLEDGE_MASTERS } from '../../src/shared/pledgeDungeons'

describe('findPledgeDungeonByZoneId', () => {
  it('matches a known zone id', () => {
    expect(findPledgeDungeonByZoneId(681)?.key).toBe('CA2')
  })

  it('returns null for an unknown zone id', () => {
    expect(findPledgeDungeonByZoneId(999999)).toBeNull()
  })

  it('every dungeon key is unique', () => {
    const keys = PLEDGE_DUNGEONS.map((d) => d.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('every dungeon zoneId is unique', () => {
    const zoneIds = PLEDGE_DUNGEONS.map((d) => d.zoneId)
    expect(new Set(zoneIds).size).toBe(zoneIds.length)
  })

  it('resolving every stored zoneId resolves back to itself (no accidental collisions)', () => {
    for (const dungeon of PLEDGE_DUNGEONS) {
      expect(findPledgeDungeonByZoneId(dungeon.zoneId)?.key).toBe(dungeon.key)
    }
  })
})

describe('PLEDGE_MASTERS', () => {
  it('lists the three pledge givers in base1/base2/dlc1 order', () => {
    expect(PLEDGE_MASTERS.map((m) => m.name)).toEqual([
      'Maj al-Ragath',
      'Glirion the Redbeard',
      'Urgarlag Chief-bane'
    ])
    expect(PLEDGE_MASTERS.map((m) => m.tier)).toEqual(['base', 'base', 'dlc'])
  })
})
