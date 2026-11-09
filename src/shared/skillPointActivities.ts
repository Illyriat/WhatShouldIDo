/**
 * One-time skill point quests outside the Undaunted Pledge rotation, shown as their own
 * sections on the Dungeon Check List page.
 *
 * The WhatShouldIDoDataCollector addon (v1.6.0+) records these into the same
 * per-character `.completedDungeonQuests` table as the pledge dungeons, under these
 * keys (see WSIDC.SKILL_POINT_QUESTS in its utils/Constants.lua, which must stay in step
 * with this list). An entry counts as done once any of its quests is complete.
 *
 * Quest ids were confirmed in-game with GetCompletedQuestInfo. The solo dungeon quests
 * are separate from the group versions' intro quests (MHK 6186, MOS 6188), so a
 * character can earn both skill points. Maelstrom Arena is checked by its normal and
 * veteran completion quests because its achievement is account-wide.
 */
export interface SkillPointActivity {
  key: string
  dungeonName: string
  questIds: number[]
}

// Update 51 (October 2026) solo versions of two group dungeons.
export const SOLO_DUNGEONS: SkillPointActivity[] = [
  { key: 'SOLO_MHK', dungeonName: 'Moon Hunter Keep', questIds: [7514] }, // Moonlight Ascent
  { key: 'SOLO_MOS', dungeonName: 'March of Sacrifices', questIds: [7509] } // The Great Hunt
]

// Dragonstar Arena, Blackrose Prison and Vateshran Hollows don't grant a skill point.
export const ARENAS: SkillPointActivity[] = [
  { key: 'ARENA_MA', dungeonName: 'Maelstrom Arena', questIds: [5448, 5637] }, // normal / veteran
  { key: 'ARENA_IA', dungeonName: 'Infinite Archive', questIds: [7061] } // The Margins of Ire
]
