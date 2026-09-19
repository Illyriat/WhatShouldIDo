/**
 * What Should I Do's own achievements - separate from anything ESO/Zenimax tracks.
 * Each achievement has its own medal artwork (iconSet, matching a folder under
 * public/achievements/) and a handful of tiers, reached by hitting a threshold against
 * some in-app progress. New achievements get their own factory function below.
 *
 * Wealth is shaped differently (WealthTierDef/currentWealthTier below) - it gates on four
 * independent currency amounts at once rather than one number, so it doesn't fit the
 * single-`threshold` Achievement/AchievementTierDef shape the other achievements use.
 */

import type { WealthAmounts } from './types'

// The medal-art slug for one tier - matches an SVG filename under this achievement's
// iconSet folder (e.g. "tin" -> public/achievements/music-box/tin.svg). Not a fixed set of
// literals: different achievements use different vocabularies (quality medals vs. wealth
// classes), so any kebab-case slug is valid so long as the matching SVG exists.
export type AchievementTier = string

export interface AchievementTierDef {
  tier: AchievementTier
  // The medal's display name for this specific achievement (e.g. "Owner", "Peasant").
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

export interface WealthTierDef {
  tier: AchievementTier
  name: string
  // Must clear every currency, not just one - a gold pile alone doesn't make a Baron.
  requirement: WealthAmounts
}

export interface WealthAchievement {
  id: string
  title: string
  description: string
  iconSet: string
  tiers: WealthTierDef[]
}

// Gated on all four currencies at once (bank plus every character carrying them - see the
// Wealth board on Home), not a combined sum - a player who only farms Tel Var shouldn't
// hit the same class as one who's built up all four. Thresholds are fixed, not a share of
// some total, since currency has no natural "all of it" ceiling the way a fixed catalog
// like Music Boxes does. Peasant only asks for a little Gold - unlike the medal
// achievements there's no "not started" state here, everyone has *some* class.
//
// The top tiers are deliberately steep: a meaningful share of the playerbase sits on
// billions of Gold from years of trading, so Baron needs nine figures and Magnate needs
// billions - genuinely rare even among wealthy accounts, not just "played a while."
export function wealthAchievement(): WealthAchievement {
  return {
    id: 'wealth-class',
    title: 'Wealth',
    description:
      'Get every currency up - Gold, Alliance Points, Tel Var Stones and Writ Vouchers - the shared bank plus every character carrying them.',
    iconSet: 'wealth',
    tiers: [
      {
        tier: 'peasant',
        name: 'Peasant',
        requirement: { gold: 10_000, alliancePoints: 0, telVarStones: 0, writVouchers: 0 }
      },
      {
        tier: 'commoner',
        name: 'Commoner',
        requirement: { gold: 250_000, alliancePoints: 5_000, telVarStones: 1_000, writVouchers: 100 }
      },
      {
        tier: 'merchant',
        name: 'Merchant',
        requirement: { gold: 5_000_000, alliancePoints: 250_000, telVarStones: 10_000, writVouchers: 500 }
      },
      {
        tier: 'noble',
        name: 'Noble',
        requirement: { gold: 50_000_000, alliancePoints: 5_000_000, telVarStones: 100_000, writVouchers: 2_000 }
      },
      {
        tier: 'baron',
        name: 'Baron',
        requirement: { gold: 500_000_000, alliancePoints: 50_000_000, telVarStones: 500_000, writVouchers: 6_000 }
      },
      {
        tier: 'magnate',
        name: 'Magnate',
        requirement: {
          gold: 5_000_000_000,
          alliancePoints: 250_000_000,
          telVarStones: 1_500_000,
          writVouchers: 15_000
        }
      }
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

// Highest wealth tier whose requirement is fully met (all four currencies), or null if
// even Peasant's isn't. Tiers must be defined with strictly increasing requirements across
// every currency for "highest fully met" to mean what it sounds like.
export function currentWealthTier(tiers: WealthTierDef[], amounts: WealthAmounts): WealthTierDef | null {
  let current: WealthTierDef | null = null
  for (const tier of tiers) {
    const meetsAll =
      amounts.gold >= tier.requirement.gold &&
      amounts.alliancePoints >= tier.requirement.alliancePoints &&
      amounts.telVarStones >= tier.requirement.telVarStones &&
      amounts.writVouchers >= tier.requirement.writVouchers
    if (meetsAll) current = tier
  }
  return current
}
