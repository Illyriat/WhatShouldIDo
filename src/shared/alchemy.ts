/**
 * ESO Alchemy game data plus the trait-matching rule, in `shared` so the renderer can
 * compute results without a round trip through the main process.
 *
 * Reagent and solvent tables come from eso-hub's Alchemy overview
 * (https://eso-hub.com/en/alchemy-reagents-and-solvents), checked against UESP's
 * Online:Alchemy. Current for Update 51 (2026): 38 reagents, 34 effects.
 *
 * Rule: mix a solvent with 2-3 reagents. Any trait shared by two or more reagents
 * becomes an effect on the result. Water solvents make potions (effects hit you),
 * oils make poisons (effects hit your target). The solvent only sets level and
 * potency, never which effects appear.
 */

export type AlchemyMode = 'potion' | 'poison'

// 'positive' effects help whoever they land on, 'negative' effects harm them.
export type EffectKind = 'positive' | 'negative'

export interface AlchemyEffect {
  id: string
  name: string
  kind: EffectKind
  // Phrased neutrally: it lands on you in a potion, on your target in a poison.
  description: string
}

export interface Reagent {
  id: string
  name: string
  // Four trait effect ids, in eso-hub's listed order.
  traits: [string, string, string, string]
}

export interface Solvent {
  id: string
  name: string
  mode: AlchemyMode
  // Alchemy level or Champion Point requirement to use it.
  requirement: string
  // 1..9, higher is a stronger result (9 = Lorkhan's Tears / Alkahest).
  tier: number
}

export const ALCHEMY_EFFECTS: AlchemyEffect[] = [
  { id: 'restore-health', name: 'Restore Health', kind: 'positive', description: 'Restores a burst of Health.' },
  { id: 'restore-magicka', name: 'Restore Magicka', kind: 'positive', description: 'Restores a burst of Magicka.' },
  { id: 'restore-stamina', name: 'Restore Stamina', kind: 'positive', description: 'Restores a burst of Stamina.' },
  { id: 'lingering-health', name: 'Lingering Health', kind: 'positive', description: 'Restores Health over time.' },
  {
    id: 'ravage-health',
    name: 'Ravage Health',
    kind: 'negative',
    description: 'Deals a burst of damage / drains Health.'
  },
  { id: 'ravage-magicka', name: 'Ravage Magicka', kind: 'negative', description: 'Drains Magicka.' },
  { id: 'ravage-stamina', name: 'Ravage Stamina', kind: 'negative', description: 'Drains Stamina.' },
  {
    id: 'gradual-ravage-health',
    name: 'Gradual Ravage Health',
    kind: 'negative',
    description: 'Deals poison damage over time.'
  },
  {
    id: 'increase-power',
    name: 'Increase Power',
    kind: 'positive',
    description: 'Major Brutality - increases Weapon and Spell Damage.'
  },
  {
    id: 'critical',
    name: 'Critical',
    kind: 'positive',
    description: 'Major Savagery - increases Weapon and Spell Critical rating.'
  },
  { id: 'force', name: 'Force', kind: 'positive', description: 'Increases Critical Damage done.' },
  {
    id: 'increase-armor',
    name: 'Increase Armor',
    kind: 'positive',
    description: 'Major Resolve - increases Physical Resistance.'
  },
  {
    id: 'increase-spell-resist',
    name: 'Increase Spell Resist',
    kind: 'positive',
    description: 'Major Ward - increases Spell Resistance.'
  },
  { id: 'speed', name: 'Speed', kind: 'positive', description: 'Major Expedition - increases movement speed.' },
  { id: 'protection', name: 'Protection', kind: 'positive', description: 'Minor Protection - reduces damage taken.' },
  {
    id: 'damage-shield',
    name: 'Damage Shield',
    kind: 'positive',
    description: 'Grants a damage shield that absorbs damage.'
  },
  { id: 'vitality', name: 'Vitality', kind: 'positive', description: 'Increases healing received.' },
  { id: 'mending', name: 'Mending', kind: 'positive', description: 'Major Mending - increases healing done.' },
  { id: 'heroism', name: 'Heroism', kind: 'positive', description: 'Minor Heroism - generates Ultimate over time.' },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    kind: 'positive',
    description: 'Grants immunity to knockback and disabling effects.'
  },
  { id: 'invisible', name: 'Invisible', kind: 'positive', description: 'Grants invisibility.' },
  {
    id: 'detection',
    name: 'Detection',
    kind: 'positive',
    description: 'Reveals nearby stealthed and invisible enemies.'
  },
  {
    id: 'breach',
    name: 'Breach',
    kind: 'negative',
    description: 'Minor Breach - reduces Physical and Spell Resistance.'
  },
  { id: 'fracture', name: 'Fracture', kind: 'negative', description: 'Minor Fracture - reduces Physical Resistance.' },
  {
    id: 'cowardice',
    name: 'Cowardice',
    kind: 'negative',
    description: 'Minor Cowardice - reduces Weapon and Spell Damage.'
  },
  {
    id: 'enervation',
    name: 'Enervation',
    kind: 'negative',
    description: 'Minor Enervation - reduces Critical Damage.'
  },
  { id: 'uncertainty', name: 'Uncertainty', kind: 'negative', description: 'Reduces Critical Strike chance.' },
  { id: 'timidity', name: 'Timidity', kind: 'negative', description: 'Drains Ultimate while in combat.' },
  {
    id: 'vulnerability',
    name: 'Vulnerability',
    kind: 'negative',
    description: 'Minor Vulnerability - increases damage taken.'
  },
  {
    id: 'defile',
    name: 'Defile',
    kind: 'negative',
    description: 'Minor Defile - reduces healing received and Health Recovery.'
  },
  { id: 'heal-absorption', name: 'Heal Absorption', kind: 'negative', description: 'Absorbs incoming healing.' },
  { id: 'vexation', name: 'Vexation', kind: 'negative', description: 'Reduces healing done.' },
  { id: 'hindrance', name: 'Hindrance', kind: 'negative', description: 'Minor Hindrance - reduces movement speed.' },
  { id: 'entrapment', name: 'Entrapment', kind: 'negative', description: 'Immobilizes the target.' }
]

