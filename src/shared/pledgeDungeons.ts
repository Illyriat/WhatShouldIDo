import type { PledgeDungeon, PledgeMaster } from './types'

/**
 * One entry per Undaunted Pledge dungeon. Each dungeon has a one-time intro quest; the
 * WhatShouldIDoDataCollector companion addon marks it done via
 * GetCompletedQuestInfo(questId) ~= "" (see its data/DungeonQuests.lua, which mirrors
 * this same key/questId/zoneId list as WSIDC.PLEDGE_DUNGEONS), which is per-character.
 * Completing that quest grants the skill point and is the signal this app recommends
 * around.
 *
 * This list (and its keys/questIds) originated from USPF's own `GD` (Group Dungeon)
 * table before this app switched to its own companion addon. Dungeon names were
 * resolved by matching USPF's zone-index `id` against LibZone's zoneIndex->name table,
 * and quest ids were cross-checked against UESP quest pages. `zoneId` is the same ESO
 * zone id USPF's `id` field held - cross-checked against LibUndauntedPledges' own
 * Data.lua, since that's now what the addon resolves today's Pledge rotation against
 * (see findPledgeDungeonByZoneId below).
 */
export const PLEDGE_DUNGEONS: PledgeDungeon[] = [
  // Base game
  { key: 'BC1', dungeonName: 'Banished Cells I', tier: 'base', questId: 4107, zoneId: 380 },
  { key: 'BC2', dungeonName: 'Banished Cells II', tier: 'base', questId: 4597, zoneId: 935 },
  { key: 'EH1', dungeonName: 'Elden Hollow I', tier: 'base', questId: 4336, zoneId: 126 },
  { key: 'EH2', dungeonName: 'Elden Hollow II', tier: 'base', questId: 4675, zoneId: 931 },
  { key: 'CA1', dungeonName: 'City of Ash I', tier: 'base', questId: 4778, zoneId: 176 },
  { key: 'CA2', dungeonName: 'City of Ash II', tier: 'base', questId: 5120, zoneId: 681 },
  { key: 'TI', dungeonName: 'Tempest Island', tier: 'base', questId: 4538, zoneId: 131 },
  { key: 'SW', dungeonName: "Selene's Web", tier: 'base', questId: 4733, zoneId: 31 },
  { key: 'SC1', dungeonName: 'Spindleclutch I', tier: 'base', questId: 4054, zoneId: 144 },
  { key: 'SC2', dungeonName: 'Spindleclutch II', tier: 'base', questId: 4555, zoneId: 936 },
  { key: 'WS1', dungeonName: 'Wayrest Sewers I', tier: 'base', questId: 4246, zoneId: 146 },
  { key: 'WS2', dungeonName: 'Wayrest Sewers II', tier: 'base', questId: 4813, zoneId: 933 },
  { key: 'CH1', dungeonName: 'Crypt of Hearts I', tier: 'base', questId: 4379, zoneId: 130 },
  { key: 'CH2', dungeonName: 'Crypt of Hearts II', tier: 'base', questId: 5113, zoneId: 932 },
  { key: 'VF', dungeonName: 'Volenfell', tier: 'base', questId: 4432, zoneId: 22 },
  { key: 'BH', dungeonName: 'Blackheart Haven', tier: 'base', questId: 4589, zoneId: 38 },
  { key: 'FG1', dungeonName: 'Fungal Grotto I', tier: 'base', questId: 3993, zoneId: 283 },
  { key: 'FG2', dungeonName: 'Fungal Grotto II', tier: 'base', questId: 4303, zoneId: 934 },
  { key: 'DC1', dungeonName: 'Darkshade Caverns I', tier: 'base', questId: 4145, zoneId: 63 },
  { key: 'DC2', dungeonName: 'Darkshade Caverns II', tier: 'base', questId: 4641, zoneId: 930 },
  { key: 'AC', dungeonName: 'Arx Corinium', tier: 'base', questId: 4202, zoneId: 148 },
  { key: 'DK', dungeonName: 'Direfrost Keep', tier: 'base', questId: 4346, zoneId: 449 },
  { key: 'BC', dungeonName: 'Blessed Crucible', tier: 'base', questId: 4469, zoneId: 64 },
  { key: 'VM', dungeonName: 'Vaults of Madness', tier: 'base', questId: 4822, zoneId: 11 },

  // DLC (Imperial City included - the daily rotation draws from it)
  { key: 'ICP', dungeonName: 'Imperial City Prison', tier: 'dlc', questId: 5136, zoneId: 678 },
  { key: 'WGT', dungeonName: 'White-Gold Tower', tier: 'dlc', questId: 5342, zoneId: 688 },
  { key: 'RM', dungeonName: 'Ruins of Mazzatun', tier: 'dlc', questId: 5403, zoneId: 843 },
  { key: 'CS', dungeonName: 'Cradle of Shadows', tier: 'dlc', questId: 5702, zoneId: 848 },
  { key: 'BF', dungeonName: 'Bloodroot Forge', tier: 'dlc', questId: 5889, zoneId: 973 },
  { key: 'FH', dungeonName: 'Falkreath Hold', tier: 'dlc', questId: 5891, zoneId: 974 },
  { key: 'FL', dungeonName: 'Fang Lair', tier: 'dlc', questId: 6064, zoneId: 1009 },
  { key: 'SP', dungeonName: 'Scalecaller Peak', tier: 'dlc', questId: 6065, zoneId: 1010 },
  { key: 'MHK', dungeonName: 'Moon Hunter Keep', tier: 'dlc', questId: 6186, zoneId: 1052 },
  { key: 'MOS', dungeonName: 'March of Sacrifices', tier: 'dlc', questId: 6188, zoneId: 1055 },
  { key: 'DoM', dungeonName: 'Depths of Malatar', tier: 'dlc', questId: 6251, zoneId: 1081 },
  { key: 'FV', dungeonName: 'Frostvault', tier: 'dlc', questId: 6249, zoneId: 1080 },
  { key: 'LM', dungeonName: 'Lair of Maarselok', tier: 'dlc', questId: 6351, zoneId: 1123 },
  { key: 'MF', dungeonName: 'Moongrave Fane', tier: 'dlc', questId: 6349, zoneId: 1122 },
  { key: 'IR', dungeonName: 'Icereach', tier: 'dlc', questId: 6414, zoneId: 1152 },
  { key: 'UG', dungeonName: 'Unhallowed Grave', tier: 'dlc', questId: 6416, zoneId: 1153 },
  { key: 'SG', dungeonName: 'Stone Garden', tier: 'dlc', questId: 6505, zoneId: 1197 },
  { key: 'CT', dungeonName: 'Castle Thorn', tier: 'dlc', questId: 6507, zoneId: 1201 },
  { key: 'BDV', dungeonName: 'Black Drake Villa', tier: 'dlc', questId: 6576, zoneId: 1228 },
  { key: 'TC', dungeonName: 'The Cauldron', tier: 'dlc', questId: 6578, zoneId: 1229 },
  { key: 'RPB', dungeonName: 'Red Petal Bastion', tier: 'dlc', questId: 6683, zoneId: 1267 },
  { key: 'TDC', dungeonName: 'The Dread Cellar', tier: 'dlc', questId: 6685, zoneId: 1268 },
  { key: 'CA', dungeonName: 'Coral Aerie', tier: 'dlc', questId: 6740, zoneId: 1301 },
  { key: 'SR', dungeonName: "Shipwright's Regret", tier: 'dlc', questId: 6742, zoneId: 1302 },
  { key: 'ERE', dungeonName: 'Earthen Root Enclave', tier: 'dlc', questId: 6835, zoneId: 1360 },
  { key: 'GD', dungeonName: 'Graven Deep', tier: 'dlc', questId: 6837, zoneId: 1361 },
  { key: 'BS', dungeonName: 'Bal Sunnar', tier: 'dlc', questId: 6896, zoneId: 1389 },
  { key: 'SH', dungeonName: "Scrivener's Hall", tier: 'dlc', questId: 7027, zoneId: 1390 },
  { key: 'OP', dungeonName: 'Oathsworn Pit', tier: 'dlc', questId: 7105, zoneId: 1470 },
  { key: 'BV', dungeonName: 'Bedlam Veil', tier: 'dlc', questId: 7155, zoneId: 1471 },
  { key: 'ER', dungeonName: 'Exiled Redoubt', tier: 'dlc', questId: 7235, zoneId: 1496 },
  { key: 'LS', dungeonName: 'Lep Seclusa', tier: 'dlc', questId: 7237, zoneId: 1497 },
  { key: 'NC', dungeonName: 'Naj-Caldeesh', tier: 'dlc', questId: 7320, zoneId: 1551 },
  { key: 'BGF', dungeonName: 'Black Gem Foundry', tier: 'dlc', questId: 7323, zoneId: 1552 }
]

const zoneIdToDungeon = new Map<number, PledgeDungeon>()
for (const dungeon of PLEDGE_DUNGEONS) {
  zoneIdToDungeon.set(dungeon.zoneId, dungeon)
}

export function findPledgeDungeonByZoneId(zoneId: number): PledgeDungeon | null {
  return zoneIdToDungeon.get(zoneId) ?? null
}

// The three Undaunted Pledge givers, in the fixed order WhatShouldIDoDataCollector
// records them in (base1, base2, dlc1 - matching LibUndauntedPledges' own BASE1/BASE2/DLC1
// groups, see data/Pledges.lua).
export const PLEDGE_MASTERS: PledgeMaster[] = [
  { name: 'Maj al-Ragath', tier: 'base' },
  { name: 'Glirion the Redbeard', tier: 'base' },
  { name: 'Urgarlag Chief-bane', tier: 'dlc' }
]
