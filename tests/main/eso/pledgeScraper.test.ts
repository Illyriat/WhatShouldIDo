import { describe, it, expect } from 'vitest'
import {
  currentEsoDay,
  parseScrapedNames,
  parseUpcomingScrapedNames,
  resolvePledges
} from '../../../src/main/eso/pledgeScraper'

describe('parseScrapedNames', () => {
  it('extracts dungeon names from header <img alt> tags, in document order', () => {
    const html = `
      <div>
        <img alt="Banished Cells I header" />
        <img alt="Elden Hollow II header" />
        <img alt="Vaults of Madness header" />
      </div>
    `
    expect(parseScrapedNames(html)).toEqual(['Banished Cells I', 'Elden Hollow II', 'Vaults of Madness'])
  })

  it('caps at 3 even if more header images are present', () => {
    const html = `
      <img alt="A header" /><img alt="B header" /><img alt="C header" /><img alt="D header" />
    `
    expect(parseScrapedNames(html)).toEqual(['A', 'B', 'C'])
  })

  it('trims incidental leading whitespace before the name', () => {
    // the "img[alt$=' header']" selector requires an exact " header" suffix, so only
    // leading whitespace before the name (not trailing space after "header") is realistic
    const html = `<img alt="  The Banished Cells II header" />`
    expect(parseScrapedNames(html)).toEqual(['The Banished Cells II'])
  })

  it('returns fewer than 3 if fewer header images are present', () => {
    const html = `<img alt="Only One header" />`
    expect(parseScrapedNames(html)).toEqual(['Only One'])
  })

  it('ignores images whose alt does not end in " header"', () => {
    const html = `<img alt="Some other icon" /><img alt="Real Dungeon header" />`
    expect(parseScrapedNames(html)).toEqual(['Real Dungeon'])
  })
})

function upcomingRow(dayLabel: string, names: string[]): string {
  const cells = names
    .map(
      (name) => `
        <td class="px-2 py-1"><a href="#">${name}</a></td>`
    )
    .join('')
  return `
    <tr>
      <td class="px-2 py-1">${dayLabel}</td>${cells}
    </tr>`
}

describe('parseUpcomingScrapedNames', () => {
  it('extracts each row of the upcoming table, nearest day first', () => {
    const html = `
      <section id="upcoming">
        <table><tbody>
          ${upcomingRow('In 1 day', ['Wayrest Sewers II', 'Arx Corinium', 'March of Sacrifices'])}
          ${upcomingRow('In 2 days', ['Fungal Grotto I', "Selene's Web", 'Depths of Malatar'])}
        </tbody></table>
      </section>
    `
    expect(parseUpcomingScrapedNames(html, 5)).toEqual([
      ['Wayrest Sewers II', 'Arx Corinium', 'March of Sacrifices'],
      ['Fungal Grotto I', "Selene's Web", 'Depths of Malatar']
    ])
  })

  it('caps at the requested limit even if more rows are present', () => {
    const html = `
      <section id="upcoming">
        <table><tbody>
          ${upcomingRow('In 1 day', ['A', 'B', 'C'])}
          ${upcomingRow('In 2 days', ['D', 'E', 'F'])}
          ${upcomingRow('In 3 days', ['G', 'H', 'I'])}
        </tbody></table>
      </section>
    `
    expect(parseUpcomingScrapedNames(html, 2)).toEqual([
      ['A', 'B', 'C'],
      ['D', 'E', 'F']
    ])
  })

  it('skips a row that does not have exactly 3 dungeon cells', () => {
    const html = `
      <section id="upcoming">
        <table><tbody>
          ${upcomingRow('In 1 day', ['A', 'B'])}
          ${upcomingRow('In 2 days', ['D', 'E', 'F'])}
        </tbody></table>
      </section>
    `
    expect(parseUpcomingScrapedNames(html, 5)).toEqual([['D', 'E', 'F']])
  })

  it('returns an empty array when the upcoming section is missing', () => {
    expect(parseUpcomingScrapedNames('<div>no upcoming section here</div>', 5)).toEqual([])
  })
})

describe('resolvePledges', () => {
  it('resolves recognized names to their dungeon, in the fixed master/tier order', () => {
    const pledges = resolvePledges(['Banished Cells I', 'City of Ash II', 'The Dread Cellar'])
    expect(pledges.map((p) => p.master.name)).toEqual([
      'Maj al-Ragath',
      'Glirion the Redbeard',
      'Urgarlag Chief-bane'
    ])
    expect(pledges.map((p) => p.master.tier)).toEqual(['base', 'base', 'dlc'])
    expect(pledges.map((p) => p.dungeon?.key)).toEqual(['BC1', 'CA2', 'TDC'])
  })

  it('leaves dungeon null (without throwing) for a name that cannot be mapped', () => {
    const pledges = resolvePledges(['Not A Real Dungeon', 'City of Ash II', 'The Dread Cellar'])
    expect(pledges[0].dungeon).toBeNull()
    expect(pledges[0].scrapedName).toBe('Not A Real Dungeon')
  })

  it('handles fewer than 3 scraped names without throwing', () => {
    const pledges = resolvePledges(['Banished Cells I'])
    expect(pledges).toHaveLength(3)
    expect(pledges[1].dungeon).toBeNull()
    expect(pledges[1].scrapedName).toBe('')
    expect(pledges[2].dungeon).toBeNull()
    expect(pledges[2].scrapedName).toBe('')
  })
})

describe('currentEsoDay', () => {
  it('before the 10:00 UTC reset, still counts as the previous day', () => {
    expect(currentEsoDay(new Date('2026-01-15T09:00:00Z'))).toBe('2026-01-14')
  })

  it('at or after the 10:00 UTC reset, counts as the same day', () => {
    expect(currentEsoDay(new Date('2026-01-15T10:00:00Z'))).toBe('2026-01-15')
    expect(currentEsoDay(new Date('2026-01-15T23:59:00Z'))).toBe('2026-01-15')
  })

  it('rolls back across a month boundary correctly', () => {
    expect(currentEsoDay(new Date('2026-02-01T05:00:00Z'))).toBe('2026-01-31')
  })
})