export const REAGENTS: Reagent[] = [
  { id: 'beetle-scuttle', name: 'Beetle Scuttle', traits: ['breach', 'increase-armor', 'protection', 'vitality'] },
  {
    id: 'blessed-thistle',
    name: 'Blessed Thistle',
    traits: ['restore-stamina', 'increase-power', 'speed', 'heal-absorption']
  },
  {
    id: 'blue-entoloma',
    name: 'Blue Entoloma',
    traits: ['restore-health', 'ravage-magicka', 'invisible', 'heal-absorption']
  },
  { id: 'bugloss', name: 'Bugloss', traits: ['restore-health', 'restore-magicka', 'increase-spell-resist', 'mending'] },
  {
    id: 'butterfly-wing',
    name: 'Butterfly Wing',
    traits: ['restore-health', 'lingering-health', 'vitality', 'damage-shield']
  },
  { id: 'chaurus-egg', name: 'Chaurus Egg', traits: ['ravage-magicka', 'detection', 'timidity', 'vexation'] },
  { id: 'clam-gall', name: 'Clam Gall', traits: ['increase-spell-resist', 'hindrance', 'vulnerability', 'defile'] },
  {
    id: 'columbine',
    name: 'Columbine',
    traits: ['restore-health', 'restore-magicka', 'restore-stamina', 'unstoppable']
  },
  {
    id: 'corn-flower',
    name: 'Corn Flower',
    traits: ['ravage-health', 'restore-magicka', 'increase-power', 'detection']
  },
  {
    id: 'crimson-nirnroot',
    name: 'Crimson Nirnroot',
    traits: ['restore-health', 'gradual-ravage-health', 'timidity', 'force']
  },
  {
    id: 'cultivated-cryptpods',
    name: 'Cultivated Cryptpods',
    traits: ['increase-power', 'heroism', 'damage-shield', 'mending']
  },
  {
    id: 'daedra-blood-maggots',
    name: 'Daedra-Blood Maggots',
    traits: ['cowardice', 'entrapment', 'defile', 'heal-absorption']
  },
  { id: 'dragon-rheum', name: 'Dragon Rheum', traits: ['restore-magicka', 'uncertainty', 'speed', 'heroism'] },
  { id: 'dragons-bile', name: "Dragon's Bile", traits: ['invisible', 'vulnerability', 'vitality', 'heroism'] },
  { id: 'dragons-blood', name: "Dragon's Blood", traits: ['restore-stamina', 'lingering-health', 'defile', 'heroism'] },
  { id: 'dragonthorn', name: 'Dragonthorn', traits: ['restore-stamina', 'fracture', 'increase-power', 'critical'] },
  {
    id: 'emetic-russula',
    name: 'Emetic Russula',
    traits: ['ravage-health', 'ravage-magicka', 'ravage-stamina', 'entrapment']
  },
  {
    id: 'fleshfly-larva',
    name: 'Fleshfly Larva',
    traits: ['ravage-stamina', 'vulnerability', 'gradual-ravage-health', 'vitality']
  },
  {
    id: 'fossilized-verminous-bones',
    name: 'Fossilized Verminous Bones',
    traits: ['restore-stamina', 'detection', 'heroism', 'force']
  },
  { id: 'imp-stool', name: 'Imp Stool', traits: ['ravage-stamina', 'increase-armor', 'cowardice', 'enervation'] },
  { id: 'ladys-smock', name: "Lady's Smock", traits: ['restore-magicka', 'breach', 'critical', 'force'] },
  {
    id: 'luminous-russula',
    name: 'Luminous Russula',
    traits: ['restore-health', 'ravage-stamina', 'cowardice', 'hindrance']
  },
  {
    id: 'mountain-flower',
    name: 'Mountain Flower',
    traits: ['restore-health', 'restore-stamina', 'increase-armor', 'cowardice']
  },
  {
    id: 'mudcrab-chitin',
    name: 'Mudcrab Chitin',
    traits: ['increase-spell-resist', 'increase-armor', 'protection', 'defile']
  },
  { id: 'namiras-rot', name: "Namira's Rot", traits: ['unstoppable', 'invisible', 'speed', 'enervation'] },
  { id: 'nightshade', name: 'Nightshade', traits: ['ravage-health', 'protection', 'gradual-ravage-health', 'defile'] },
  { id: 'nirnroot', name: 'Nirnroot', traits: ['ravage-health', 'uncertainty', 'invisible', 'heal-absorption'] },
  {
    id: 'powdered-mother-of-pearl',
    name: 'Powdered Mother of Pearl',
    traits: ['speed', 'protection', 'vitality', 'mending']
  },
  { id: 'scrib-jelly', name: 'Scrib Jelly', traits: ['speed', 'vulnerability', 'lingering-health', 'vexation'] },
  { id: 'spider-egg', name: 'Spider Egg', traits: ['invisible', 'hindrance', 'defile', 'damage-shield'] },
  { id: 'stinkhorn', name: 'Stinkhorn', traits: ['ravage-health', 'ravage-stamina', 'fracture', 'force'] },
  { id: 'torchbug-thorax', name: 'Torchbug Thorax', traits: ['fracture', 'uncertainty', 'detection', 'mending'] },
  {
    id: 'vile-coagulant',
    name: 'Vile Coagulant',
    traits: ['ravage-health', 'restore-magicka', 'protection', 'timidity']
  },
  {
    id: 'violet-coprinus',
    name: 'Violet Coprinus',
    traits: ['ravage-health', 'ravage-magicka', 'breach', 'increase-power']
  },
  {
    id: 'water-hyacinth',
    name: 'Water Hyacinth',
    traits: ['restore-health', 'critical', 'entrapment', 'damage-shield']
  },
  {
    id: 'white-cap',
    name: 'White Cap',
    traits: ['ravage-magicka', 'increase-spell-resist', 'detection', 'enervation']
  },
  {
    id: 'winters-grave-tongue',
    name: "Winter's Grave Tongue",
    traits: ['breach', 'defile', 'heal-absorption', 'vexation']
  },
  { id: 'wormwood', name: 'Wormwood', traits: ['critical', 'unstoppable', 'detection', 'hindrance'] }
]

