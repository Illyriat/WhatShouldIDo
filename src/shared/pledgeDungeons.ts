import type { PledgeDungeon } from './types'

/**
 * Static lookup of USPF's `GD` (Group Dungeon) table: one entry per specific dungeon,
 * each tracked via its own one-time intro quest (USPF checks completion with the real
 * ESO API `GetCompletedQuestInfo(questId)` - genuinely per-character, no account-wide
 * caveat unlike achievements). Completing this quest is what grants the skill point AND
 * is the "have they done the quest for this dungeon" signal the app recommends around.
 *
 * Resolved by cross-referencing USPF's own `id` field (each dungeon's real ESO zone
 * index) against LibZone's zoneIndex->name table (the addon's own comprehensive,
 * community-maintained zone database) - verified against real player data and eso-hub's
 * "It can be found in <Zone>, part of the <Pack> DLC pack" per-dungeon descriptions for
 * a subset (e.g. Black Drake Villa + The Cauldron / Flames of Ambition) as a sanity check.
 * Quest IDs cross-checked against UESP quest pages (e.g. quest 4107 = "Banishing the
 * Banished", the intro quest for The Banished Cells I) confirm these are real, correct IDs.
 */
export const PLEDGE_DUNGEONS: PledgeDungeon[] = [
  // --- Base game ---
  { key: 'BC1', dungeonName: 'Banished Cells I', tier: 'base', questId: 4107 },
  { key: 'BC2', dungeonName: 'Banished Cells II', tier: 'base', questId: 4597 },
  { key: 'EH1', dungeonName: 'Elden Hollow I', tier: 'base', questId: 4336 },
  { key: 'EH2', dungeonName: 'Elden Hollow II', tier: 'base', questId: 4675 },
  { key: 'CA1', dungeonName: 'City of Ash I', tier: 'base', questId: 4778 },
  { key: 'CA2', dungeonName: 'City of Ash II', tier: 'base', questId: 5120 },
  { key: 'TI', dungeonName: 'Tempest Island', tier: 'base', questId: 4538 },
  { key: 'SW', dungeonName: "Selene's Web", tier: 'base', questId: 4733 },
  { key: 'SC1', dungeonName: 'Spindleclutch I', tier: 'base', questId: 4054 },
  { key: 'SC2', dungeonName: 'Spindleclutch II', tier: 'base', questId: 4555 },
  { key: 'WS1', dungeonName: 'Wayrest Sewers I', tier: 'base', questId: 4246 },
  { key: 'WS2', dungeonName: 'Wayrest Sewers II', tier: 'base', questId: 4813 },
  { key: 'CH1', dungeonName: 'Crypt of Hearts I', tier: 'base', questId: 4379 },
  { key: 'CH2', dungeonName: 'Crypt of Hearts II', tier: 'base', questId: 5113 },
  { key: 'VF', dungeonName: 'Volenfell', tier: 'base', questId: 4432 },
  { key: 'BH', dungeonName: 'Blackheart Haven', tier: 'base', questId: 4589 },
  { key: 'FG1', dungeonName: 'Fungal Grotto I', tier: 'base', questId: 3993 },
  { key: 'FG2', dungeonName: 'Fungal Grotto II', tier: 'base', questId: 4303 },
  { key: 'DC1', dungeonName: 'Darkshade Caverns I', tier: 'base', questId: 4145 },
  { key: 'DC2', dungeonName: 'Darkshade Caverns II', tier: 'base', questId: 4641 },
  { key: 'AC', dungeonName: 'Arx Corinium', tier: 'base', questId: 4202 },
  { key: 'DK', dungeonName: 'Direfrost Keep', tier: 'base', questId: 4346 },
  { key: 'BC', dungeonName: 'Blessed Crucible', tier: 'base', questId: 4469 },
  { key: 'VM', dungeonName: 'Vaults of Madness', tier: 'base', questId: 4822 },

  // --- DLC (includes Imperial City, which the daily rotation does draw from) ---
  { key: 'ICP', dungeonName: 'Imperial City Prison', tier: 'dlc', questId: 5136 },
  { key: 'WGT', dungeonName: 'White-Gold Tower', tier: 'dlc', questId: 5342 },
  { key: 'RM', dungeonName: 'Ruins of Mazzatun', tier: 'dlc', questId: 5403 },
  { key: 'CS', dungeonName: 'Cradle of Shadows', tier: 'dlc', questId: 5702 },
  { key: 'BF', dungeonName: 'Bloodroot Forge', tier: 'dlc', questId: 5889 },
  { key: 'FH', dungeonName: 'Falkreath Hold', tier: 'dlc', questId: 5891 },
  { key: 'FL', dungeonName: 'Fang Lair', tier: 'dlc', questId: 6064 },
  { key: 'SP', dungeonName: 'Scalecaller Peak', tier: 'dlc', questId: 6065 },
  { key: 'MHK', dungeonName: 'Moon Hunter Keep', tier: 'dlc', questId: 6186 },
  { key: 'MOS', dungeonName: 'March of Sacrifices', tier: 'dlc', questId: 6188 },
  { key: 'DoM', dungeonName: 'Depths of Malatar', tier: 'dlc', questId: 6251 },
  { key: 'FV', dungeonName: 'Frostvault', tier: 'dlc', questId: 6249 },
  { key: 'LM', dungeonName: 'Lair of Maarselok', tier: 'dlc', questId: 6351 },
  { key: 'MF', dungeonName: 'Moongrave Fane', tier: 'dlc', questId: 6349 },
  { key: 'IR', dungeonName: 'Icereach', tier: 'dlc', questId: 6414 },
  { key: 'UG', dungeonName: 'Unhallowed Grave', tier: 'dlc', questId: 6416 },
  { key: 'SG', dungeonName: 'Stone Garden', tier: 'dlc', questId: 6505 },
  { key: 'CT', dungeonName: 'Castle Thorn', tier: 'dlc', questId: 6507 },
  { key: 'BDV', dungeonName: 'Black Drake Villa', tier: 'dlc', questId: 6576 },
  { key: 'TC', dungeonName: 'The Cauldron', tier: 'dlc', questId: 6578 },
  { key: 'RPB', dungeonName: 'Red Petal Bastion', tier: 'dlc', questId: 6683 },
  { key: 'TDC', dungeonName: 'The Dread Cellar', tier: 'dlc', questId: 6685 },
  { key: 'CA', dungeonName: 'Coral Aerie', tier: 'dlc', questId: 6740 },
  { key: 'SR', dungeonName: "Shipwright's Regret", tier: 'dlc', questId: 6742 },
  { key: 'ERE', dungeonName: 'Earthen Root Enclave', tier: 'dlc', questId: 6835 },
  { key: 'GD', dungeonName: 'Graven Deep', tier: 'dlc', questId: 6837 },
  { key: 'BS', dungeonName: 'Bal Sunnar', tier: 'dlc', questId: 6896 },
  { key: 'SH', dungeonName: "Scrivener's Hall", tier: 'dlc', questId: 7027 },
  { key: 'OP', dungeonName: 'Oathsworn Pit', tier: 'dlc', questId: 7105 },
  { key: 'BV', dungeonName: 'Bedlam Veil', tier: 'dlc', questId: 7155 },
  { key: 'ER', dungeonName: 'Exiled Redoubt', tier: 'dlc', questId: 7235 },
  { key: 'LS', dungeonName: 'Lep Seclusa', tier: 'dlc', questId: 7237 },
  { key: 'NC', dungeonName: 'Naj-Caldeesh', tier: 'dlc', questId: 7320 },
  { key: 'BGF', dungeonName: 'Black Gem Foundry', tier: 'dlc', questId: 7323 }
]

/**
 * eso-hub is inconsistent about prefixing dungeon names with "The" (e.g. it scrapes
 * as "The Banished Cells II" even though this file's dungeonName is just "Banished
 * Cells II", while "The Dread Cellar" is prefixed on both sides) - stripping a
 * leading "The " from both sides before comparing makes matching robust to that.
 */
function normalizeDungeonName(name: string): string {
  return name.trim().replace(/^the\s+/i, '').toLowerCase()
}

const nameToKey = new Map<string, string>()
for (const dungeon of PLEDGE_DUNGEONS) {
  nameToKey.set(normalizeDungeonName(dungeon.dungeonName), dungeon.key)
}

export function findPledgeDungeonByName(scrapedName: string): PledgeDungeon | null {
  const key = nameToKey.get(normalizeDungeonName(scrapedName))
  if (!key) return null
  return PLEDGE_DUNGEONS.find((d) => d.key === key) ?? null
}
