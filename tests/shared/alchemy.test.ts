import { describe, it, expect } from 'vitest'
import {
  computeAlchemyResult,
  findRecipesForEffects,
  reagentIconUrl,
  effectIconUrl,
  solventIconUrl
} from '../../src/shared/alchemy'

describe('computeAlchemyResult', () => {
  it('only activates a trait shared by two or more chosen reagents', () => {
    // Beetle Scuttle: breach, increase-armor, protection, vitality
    // Blessed Thistle: ravage-health, restore-stamina, increase-weapon-power, speed
    // -> no shared trait at all between just these two
    const result = computeAlchemyResult(['beetle-scuttle', 'blessed-thistle'], 'potion')
    expect(result.effects).toHaveLength(0)
    expect(result.wastedReagentIds.sort()).toEqual(['beetle-scuttle', 'blessed-thistle'])
  })

  it('activates a trait shared by exactly two reagents and records both sources', () => {
    // Beetle Scuttle & Mudcrab Chitin both have increase-armor and protection... use a
    // pair that shares exactly one trait: Beetle Scuttle (protection) + Nightshade (protection)
    const result = computeAlchemyResult(['beetle-scuttle', 'nightshade'], 'potion')
    const protection = result.effects.find((e) => e.effect.id === 'protection')
    expect(protection?.sourceReagentIds.sort()).toEqual(['beetle-scuttle', 'nightshade'])
  })

  it('a reagent that shares no trait with any other chosen reagent is wasted', () => {
    // beetle-scuttle, blessed-thistle and blue-entoloma share nothing pairwise -
    // all three of their traits go nowhere, so all three are wasted.
    const result = computeAlchemyResult(['beetle-scuttle', 'blessed-thistle', 'blue-entoloma'], 'potion')
    expect(result.effects).toHaveLength(0)
    expect(result.wastedReagentIds.sort()).toEqual(['beetle-scuttle', 'blessed-thistle', 'blue-entoloma'])
  })

  it('a reagent contributing to one active effect is not wasted, even if its other traits go nowhere', () => {
    // columbine (restore-health, restore-magicka, restore-stamina, unstoppable) and
    // blessed-thistle (ravage-health, restore-stamina, increase-weapon-power, speed)
    // share exactly 'restore-stamina' - both contribute, so neither is wasted, even
    // though columbine's other three traits and blessed-thistle's other three go nowhere.
    const result = computeAlchemyResult(['columbine', 'blessed-thistle'], 'potion')
    expect(result.effects.map((e) => e.effect.id)).toEqual(['restore-stamina'])
    expect(result.wastedReagentIds).toHaveLength(0)
  })

  it('flags negative effects as counterproductive in a potion', () => {
    // Nightshade & Nirnroot both have ravage-health (negative)
    const result = computeAlchemyResult(['nightshade', 'nirnroot'], 'potion')
    expect(result.counterproductiveEffectIds).toContain('ravage-health')
  })

  it('flags positive effects as counterproductive in a poison', () => {
    const result = computeAlchemyResult(['nightshade', 'nirnroot'], 'poison')
    // both also share nothing positive here, so assert against a pair that does:
    // Beetle Scuttle & Nightshade both have 'protection' (positive)
    const positiveResult = computeAlchemyResult(['beetle-scuttle', 'nightshade'], 'poison')
    expect(positiveResult.counterproductiveEffectIds).toContain('protection')
    expect(result.counterproductiveEffectIds).not.toContain('protection')
  })

  it('deduplicates a repeated reagent id instead of double-counting it', () => {
    const result = computeAlchemyResult(['beetle-scuttle', 'beetle-scuttle'], 'potion')
    expect(result.effects).toHaveLength(0)
  })

  it('ignores unknown reagent ids', () => {
    const result = computeAlchemyResult(['beetle-scuttle', 'not-a-real-reagent'], 'potion')
    expect(result.wastedReagentIds).toEqual(['beetle-scuttle'])
  })

  it('handles fewer than two reagents with no effects', () => {
    expect(computeAlchemyResult([], 'potion').effects).toHaveLength(0)
    expect(computeAlchemyResult(['beetle-scuttle'], 'potion').effects).toHaveLength(0)
  })
})

describe('findRecipesForEffects', () => {
  it('returns only recipes that produce every requested effect', () => {
    const matches = findRecipesForEffects(['protection'], 'potion')
    expect(matches.length).toBeGreaterThan(0)
    for (const match of matches) {
      const producedIds = match.result.effects.map((e) => e.effect.id)
      expect(producedIds).toContain('protection')
    }
  })

  it('returns an empty list for no target effects', () => {
    expect(findRecipesForEffects([], 'potion')).toEqual([])
  })

  it('sorts clean recipes before recipes with a counterproductive side effect', () => {
    const matches = findRecipesForEffects(['protection'], 'potion', 40)
    const firstDirtyIndex = matches.findIndex((m) => !m.clean)
    const lastCleanIndex = matches.reduce((last, m, i) => (m.clean ? i : last), -1)
    if (firstDirtyIndex !== -1 && lastCleanIndex !== -1) {
      expect(lastCleanIndex).toBeLessThan(firstDirtyIndex)
    }
  })
})

describe('icon URL helpers', () => {
  // Regression guard: these must stay relative, not root-absolute ('/...'), because
  // the packaged app loads index.html via file:// where a leading '/' resolves to the
  // filesystem root instead of the app's own directory (see the shipped-broken-icons bug).
  it('reagentIconUrl/effectIconUrl/solventIconUrl are relative paths', () => {
    expect(reagentIconUrl('nirnroot')).toBe('./alchemy/reagents/nirnroot.png')
    expect(effectIconUrl('protection')).toBe('./alchemy/effects/protection.png')
    expect(solventIconUrl('grease')).toBe('./alchemy/solvents/grease.png')
  })
})