export const SOLVENTS: Solvent[] = [
  { id: 'natural-water', name: 'Natural Water', mode: 'potion', requirement: 'Level 3', tier: 1 },
  { id: 'clear-water', name: 'Clear Water', mode: 'potion', requirement: 'Level 10', tier: 2 },
  { id: 'pristine-water', name: 'Pristine Water', mode: 'potion', requirement: 'Level 20', tier: 3 },
  { id: 'cleansed-water', name: 'Cleansed Water', mode: 'potion', requirement: 'Level 30', tier: 4 },
  { id: 'filtered-water', name: 'Filtered Water', mode: 'potion', requirement: 'Level 40', tier: 5 },
  { id: 'purified-water', name: 'Purified Water', mode: 'potion', requirement: 'CP 10', tier: 6 },
  { id: 'cloud-mist', name: 'Cloud Mist', mode: 'potion', requirement: 'CP 50', tier: 7 },
  { id: 'star-dew', name: 'Star Dew', mode: 'potion', requirement: 'CP 100', tier: 8 },
  { id: 'lorkhans-tears', name: "Lorkhan's Tears", mode: 'potion', requirement: 'CP 150', tier: 9 },
  { id: 'grease', name: 'Grease', mode: 'poison', requirement: 'Level 3', tier: 1 },
  { id: 'ichor', name: 'Ichor', mode: 'poison', requirement: 'Level 10', tier: 2 },
  { id: 'slime', name: 'Slime', mode: 'poison', requirement: 'Level 20', tier: 3 },
  { id: 'gall', name: 'Gall', mode: 'poison', requirement: 'Level 30', tier: 4 },
  { id: 'terebinthine', name: 'Terebinthine', mode: 'poison', requirement: 'Level 40', tier: 5 },
  { id: 'pitch-bile', name: 'Pitch-Bile', mode: 'poison', requirement: 'CP 10', tier: 6 },
  { id: 'tarblack', name: 'Tarblack', mode: 'poison', requirement: 'CP 50', tier: 7 },
  { id: 'night-oil', name: 'Night-Oil', mode: 'poison', requirement: 'CP 100', tier: 8 },
  { id: 'alkahest', name: 'Alkahest', mode: 'poison', requirement: 'CP 150', tier: 9 }
]

