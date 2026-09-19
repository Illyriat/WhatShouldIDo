import { describe, it, expect } from 'vitest'
import {
  allianceRankAchievement,
  currentAchievementTier,
  currentWealthTier,
  musicBoxAchievement,
  wealthAchievement
} from '../../src/shared/achievements'

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

describe('wealthAchievement', () => {
  it('requires all four currencies at once, strictly increasing tier over tier', () => {
    const achievement = wealthAchievement()
    expect(achievement.tiers).toEqual([
      { tier: 'peasant', name: 'Peasant', requirement: { gold: 10_000, alliancePoints: 0, telVarStones: 0, writVouchers: 0 } },
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
    ])
  })

  it('every currency requirement strictly increases from tier to tier', () => {
    const tiers = wealthAchievement().tiers
    const keys = ['gold', 'alliancePoints', 'telVarStones', 'writVouchers'] as const
    for (const key of keys) {
      for (let i = 1; i < tiers.length; i++) {
        expect(tiers[i].requirement[key]).toBeGreaterThan(tiers[i - 1].requirement[key])
      }
    }
  })
})

describe('currentWealthTier', () => {
  const tiers = wealthAchievement().tiers

  it('is null below Peasant (needs at least 10,000 Gold)', () => {
    expect(currentWealthTier(tiers, { gold: 9_999, alliancePoints: 0, telVarStones: 0, writVouchers: 0 })).toBeNull()
  })

  it('is Peasant with only Gold, even with nothing else', () => {
    const amounts = { gold: 10_000, alliancePoints: 0, telVarStones: 0, writVouchers: 0 }
    expect(currentWealthTier(tiers, amounts)?.tier).toBe('peasant')
  })

  it('is capped by whichever currency is weakest, not the strongest', () => {
    // Gold/AP/Tel Var all clear Magnate, but Writ Vouchers only clears Baron.
    const amounts = {
      gold: 6_000_000_000,
      alliancePoints: 300_000_000,
      telVarStones: 2_000_000,
      writVouchers: 6_500
    }
    expect(currentWealthTier(tiers, amounts)?.tier).toBe('baron')
  })

  it('reaches Magnate only once every currency clears it', () => {
    const amounts = {
      gold: 5_000_000_000,
      alliancePoints: 250_000_000,
      telVarStones: 1_500_000,
      writVouchers: 15_000
    }
    expect(currentWealthTier(tiers, amounts)?.tier).toBe('magnate')
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
