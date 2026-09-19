import { describe, it, expect } from 'vitest'
import { allianceRankAchievement, currentAchievementTier, musicBoxAchievement } from '../../src/shared/achievements'

describe('musicBoxAchievement', () => {
  it('sets Tin/Bronze at fixed counts and Silver/Gold relative to the total', () => {
    const achievement = musicBoxAchievement(52)
    expect(achievement.tiers).toEqual([
      { tier: 'tin', name: 'Owner', threshold: 1 },
      { tier: 'bronze', name: 'Collector', threshold: 5 },
      { tier: 'silver', name: 'Curator', threshold: 26 },
      { tier: 'gold', name: 'Maestro', threshold: 52 }
    ])
  })

  it('rounds Silver up for an odd total, and never sets a threshold above the total', () => {
    const achievement = musicBoxAchievement(3)
    expect(achievement.tiers).toEqual([
      { tier: 'tin', name: 'Owner', threshold: 1 },
      { tier: 'bronze', name: 'Collector', threshold: 3 },
      { tier: 'silver', name: 'Curator', threshold: 2 },
      { tier: 'gold', name: 'Maestro', threshold: 3 }
    ])
  })
})

describe('allianceRankAchievement', () => {
  it('uses fixed character-count thresholds up to the 20-character-per-realm cap', () => {
    const achievement = allianceRankAchievement()
    expect(achievement.tiers).toEqual([
      { tier: 'tin', name: 'Veteran', threshold: 1 },
      { tier: 'bronze', name: 'Champion', threshold: 3 },
      { tier: 'silver', name: 'Warlord', threshold: 6 },
      { tier: 'gold', name: 'Grand Marshal', threshold: 10 },
      { tier: 'platinum', name: 'Grand Overlord', threshold: 20 }
    ])
  })
})

describe('currentAchievementTier', () => {
  const tiers = musicBoxAchievement(52).tiers

  it('is null below the first threshold', () => {
    expect(currentAchievementTier(tiers, 0)).toBeNull()
  })

  it('returns the highest tier whose threshold is met', () => {
    expect(currentAchievementTier(tiers, 1)?.tier).toBe('tin')
    expect(currentAchievementTier(tiers, 4)?.tier).toBe('tin')
    expect(currentAchievementTier(tiers, 5)?.tier).toBe('bronze')
    expect(currentAchievementTier(tiers, 25)?.tier).toBe('bronze')
    expect(currentAchievementTier(tiers, 26)?.tier).toBe('silver')
    expect(currentAchievementTier(tiers, 51)?.tier).toBe('silver')
    expect(currentAchievementTier(tiers, 52)?.tier).toBe('gold')
  })

  it('reaches the top (platinum) tier of a 5-tier achievement', () => {
    const arTiers = allianceRankAchievement().tiers
    expect(currentAchievementTier(arTiers, 10)?.tier).toBe('gold')
    expect(currentAchievementTier(arTiers, 19)?.tier).toBe('gold')
    expect(currentAchievementTier(arTiers, 20)?.tier).toBe('platinum')
  })
})
