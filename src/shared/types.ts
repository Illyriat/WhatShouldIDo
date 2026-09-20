export type PledgeTier = 'base' | 'dlc'

export interface PledgeDungeon {
  // USPF's short key from its GD table, e.g. "BC1", "TC".
  key: string
  dungeonName: string
  tier: PledgeTier
  // Quest id USPF checks to mark this dungeon's quest as done.
  questId: number
}

export interface AllianceRankStatus {
  // 0-50. 0 = Citizen (no AP earned yet).
  rank: number
  // 1 or 2 - each of the 25 named ranks has two numbered sub-grades.
  subRank: number
  // Lifetime AP earned toward rank (GetUnitAvARankPoints) - distinct from spendable AP currency.
  currentAP: number
  // AP required for rank 50, read live from the game (GetNumPointsNeededForAvARank(50))
  // rather than hardcoded, so it stays correct across any future rebalance.
  apForMaxRank: number
  // AP window for the character's current rank step, from the game's own
  // GetAvARankProgress(currentAP) - bounds of the inner "progress within this rank" ring.
  currentRankStartAP: number
  currentRankEndAP: number
}

// Gold, Alliance Points, Tel Var Stones and Writ Vouchers - all character-specific
// currencies in ESO, but bankable (see WealthAmounts usage on Account for the shared
// account-wide bank total, vs. this per-character carried amount).
export interface WealthAmounts {
  gold: number
  alliancePoints: number
  telVarStones: number
  writVouchers: number
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
  // null when the AllianceRankTracker addon has no data yet for this character.
  allianceRank: AllianceRankStatus | null
  // Currency this character is personally carrying. null when the
  // WhatShouldIDoDataCollector addon has no data yet for this character.
  wealth: WealthAmounts | null
}

export interface Account {
  accountName: string
  characters: Character[]
  // Champion Points earned, keyed by server (e.g. "EU Megaserver") - account-wide per
  // realm, not per-character, so it lives here rather than on Character. Empty when the
  // WhatShouldIDoDataCollector addon has no data yet for that realm.
  championPoints: Record<string, number>
  // Bank currency totals, keyed by server - shared by every character on that account +
  // megaserver (see WealthAmounts), same account+realm scoping as championPoints. Empty
  // when the WhatShouldIDoDataCollector addon has no data yet for that realm.
  bankWealth: Record<string, WealthAmounts>
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

// One of the next few days' pledge line-ups (no per-character data - just the dungeons).
export interface UpcomingPledgeDay {
  // ISO date (YYYY-MM-DD) of the ESO day these pledges go live.
  esoDay: string
  pledges: TodaysPledge[]
}

export interface TodaysPledges {
  pledges: TodaysPledge[]
  upcoming: UpcomingPledgeDay[]
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
  upcoming: UpcomingPledgeDay[]
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
  // User "declutter" toggles - feature flags (src/shared/featureFlags.ts) the user has
  // turned off in Settings. Stored as plain strings (not FeatureFlag) since a value
  // saved under an older build can name a flag that no longer exists.
  disabledFeatures: string[]
  // Selected app-display language (e.g. "fr"). Undefined = the default (English) - see
  // src/shared/i18n/index.ts for the supported-language list. Only covers this app's own
  // UI text, never ESO's own game data.
  language?: string
}