const EFFECTS_BY_ID = new Map(ALCHEMY_EFFECTS.map((e) => [e.id, e]))
const REAGENTS_BY_ID = new Map(REAGENTS.map((r) => [r.id, r]))
const SOLVENTS_BY_ID = new Map(SOLVENTS.map((s) => [s.id, s]))

export function getEffect(id: string): AlchemyEffect | undefined {
  return EFFECTS_BY_ID.get(id)
}
export function getReagent(id: string): Reagent | undefined {
  return REAGENTS_BY_ID.get(id)
}
export function getSolvent(id: string): Solvent | undefined {
  return SOLVENTS_BY_ID.get(id)
}

// Keep these relative: the packaged app loads index.html over file://, where a
// leading '/' points at the filesystem root, not the app directory.
export function reagentIconUrl(id: string): string {
  return `./alchemy/reagents/${id}.png`
}
export function effectIconUrl(id: string): string {
  return `./alchemy/effects/${id}.png`
}
export function solventIconUrl(id: string): string {
  return `./alchemy/solvents/${id}.png`
}

// One effect on the crafted item and the reagents that produced it.
export interface ResolvedEffect {
  effect: AlchemyEffect
  // Selected reagents sharing this trait (always 2+).
  sourceReagentIds: string[]
}

export interface AlchemyResult {
  mode: AlchemyMode
  // Active effects, positive first then negative, each in the reagents' listed order.
  effects: ResolvedEffect[]
  // Selected reagents that share no trait with any other pick, so contribute nothing.
  wastedReagentIds: string[]
  // Effects on the wrong side: negatives in a potion, positives in a poison. Subset of `effects` by id.
  counterproductiveEffectIds: string[]
}

