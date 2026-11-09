import { describe, it, expect } from 'vitest'
import { ARENAS, SOLO_DUNGEONS } from '../../src/shared/skillPointActivities'
import { PLEDGE_DUNGEONS } from '../../src/shared/pledgeDungeons'

const ACTIVITIES = [...SOLO_DUNGEONS, ...ARENAS]

describe('skill point activities', () => {
  it('lists the two solo dungeons and the two skill point arenas', () => {
    expect(SOLO_DUNGEONS.map((a) => a.key)).toEqual(['SOLO_MHK', 'SOLO_MOS'])
    expect(ARENAS.map((a) => a.key)).toEqual(['ARENA_MA', 'ARENA_IA'])
  })

  // These share each character's completedDungeonKeys with the pledge dungeons, so a
  // clashing key would mark the wrong thing as done.
  it('reuses no key from each other or from PLEDGE_DUNGEONS', () => {
    const keys = [...PLEDGE_DUNGEONS.map((d) => d.key), ...ACTIVITIES.map((a) => a.key)]
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('reuses no quest id from each other or from PLEDGE_DUNGEONS', () => {
    const questIds = [...PLEDGE_DUNGEONS.map((d) => d.questId), ...ACTIVITIES.flatMap((a) => a.questIds)]
    expect(new Set(questIds).size).toBe(questIds.length)
  })

  it('gives every entry a name and at least one quest id', () => {
    for (const activity of ACTIVITIES) {
      expect(activity.dungeonName.length).toBeGreaterThan(0)
      expect(activity.questIds.length).toBeGreaterThan(0)
    }
  })
})
