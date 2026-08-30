export type PledgeTier = 'base' | 'dlc'

export interface PledgeDungeon {
  // USPF's short key from its GD table, e.g. "BC1", "TC".
  key: string
  dungeonName: string
  tier: PledgeTier
  // Quest id USPF checks to mark this dungeon's quest as done.
  questId: number
}

export interface Character {
  charId: string
  charName: string
  // e.g. "NA Megaserver"; "Unknown Server" when SkillLines has no record of this character.
  server: string
  // GD keys this character has completed. Per-character, not account-wide.
  completedDungeonKeys: string[]
  // All 3 riding stats (Capacity/Stamina/Speed) already at cap.
  ridingMaxed: boolean
  // Not maxed and today's training cooldown has elapsed.
  readyToTrainRiding: boolean
}

export interface Account {
  accountName: string
  characters: Character[]
}

export interface PledgeMaster {
  name: string
  tier: PledgeTier
}

// One of today's three pledge dungeons, resolved against PledgeDungeon data.
export interface TodaysPledge {
  master: PledgeMaster
  dungeon: PledgeDungeon | null
  // Raw scraped name, kept even when it doesn't resolve to a known dungeon.
  scrapedName: string
}

export interface TodaysPledges {
  pledges: TodaysPledge[]
  // Served from cache because the fresh fetch failed.
  stale: boolean
  fetchedAt: string
}

export interface CharacterRecommendation {
  charId: string
  charName: string
  accountName: string
  server: string
  // Character hasn't completed this dungeon's quest yet.
  recommended: boolean
}

export interface PledgeRecommendation {
  master: PledgeMaster
  dungeon: PledgeDungeon | null
  scrapedName: string
  characters: CharacterRecommendation[]
}

export interface RecommendationsResult {
  pledges: PledgeRecommendation[]
  stale: boolean
  fetchedAt: string
}

// Pushed from main to renderer as the auto-updater's state changes (src/main/updater.ts).
export type UpdateStatus =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'available'; version: string }
  | { state: 'not-available' }
  | { state: 'downloading'; percent: number }
  | { state: 'downloaded'; version: string }
  | { state: 'error'; message: string }

// Which addon SavedVariables files were found on disk, keyed by file name
// (e.g. "USPF.lua"). true = the addon has written data at least once.
export type AddonStatus = Record<string, boolean>

export interface AppSettings {
  // Override for the Documents folder holding ESO's SavedVariables. Undefined = OS
  // default (needed when OneDrive has redirected Documents).
  documentsPathOverride?: string
  // The OS default Documents path, shown in Settings for reference.
  defaultDocumentsPath: string
}
