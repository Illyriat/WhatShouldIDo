export type PledgeTier = 'base' | 'dlc'

export interface PledgeDungeon {
  /** USPF's short key from its GD table, e.g. "BC1", "TC" */
  key: string
  dungeonName: string
  tier: PledgeTier
  /** quest id USPF checks (via GetCompletedQuestInfo) to mark this dungeon's quest as done */
  questId: number
}

export interface Character {
  charId: string
  charName: string
  /** e.g. "NA Megaserver", "EU Megaserver" - "Unknown" if SkillLines has no record of this character */
  server: string
  /** GD keys (dungeon quests) this character has personally completed - quest completion is per-character in ESO, not account-wide */
  completedDungeonKeys: string[]
  /** true = all 3 riding stats (Capacity/Stamina/Speed) already at cap - nothing left to ever train */
  ridingMaxed: boolean
  /** true = not maxed, and today's training cooldown has elapsed - recommend training */
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

/** One of today's three pledge dungeons, resolved against PledgeDungeon data */
export interface TodaysPledge {
  master: PledgeMaster
  dungeon: PledgeDungeon | null
  /** raw scraped name, kept even if we couldn't resolve it to a known dungeon */
  scrapedName: string
}

export interface TodaysPledges {
  pledges: TodaysPledge[]
  /** true if this came from cache because a fresh fetch failed */
  stale: boolean
  fetchedAt: string
}

export interface CharacterRecommendation {
  charId: string
  charName: string
  accountName: string
  server: string
  /** true = character has NOT completed this dungeon's quest yet -> recommended */
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

/** Pushed from main to renderer as the auto-updater's state changes - see src/main/updater.ts */
export type UpdateStatus =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'available'; version: string }
  | { state: 'not-available' }
  | { state: 'downloading'; percent: number }
  | { state: 'downloaded'; version: string }
  | { state: 'error'; message: string }

export interface AppSettings {
  /** User-chosen override for the "Documents" folder ESO's SavedVariables live under
   *  (<Documents>/Elder Scrolls Online/<profile>/SavedVariables/...). Undefined = use
   *  the OS default (e.g. when Documents has been redirected by OneDrive). */
  documentsPathOverride?: string
  /** The OS default Documents path, shown in Settings so the user has a point of
   *  reference even when an override is set. */
  defaultDocumentsPath: string
}
