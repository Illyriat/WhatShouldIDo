export type PledgeTier = 'base' | 'dlc'

export interface PledgeDungeon {
  // Short key this app uses for the dungeon, e.g. "BC1", "TC" (mirrored in the
  // WhatShouldIDoDataCollector addon's own WSIDC.PLEDGE_DUNGEONS table).
  key: string
  dungeonName: string
  tier: PledgeTier
  // Quest id the WhatShouldIDoDataCollector addon checks to mark this dungeon's quest as done.
  questId: number
  // ESO zone id, used to resolve today's Pledge rotation (recorded by the addon via
  // LibUndauntedPledges) back to this dungeon - see src/shared/pledgeDungeons.ts.
  zoneId: number
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
  // e.g. "NA Megaserver" - the realm bucket this character's data lives under in
  // WhatShouldIDoDataCollector.lua.
  server: string
  // PledgeDungeon keys this character has completed the intro quest for. Per-character,
  // not account-wide.
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

// One of a day's three pledge dungeons, resolved against PledgeDungeon data.
export interface TodaysPledge {
  master: PledgeMaster
  dungeon: PledgeDungeon | null
  // Raw dungeon name recorded by the addon, kept even when it doesn't resolve to a
  // known PledgeDungeon (e.g. this app's zoneId list is behind the game's latest DLC).
  dungeonName: string
}

// One of the next few days' pledge line-ups (no per-character data - just the dungeons).
export interface UpcomingPledgeDay {
  // ISO date (YYYY-MM-DD) of the ESO day these pledges go live.
  esoDay: string
  pledges: TodaysPledge[]
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
  dungeonName: string
  characters: CharacterRecommendation[]
}

// Today's Pledge rotation is realm-scoped (NA and EU can differ on the same calendar
// day near their different daily-reset times - see WhatShouldIDoDataCollector's
// data/Pledges.lua), so recommendations are grouped per realm rather than one global list.
export interface RealmPledgeRecommendations {
  server: string
  pledges: PledgeRecommendation[]
  upcoming: UpcomingPledgeDay[]
}

export interface RecommendationsResult {
  pledgesByRealm: RealmPledgeRecommendations[]
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
// (e.g. "WhatShouldIDoDataCollector.lua"). true = the addon has written data at least once.
export type AddonStatus = Record<string, boolean>

// Where the Data Collector addon that ships inside this app stands across the user's
// ESO profiles (live / liveeu / pts). "up-to-date" also covers an install that's newer
// than the bundled copy - the app never downgrades.
export type DataCollectorState =
  | 'no-game-folder'
  | 'bundle-missing'
  | 'not-installed'
  | 'update-available'
  | 'up-to-date'

export interface DataCollectorInstallStatus {
  state: DataCollectorState
  // Version of the addon inside this build of the app (null if the build lacks it).
  bundledVersion: string | null
  // Oldest installed version across profiles that have the addon, null if none do.
  installedVersion: string | null
}

// LibUndauntedPledges is a third-party dependency the app does NOT install - it can only
// be detected so Settings can point the user at ESOUI.
export type LibraryState = 'no-game-folder' | 'missing' | 'outdated' | 'installed'

export interface LibraryInstallStatus {
  state: LibraryState
  version: string | null
}

export interface AddonInstallStatus {
  dataCollector: DataCollectorInstallStatus
  library: LibraryInstallStatus
}

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
