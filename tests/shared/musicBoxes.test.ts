import { describe, it, expect } from 'vitest'
import { MUSIC_BOXES, getMusicBox, musicBoxIconUrl, CURRENCY_LABEL } from '../../src/shared/musicBoxes'

describe('MUSIC_BOXES', () => {
  it('has no duplicate ids', () => {
    const ids = MUSIC_BOXES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every entry has a non-empty name and description', () => {
    for (const box of MUSIC_BOXES) {
      expect(box.name.length, `empty name for "${box.id}"`).toBeGreaterThan(0)
      expect(box.description.length, `empty description for "${box.id}"`).toBeGreaterThan(0)
    }
  })

  it('a priced box always carries cost text, and a reward box never does', () => {
    for (const box of MUSIC_BOXES) {
      if (box.currency === 'none') {
        expect(box.cost, `"${box.id}" is currency 'none' but has cost text`).toBeNull()
      } else {
        expect(box.cost, `"${box.id}" is priced but has no cost text`).not.toBeNull()
      }
    }
  })

  it('every currency used has a display label', () => {
    for (const box of MUSIC_BOXES) {
      expect(CURRENCY_LABEL[box.currency]).toBeTruthy()
    }
  })
})

describe('getMusicBox', () => {
  it('finds a known box by id', () => {
    expect(getMusicBox('music-box-blessings-of-stone')?.name).toBe('Blessings of Stone')
  })

  it('returns undefined for an unknown id', () => {
    expect(getMusicBox('not-a-real-music-box')).toBeUndefined()
  })
})

describe('musicBoxIconUrl', () => {
  it('builds a relative path so it works when packaged over file://', () => {
    expect(musicBoxIconUrl('music-box-blessings-of-stone')).toBe('./musicboxes/music-box-blessings-of-stone.jpg')
  })
})