// Applies the trait-matching rule. Preserves `reagentIds` order for display; ignores
// duplicates and unknown ids. 0-1 reagents just yields no effects.
export function computeAlchemyResult(reagentIds: string[], mode: AlchemyMode): AlchemyResult {
  const chosen = reagentIds
    .filter((id, i) => reagentIds.indexOf(id) === i)
    .map((id) => REAGENTS_BY_ID.get(id))
    .filter((r): r is Reagent => Boolean(r))

  const traitOrder = ALCHEMY_EFFECTS.map((e) => e.id)
  const sourcesByTrait = new Map<string, string[]>()
  for (const reagent of chosen) {
    for (const trait of reagent.traits) {
      const list = sourcesByTrait.get(trait) ?? []
      list.push(reagent.id)
      sourcesByTrait.set(trait, list)
    }
  }

  const effects: ResolvedEffect[] = []
  for (const traitId of traitOrder) {
    const sources = sourcesByTrait.get(traitId)
    if (!sources || sources.length < 2) continue
    const effect = EFFECTS_BY_ID.get(traitId)
    if (!effect) continue
    effects.push({ effect, sourceReagentIds: sources })
  }
  effects.sort((a, b) => {
    if (a.effect.kind !== b.effect.kind) return a.effect.kind === 'positive' ? -1 : 1
    return traitOrder.indexOf(a.effect.id) - traitOrder.indexOf(b.effect.id)
  })

  const contributing = new Set(effects.flatMap((e) => e.sourceReagentIds))
  const wastedReagentIds = chosen.filter((r) => !contributing.has(r.id)).map((r) => r.id)

  const counterproductiveEffectIds = effects
    .filter((e) => (mode === 'potion' ? e.effect.kind === 'negative' : e.effect.kind === 'positive'))
    .map((e) => e.effect.id)

  return { mode, effects, wastedReagentIds, counterproductiveEffectIds }
}

// A reagent combination that produces a wanted set of effects.
export interface RecipeMatch {
  reagentIds: string[]
  result: AlchemyResult
  // true if no effect landed on the wrong side.
  clean: boolean
}

function combinations<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  const pick = (start: number, acc: T[]): void => {
    if (acc.length === size) {
      out.push(acc.slice())
      return
    }
    for (let i = start; i < items.length; i++) {
      acc.push(items[i])
      pick(i + 1, acc)
      acc.pop()
    }
  }
  pick(0, [])
  return out
}

// Every 2- and 3-reagent combination producing all of `targetEffectIds`. Sorted
// clean-first, then fewest total effects, then 2 reagents before 3. Capped at `limit`.
export function findRecipesForEffects(
  targetEffectIds: string[],
  mode: AlchemyMode,
  limit = 40
): RecipeMatch[] {
  const targets = targetEffectIds.filter((id) => EFFECTS_BY_ID.has(id))
  if (targets.length === 0) return []

  // A reagent with none of the target traits can't help.
  const candidates = REAGENTS.filter((r) => r.traits.some((t) => targets.includes(t)))

  const matches: RecipeMatch[] = []
  for (const size of [2, 3] as const) {
    for (const combo of combinations(candidates, size)) {
      const ids = combo.map((r) => r.id)
      const result = computeAlchemyResult(ids, mode)
      const produced = new Set(result.effects.map((e) => e.effect.id))
      if (!targets.every((t) => produced.has(t))) continue
      matches.push({ reagentIds: ids, result, clean: result.counterproductiveEffectIds.length === 0 })
    }
  }

  matches.sort((a, b) => {
    if (a.clean !== b.clean) return a.clean ? -1 : 1
    if (a.result.effects.length !== b.result.effects.length) {
      return a.result.effects.length - b.result.effects.length
    }
    return a.reagentIds.length - b.reagentIds.length
  })

  return matches.slice(0, limit)
}
