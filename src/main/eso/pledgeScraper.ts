import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import * as cheerio from 'cheerio'
import type { PledgeMaster, TodaysPledge, TodaysPledges } from '@shared/types'
import { findPledgeDungeonByName } from '@shared/pledgeDungeons'

const PLEDGES_URL = 'https://eso-hub.com/en/daily-undaunted-pledges'
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

// Fixed order the three pledge masters appear in eso-hub's "Todays Pledges" section.
const PLEDGE_MASTERS: PledgeMaster[] = [
  { name: 'Maj al-Ragath', tier: 'base' },
  { name: 'Glirion the Redbeard', tier: 'base' },
  { name: 'Urgarlag Chief-bane', tier: 'dlc' }
]

interface CacheFile {
  esoDay: string
  fetchedAt: string
  scrapedNames: string[]
}

/**
 * ESO's daily reset varies by megaserver (NA ~10:00 UTC, EU ~03:00 UTC). Since this
 * app doesn't track server per character in v1, NA's reset is used as the single
 * cutoff for "which ESO day is it" - a documented simplification.
 */
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

  // The "Todays Pledges" section is the only place these dungeon header images
  // appear on the page (confirmed against the live page - "Upcoming Pledges" is
  // rendered client-side and has none), so a page-wide selector is both simpler
  // and more robust than walking siblings out of the heading's nested wrapper.
  const names: string[] = []
  $('img[alt$=" header"]').each((_, img) => {
    const alt = $(img).attr('alt') ?? ''
    names.push(alt.replace(/ header$/, '').trim())
  })

  return names.slice(0, 3)
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

async function fetchScrapedNames(): Promise<string[]> {
  const response = await fetch(PLEDGES_URL, {
    headers: { 'User-Agent': USER_AGENT }
  })
  if (!response.ok) {
    throw new Error(`eso-hub returned HTTP ${response.status}`)
  }
  const html = await response.text()
  const names = parseScrapedNames(html)
  if (names.length !== 3) {
    throw new Error(`Expected 3 pledge dungeons in eso-hub markup, found ${names.length}`)
  }
  return names
}

export async function getTodaysPledges(cachePath: string, now: Date = new Date()): Promise<TodaysPledges> {
  const esoDay = currentEsoDay(now)
  const cached = await readCache(cachePath)

  if (cached && cached.esoDay === esoDay) {
    return { pledges: resolvePledges(cached.scrapedNames), stale: false, fetchedAt: cached.fetchedAt }
  }

  try {
    const scrapedNames = await fetchScrapedNames()
    const fetchedAt = now.toISOString()
    await writeCache(cachePath, { esoDay, fetchedAt, scrapedNames })
    return { pledges: resolvePledges(scrapedNames), stale: false, fetchedAt }
  } catch (err) {
    if (cached) {
      return { pledges: resolvePledges(cached.scrapedNames), stale: true, fetchedAt: cached.fetchedAt }
    }
    throw err
  }
}
