/**
 * What Should I Do's own achievements - separate from anything ESO/Zenimax tracks.
 * Each achievement has its own medal artwork (iconSet, matching a folder under
 * public/achievements/) and a handful of tiers, reached by hitting a threshold against
 * some in-app progress. New achievements get their own factory function below.
 */

export type AchievementTier = 'tin' | 'bronze' | 'silver' | 'gold' | 'platinum'

export interface AchievementTierDef {
  tier: AchievementTier
  // The medal's display name for this specific achievement (e.g. "Owner", "Collector").
  name: string
  threshold: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  // Folder name under public/achievements/ holding this achievement's tin/bronze/... SVGs.
  iconSet: string
  tiers: AchievementTierDef[]
}

// Tin at first item, Bronze at 5, Silver at half, Gold at all - `total` is passed in
// rather than hardcoded so it always tracks MUSIC_BOXES.length.
export function musicBoxAchievement(total: number): Achievement {
  return {
    id: 'music-box-collector',
    title: 'Music Box Collection',
    description: 'Collect Music Box furnishings, tracked on the Music Boxes page.',
    iconSet: 'music-box',
    tiers: [
      { tier: 'tin', name: 'Owner', threshold: Math.min(1, total) },
      { tier: 'bronze', name: 'Collector', threshold: Math.min(5, total) },
      { tier: 'silver', name: 'Curator', threshold: Math.ceil(total / 2) },
      { tier: 'gold', name: 'Maestro', threshold: total }
    ]
  }
}

// Fixed counts rather than a fraction of the account's roster - unlike Music Boxes there's
// no fixed catalog size, and a character-count roster varies too much per account for a
// relative split to mean the same thing for everyone. 20 is the max characters ESO allows
// per account per megaserver, so Platinum means every possible slot maxed out.
export function allianceRankAchievement(): Achievement {
  return {
    id: 'alliance-rank-maxer',
    title: 'Alliance War Veterans',
    description: 'Get characters to Alliance Rank 50, tracked on the Alliance Rank page.',
    iconSet: 'alliance-rank',
    tiers: [
      { tier: 'tin', name: 'Veteran', threshold: 1 },
      { tier: 'bronze', name: 'Champion', threshold: 3 },
      { tier: 'silver', name: 'Warlord', threshold: 6 },
      { tier: 'gold', name: 'Grand Marshal', threshold: 10 },
      { tier: 'platinum', name: 'Grand Overlord', threshold: 20 }
    ]
  }
}

// Keep this relative: the packaged app loads index.html over file://, where a leading
// '/' points at the filesystem root, not the app directory.
export function achievementMedalUrl(iconSet: string, tier: AchievementTier): string {
  return `./achievements/${iconSet}/${tier}.svg`
}

// Highest tier whose threshold is met, or null if the count hasn't reached Tin yet.
export function currentAchievementTier(tiers: AchievementTierDef[], count: number): AchievementTierDef | null {
  let current: AchievementTierDef | null = null
  for (const tier of tiers) {
    if (count >= tier.threshold) current = tier
  }
  return current
}
