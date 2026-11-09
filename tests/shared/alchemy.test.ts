import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { join } from 'path'
import {
  ALCHEMY_EFFECTS,
  REAGENTS,
  SOLVENTS,
  computeAlchemyResult,
  findRecipesForEffects,
  reagentIconUrl,
  effectIconUrl,
  solventIconUrl
} from '../../src/shared/alchemy'

describe('computeAlchemyResult', () => {
  it('only activates a trait shared by two or more chosen reagents', () => {
    // Beetle Scuttle: breach, increase-armor, protection, vitality
    // Blessed Thistle: restore-stamina, increase-power, speed, heal-absorption
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
    // beetle-scuttle, blessed-thistle and emetic-russula share nothing pairwise -
    // all of their traits go nowhere, so all three are wasted.
    const result = computeAlchemyResult(['beetle-scuttle', 'blessed-thistle', 'emetic-russula'], 'potion')
    expect(result.effects).toHaveLength(0)
    expect(result.wastedReagentIds.sort()).toEqual(['beetle-scuttle', 'blessed-thistle', 'emetic-russula'])
  })

  it('a reagent contributing to one active effect is not wasted, even if its other traits go nowhere', () => {
    // columbine (restore-health, restore-magicka, restore-stamina, unstoppable) and
    // blessed-thistle (restore-stamina, increase-power, speed, heal-absorption)
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

// Update 51 (2026) reworked Alchemy: Weapon/Spell Power became Increase Power,
// Weapon/Spell Critical became Critical, Maim was removed, and Force, Mending, Vexation,
// Damage Shield and Heal Absorption were added along with four new reagents.
describe('Update 51 reagent data', () => {
  const effectIds = new Set(ALCHEMY_EFFECTS.map((e) => e.id))

  it('has 38 reagents and 34 effects', () => {
    expect(REAGENTS).toHaveLength(38)
    expect(ALCHEMY_EFFECTS).toHaveLength(34)
  })

  it('gives every reagent four different, known traits', () => {
    for (const reagent of REAGENTS) {
      expect(new Set(reagent.traits).size, reagent.id).toBe(4)
      for (const trait of reagent.traits) expect(effectIds.has(trait), `${reagent.id}: ${trait}`).toBe(true)
    }
  })

  it('puts every effect on at least two reagents, so each one can be crafted', () => {
    for (const effect of ALCHEMY_EFFECTS) {
      const count = REAGENTS.filter((r) => r.traits.includes(effect.id)).length
      expect(count, effect.id).toBeGreaterThanOrEqual(2)
    }
  })

  // UESP's Online:Alchemy states the Update 51 total; a wrong trait anywhere changes it.
  it('gives the 270 two-reagent combinations UESP lists', () => {
    let pairs = 0
    for (let i = 0; i < REAGENTS.length; i++) {
      for (let j = i + 1; j < REAGENTS.length; j++) {
        if (REAGENTS[i].traits.some((t) => REAGENTS[j].traits.includes(t))) pairs++
      }
    }
    expect(pairs).toBe(270)
  })

  it('no longer has the traits Update 51 removed or merged', () => {
    for (const id of ['increase-weapon-power', 'increase-spell-power', 'weapon-critical', 'spell-critical', 'maim']) {
      expect(effectIds.has(id), id).toBe(false)
    }
  })

  it('includes the new reagents with their traits', () => {
    const traitsOf = (id: string): string[] | undefined => REAGENTS.find((r) => r.id === id)?.traits
    expect(traitsOf('cultivated-cryptpods')).toEqual(['increase-power', 'heroism', 'damage-shield', 'mending'])
    expect(traitsOf('winters-grave-tongue')).toEqual(['breach', 'defile', 'heal-absorption', 'vexation'])
  })

  it('has a bundled icon for every reagent, effect and solvent', () => {
    const publicDir = join(__dirname, '../../src/renderer/public/alchemy')
    for (const r of REAGENTS) expect(existsSync(join(publicDir, 'reagents', `${r.id}.png`)), r.id).toBe(true)
    for (const e of ALCHEMY_EFFECTS) expect(existsSync(join(publicDir, 'effects', `${e.id}.png`)), e.id).toBe(true)
    for (const s of SOLVENTS) expect(existsSync(join(publicDir, 'solvents', `${s.id}.png`)), s.id).toBe(true)
  })
})
