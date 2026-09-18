import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import * as cheerio from 'cheerio'
import type { PledgeMaster, TodaysPledge, TodaysPledges, UpcomingPledgeDay } from '@shared/types'
import { findPledgeDungeonByName } from '@shared/pledgeDungeons'

const PLEDGES_URL = 'https://eso-hub.com/en/daily-undaunted-pledges'
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

// How many days beyond today to surface in the "upcoming" preview.
const UPCOMING_DAYS = 5

// Fixed order the three pledge masters appear in eso-hub's "Todays Pledges" section
// (and in the same column order in its "Upcoming Pledges" table).
const PLEDGE_MASTERS: PledgeMaster[] = [
  { name: 'Maj al-Ragath', tier: 'base' },
  { name: 'Glirion the Redbeard', tier: 'base' },
  { name: 'Urgarlag Chief-bane', tier: 'dlc' }
]

interface CacheFile {
  esoDay: string
  fetchedAt: string
  scrapedNames: string[]
  upcomingScrapedNames: string[][]
}

// Daily reset differs by megaserver (NA ~10:00 UTC, EU ~03:00 UTC). We don't track
// server here, so NA's reset is the single cutoff for "which ESO day is it".
export function currentEsoDay(now: Date): string {
  const resetHourUtc = 10
  const cutoff = new Date(now)
  if (cutoff.getUTCHours() < resetHourUtc) {
    cutoff.setUTCDate(cutoff.getUTCDate() - 1)
  }
  return cutoff.toISOString().slice(0, 10)
}

async function readCache(cachePath: string): Promise<CacheFile | null> {
  try {
    const raw = await readFile(cachePath, 'utf-8')
    return JSON.parse(raw) as CacheFile
  } catch {
    return null
  }
}

async function writeCache(cachePath: string, cache: CacheFile): Promise<void> {
  await mkdir(dirname(cachePath), { recursive: true })
  await writeFile(cachePath, JSON.stringify(cache, null, 2), 'utf-8')
}

export function parseScrapedNames(html: string): string[] {
  const $ = cheerio.load(html)

  // These header images only appear in the "Todays Pledges" section (the "Upcoming
  // Pledges" table further down uses plain text links, not header images), so a
  // page-wide selector is safe here.
  const names: string[] = []
  $('img[alt$=" header"]').each((_, img) => {
    const alt = $(img).attr('alt') ?? ''
    names.push(alt.replace(/ header$/, '').trim())
  })

  return names.slice(0, 3)
}

// Parses eso-hub's "Upcoming Pledges" table (section#upcoming), one row per future day
// in order (nearest first), each row's dungeon-name cells in the same master/tier order
// as parseScrapedNames. Returns at most `limit` days; a short/malformed row is skipped
// rather than throwing, since upcoming data is a bonus, not the feature's core promise.
export function parseUpcomingScrapedNames(html: string, limit: number): string[][] {
  const $ = cheerio.load(html)

  const days: string[][] = []
  $('#upcoming tbody tr').each((_, tr) => {
    if (days.length >= limit) return
    const cells = $(tr).find('td').slice(1) // first cell is the "In N days" label
    const names = cells
      .map((__, td) => $(td).text().trim())
      .get()
      .filter(Boolean)
    if (names.length === 3) days.push(names)
  })

  return days
}

export function resolvePledges(scrapedNames: string[]): TodaysPledge[] {
  return PLEDGE_MASTERS.map((master, i) => {
    const scrapedName = scrapedNames[i] ?? ''
    return {
      master,
      dungeon: scrapedName ? findPledgeDungeonByName(scrapedName) : null,
      scrapedName
    }
  })
}

function addDaysToEsoDay(esoDay: string, days: number): string {
  const date = new Date(`${esoDay}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function resolveUpcoming(esoDay: string, upcomingScrapedNames: string[][]): UpcomingPledgeDay[] {
  return upcomingScrapedNames.map((scrapedNames, i) => ({
    esoDay: addDaysToEsoDay(esoDay, i + 1),
    pledges: resolvePledges(scrapedNames)
  }))
}

interface ScrapedPledgePage {
  scrapedNames: string[]
  upcomingScrapedNames: string[][]
}

async function fetchPledgePage(): Promise<ScrapedPledgePage> {
  const response = await fetch(PLEDGES_URL, {
    headers: { 'User-Agent': USER_AGENT }
  })
  if (!response.ok) {
    throw new Error(`eso-hub returned HTTP ${response.status}`)
  }
  const html = await response.text()

  const scrapedNames = parseScrapedNames(html)
  if (scrapedNames.length !== 3) {
    throw new Error(`Expected 3 pledge dungeons in eso-hub markup, found ${scrapedNames.length}`)
  }

  const upcomingScrapedNames = parseUpcomingScrapedNames(html, UPCOMING_DAYS)

  return { scrapedNames, upcomingScrapedNames }
}

export async function getTodaysPledges(cachePath: string, now: Date = new Date()): Promise<TodaysPledges> {
  const esoDay = currentEsoDay(now)
  const cached = await readCache(cachePath)

  if (cached && cached.esoDay === esoDay) {
    return {
      pledges: resolvePledges(cached.scrapedNames),
      // Older cache files predate the upcoming-days field.
      upcoming: resolveUpcoming(esoDay, cached.upcomingScrapedNames ?? []),
      stale: false,
      fetchedAt: cached.fetchedAt
    }
  }

  try {
    const { scrapedNames, upcomingScrapedNames } = await fetchPledgePage()
    const fetchedAt = now.toISOString()
    await writeCache(cachePath, { esoDay, fetchedAt, scrapedNames, upcomingScrapedNames })
    return {
      pledges: resolvePledges(scrapedNames),
      upcoming: resolveUpcoming(esoDay, upcomingScrapedNames),
      stale: false,
      fetchedAt
    }
  } catch (err) {
    if (cached) {
      return {
        pledges: resolvePledges(cached.scrapedNames),
        upcoming: resolveUpcoming(cached.esoDay, cached.upcomingScrapedNames ?? []),
        stale: true,
        fetchedAt: cached.fetchedAt
      }
    }
    throw err
  }
}
