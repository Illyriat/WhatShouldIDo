/**
 * ESO Enchanting game data plus the glyph-resolution rule, in `shared` so the renderer
 * can compute results locally.
 *
 * A glyph is three runes:
 *   Potency  -> additive or subtractive, and the level.
 *   Essence  -> the effect (and which item type it goes on).
 *   Aspect   -> the quality (white..gold).
 * Resolution is a plain lookup: (essence, potency type) picks one glyph, potency sets
 * the level, aspect sets the quality.
 *
 * Rune translations and the essence->glyph matrix come from UESP's Online:Runestones,
 * checked against eso-hub. Current for the 2025 set (32 potency, 19 essence, 5 aspect,
 * 38 glyphs), Hakeijo and Indeko included.
 */

export type PotencyType = 'additive' | 'subtractive'
export type GlyphItemType = 'weapon' | 'armor' | 'jewelry'

export interface PotencyRune {
  id: string
  name: string
  type: PotencyType
  // Gear level range the rune crafts for, e.g. "1–10", "CP 160".
  levelLabel: string
}

export interface EssenceRune {
  id: string
  name: string
  // The rune's in-lore translation, as ESO shows it once decoded.
  translation: string
}

export interface AspectRune {
  id: string
  name: string
  quality: string
  // Swatch colour for the quality.
  color: string
}

export interface Glyph {
  id: string
  name: string
  itemType: GlyphItemType
  effect: string
}

export const ADDITIVE_POTENCY: PotencyRune[] = [
  { id: 'jora', name: 'Jora', type: 'additive', levelLabel: '1–10' },
  { id: 'porade', name: 'Porade', type: 'additive', levelLabel: '5–15' },
  { id: 'jera', name: 'Jera', type: 'additive', levelLabel: '10–20' },
  { id: 'jejora', name: 'Jejora', type: 'additive', levelLabel: '15–25' },
  { id: 'odra', name: 'Odra', type: 'additive', levelLabel: '20–35' },
  { id: 'pojora', name: 'Pojora', type: 'additive', levelLabel: '25–35' },
  { id: 'edora', name: 'Edora', type: 'additive', levelLabel: '30–40' },
  { id: 'jaera', name: 'Jaera', type: 'additive', levelLabel: '35–45' },
  { id: 'pora', name: 'Pora', type: 'additive', levelLabel: '40–50' },
  { id: 'denara', name: 'Denara', type: 'additive', levelLabel: 'CP 10–30' },
  { id: 'rera', name: 'Rera', type: 'additive', levelLabel: 'CP 30–50' },
  { id: 'derado', name: 'Derado', type: 'additive', levelLabel: 'CP 50–70' },
  { id: 'rekura', name: 'Rekura', type: 'additive', levelLabel: 'CP 70–100' },
  { id: 'kura', name: 'Kura', type: 'additive', levelLabel: 'CP 100–150' },
  { id: 'rejera', name: 'Rejera', type: 'additive', levelLabel: 'CP 150' },
  { id: 'repora', name: 'Repora', type: 'additive', levelLabel: 'CP 160' }
]

export const SUBTRACTIVE_POTENCY: PotencyRune[] = [
  { id: 'jode', name: 'Jode', type: 'subtractive', levelLabel: '1–10' },
  { id: 'notade', name: 'Notade', type: 'subtractive', levelLabel: '5–15' },
  { id: 'ode', name: 'Ode', type: 'subtractive', levelLabel: '10–20' },
  { id: 'tade', name: 'Tade', type: 'subtractive', levelLabel: '15–25' },
  { id: 'jayde', name: 'Jayde', type: 'subtractive', levelLabel: '20–35' },
  { id: 'edode', name: 'Edode', type: 'subtractive', levelLabel: '25–35' },
  { id: 'pojode', name: 'Pojode', type: 'subtractive', levelLabel: '30–40' },
  { id: 'rekude', name: 'Rekude', type: 'subtractive', levelLabel: '35–45' },
  { id: 'hade', name: 'Hade', type: 'subtractive', levelLabel: '40–50' },
  { id: 'idode', name: 'Idode', type: 'subtractive', levelLabel: 'CP 10–30' },
  { id: 'pode', name: 'Pode', type: 'subtractive', levelLabel: 'CP 30–50' },
  { id: 'kedeko', name: 'Kedeko', type: 'subtractive', levelLabel: 'CP 50–70' },
  { id: 'rede', name: 'Rede', type: 'subtractive', levelLabel: 'CP 70–100' },
  { id: 'kude', name: 'Kude', type: 'subtractive', levelLabel: 'CP 100–150' },
  { id: 'jehade', name: 'Jehade', type: 'subtractive', levelLabel: 'CP 150' },
  { id: 'itade', name: 'Itade', type: 'subtractive', levelLabel: 'CP 160' }
]

export const POTENCY_RUNES: PotencyRune[] = [...ADDITIVE_POTENCY, ...SUBTRACTIVE_POTENCY]

export const ASPECT_RUNES: AspectRune[] = [
  { id: 'ta', name: 'Ta', quality: 'Normal', color: '#c7ccd4' },
  { id: 'jejota', name: 'Jejota', quality: 'Fine', color: '#4a9d6f' },
  { id: 'denata', name: 'Denata', quality: 'Superior', color: '#4c8dd6' },
  { id: 'rekuta', name: 'Rekuta', quality: 'Epic', color: '#9a5cc6' },
  { id: 'kuta', name: 'Kuta', quality: 'Legendary', color: '#d4a017' }
]

export const ESSENCE_RUNES: EssenceRune[] = [
  { id: 'dekeipa', name: 'Dekeipa', translation: 'Frost' },
  { id: 'deni', name: 'Deni', translation: 'Stamina' },
  { id: 'denima', name: 'Denima', translation: 'Stamina Regen' },
  { id: 'deteri', name: 'Deteri', translation: 'Armor' },
  { id: 'hakeijo', name: 'Hakeijo', translation: 'Prism' },
  { id: 'haoko', name: 'Haoko', translation: 'Disease' },
  { id: 'indeko', name: 'Indeko', translation: 'Prismatic Regen' },
  { id: 'kaderi', name: 'Kaderi', translation: 'Shield' },
  { id: 'kuoko', name: 'Kuoko', translation: 'Poison' },
  { id: 'makderi', name: 'Makderi', translation: 'Spell Harm' },
  { id: 'makko', name: 'Makko', translation: 'Magicka' },
  { id: 'makkoma', name: 'Makkoma', translation: 'Magicka Regen' },
  { id: 'meip', name: 'Meip', translation: 'Shock' },
  { id: 'oko', name: 'Oko', translation: 'Health' },
  { id: 'okoma', name: 'Okoma', translation: 'Health Regen' },
  { id: 'okori', name: 'Okori', translation: 'Power' },
  { id: 'oru', name: 'Oru', translation: 'Alchemist' },
  { id: 'rakeipa', name: 'Rakeipa', translation: 'Fire' },
  { id: 'taderi', name: 'Taderi', translation: 'Physical Harm' }
]

export const GLYPHS: Glyph[] = [
  // Weapon
  { id: 'flame', name: 'Glyph of Flame', itemType: 'weapon', effect: 'Deals Fire Damage on hit.' },
  { id: 'frost', name: 'Glyph of Frost', itemType: 'weapon', effect: 'Deals Frost Damage on hit.' },
  { id: 'shock', name: 'Glyph of Shock', itemType: 'weapon', effect: 'Deals Shock Damage on hit.' },
  { id: 'poison', name: 'Glyph of Poison', itemType: 'weapon', effect: 'Deals Poison Damage on hit.' },
  { id: 'foulness', name: 'Glyph of Foulness', itemType: 'weapon', effect: 'Deals Disease Damage on hit.' },
  {
    id: 'absorb-health',
    name: 'Glyph of Absorb Health',
    itemType: 'weapon',
    effect: 'Deals Magic Damage and restores Health to you.'
  },
  {
    id: 'absorb-magicka',
    name: 'Glyph of Absorb Magicka',
    itemType: 'weapon',
    effect: 'Deals Magic Damage and restores Magicka to you.'
  },
  {
    id: 'absorb-stamina',
    name: 'Glyph of Absorb Stamina',
    itemType: 'weapon',
    effect: 'Deals Physical Damage and restores Stamina to you.'
  },
  {
    id: 'decrease-health',
    name: 'Glyph of Decrease Health',
    itemType: 'weapon',
    effect: 'Deals unresistable Magic Damage on hit.'
  },
  {
    id: 'hardening',
    name: 'Glyph of Hardening',
    itemType: 'weapon',
    effect: 'Grants you a Damage Shield for 5 seconds on hit.'
  },
  {
    id: 'weapon-damage',
    name: 'Glyph of Weapon Damage',
    itemType: 'weapon',
    effect: 'Increases your Weapon and Spell Damage for 5 seconds on hit.'
  },
  {
    id: 'crushing',
    name: 'Glyph of Crushing',
    itemType: 'weapon',
    effect: "Reduces the target's Physical and Spell Resistance for 5 seconds."
  },
  {
    id: 'weakening',
    name: 'Glyph of Weakening',
    itemType: 'weapon',
    effect: "Reduces the target's Weapon and Spell Damage for 5 seconds."
  },
  {
    id: 'prismatic-onslaught',
    name: 'Glyph of Prismatic Onslaught',
    itemType: 'weapon',
    effect: 'Deals extra Magic Damage to undead and Daedra, and restores Health, Magicka, and Stamina.'
  },
  // Armor
  { id: 'health', name: 'Glyph of Health', itemType: 'armor', effect: 'Adds Max Health.' },
  { id: 'magicka', name: 'Glyph of Magicka', itemType: 'armor', effect: 'Adds Max Magicka.' },
  { id: 'stamina', name: 'Glyph of Stamina', itemType: 'armor', effect: 'Adds Max Stamina.' },
  {
    id: 'prismatic-defense',
    name: 'Glyph of Prismatic Defense',
    itemType: 'armor',
    effect: 'Adds Max Health, Magicka, and Stamina.'
  },
  // Jewelry
  { id: 'increase-physical-harm', name: 'Glyph of Increase Physical Harm', itemType: 'jewelry', effect: 'Adds Weapon Damage.' },
  { id: 'increase-magical-harm', name: 'Glyph of Increase Magical Harm', itemType: 'jewelry', effect: 'Adds Spell Damage.' },
  { id: 'decrease-physical-harm', name: 'Glyph of Decrease Physical Harm', itemType: 'jewelry', effect: 'Adds Physical Resistance (Armor).' },
  { id: 'decrease-spell-harm', name: 'Glyph of Decrease Spell Harm', itemType: 'jewelry', effect: 'Adds Spell Resistance.' },
  { id: 'health-recovery', name: 'Glyph of Health Recovery', itemType: 'jewelry', effect: 'Adds Health Recovery.' },
  { id: 'magicka-recovery', name: 'Glyph of Magicka Recovery', itemType: 'jewelry', effect: 'Adds Magicka Recovery.' },
  { id: 'stamina-recovery', name: 'Glyph of Stamina Recovery', itemType: 'jewelry', effect: 'Adds Stamina Recovery.' },
  { id: 'prismatic-recovery', name: 'Glyph of Prismatic Recovery', itemType: 'jewelry', effect: 'Adds Health, Magicka, and Stamina Recovery.' },
  { id: 'reduce-spell-cost', name: 'Glyph of Reduce Spell Cost', itemType: 'jewelry', effect: 'Reduces the Magicka cost of your spells.' },
  { id: 'reduce-feat-cost', name: 'Glyph of Reduce Feat Cost', itemType: 'jewelry', effect: 'Reduces the Stamina cost of your abilities.' },
  { id: 'reduce-skill-cost', name: 'Glyph of Reduce Skill Cost', itemType: 'jewelry', effect: 'Reduces the Health, Magicka, and Stamina cost of your abilities.' },
  { id: 'flame-resist', name: 'Glyph of Flame Resist', itemType: 'jewelry', effect: 'Adds Fire Resistance.' },
  { id: 'frost-resist', name: 'Glyph of Frost Resist', itemType: 'jewelry', effect: 'Adds Frost Resistance.' },
  { id: 'shock-resist', name: 'Glyph of Shock Resist', itemType: 'jewelry', effect: 'Adds Shock Resistance.' },
  { id: 'poison-resist', name: 'Glyph of Poison Resist', itemType: 'jewelry', effect: 'Adds Poison Resistance.' },
  { id: 'disease-resist', name: 'Glyph of Disease Resist', itemType: 'jewelry', effect: 'Adds Disease Resistance.' },
  { id: 'bashing', name: 'Glyph of Bashing', itemType: 'jewelry', effect: 'Increases your Bash damage.' },
  { id: 'bracing', name: 'Glyph of Bracing', itemType: 'jewelry', effect: 'Reduces the cost of Blocking.' },
  { id: 'potion-boost', name: 'Glyph of Potion Boost', itemType: 'jewelry', effect: 'Increases the effectiveness of potions you drink.' },
  { id: 'potion-speed', name: 'Glyph of Potion Speed', itemType: 'jewelry', effect: "Reduces the cooldown of potions below this item's level." }
]

// essence rune id -> the glyph it makes with an additive vs a subtractive potency rune.
const ESSENCE_TO_GLYPH: Record<string, { additive: string; subtractive: string }> = {
  dekeipa: { additive: 'frost', subtractive: 'frost-resist' },
  deni: { additive: 'stamina', subtractive: 'absorb-stamina' },
  denima: { additive: 'stamina-recovery', subtractive: 'reduce-feat-cost' },
  deteri: { additive: 'hardening', subtractive: 'crushing' },
  hakeijo: { additive: 'prismatic-defense', subtractive: 'prismatic-onslaught' },
  haoko: { additive: 'foulness', subtractive: 'disease-resist' },
  indeko: { additive: 'prismatic-recovery', subtractive: 'reduce-skill-cost' },
  kaderi: { additive: 'bashing', subtractive: 'bracing' },
  kuoko: { additive: 'poison', subtractive: 'poison-resist' },
  makderi: { additive: 'increase-magical-harm', subtractive: 'decrease-spell-harm' },
  makko: { additive: 'magicka', subtractive: 'absorb-magicka' },
  makkoma: { additive: 'magicka-recovery', subtractive: 'reduce-spell-cost' },
  meip: { additive: 'shock', subtractive: 'shock-resist' },
  oko: { additive: 'health', subtractive: 'absorb-health' },
  okoma: { additive: 'health-recovery', subtractive: 'decrease-health' },
  okori: { additive: 'weapon-damage', subtractive: 'weakening' },
  oru: { additive: 'potion-boost', subtractive: 'potion-speed' },
  rakeipa: { additive: 'flame', subtractive: 'flame-resist' },
  taderi: { additive: 'increase-physical-harm', subtractive: 'decrease-physical-harm' }
}

const POTENCY_BY_ID = new Map(POTENCY_RUNES.map((r) => [r.id, r]))
const ESSENCE_BY_ID = new Map(ESSENCE_RUNES.map((r) => [r.id, r]))
const ASPECT_BY_ID = new Map(ASPECT_RUNES.map((r) => [r.id, r]))
const GLYPH_BY_ID = new Map(GLYPHS.map((g) => [g.id, g]))

export function getPotencyRune(id: string): PotencyRune | undefined {
  return POTENCY_BY_ID.get(id)
}
export function getEssenceRune(id: string): EssenceRune | undefined {
  return ESSENCE_BY_ID.get(id)
}
export function getAspectRune(id: string): AspectRune | undefined {
  return ASPECT_BY_ID.get(id)
}
export function getGlyph(id: string): Glyph | undefined {
  return GLYPH_BY_ID.get(id)
}

// Keep these relative: the packaged app loads index.html over file://, where a
// leading '/' points at the filesystem root, not the app directory.
export function runeIconUrl(id: string): string {
  return `./enchanting/runes/${id}.png`
}
export function glyphIconUrl(id: string): string {
  return `./enchanting/glyphs/${id}.png`
}

// Which glyph an essence rune produces for a given potency type.
export function glyphForEssence(essenceId: string, potencyType: PotencyType): Glyph | undefined {
  const pair = ESSENCE_TO_GLYPH[essenceId]
  return pair ? GLYPH_BY_ID.get(pair[potencyType]) : undefined
}

// The essence rune and potency type that produce a given glyph.
export function runesForGlyph(glyphId: string): { essence: EssenceRune; potencyType: PotencyType } | null {
  for (const [essenceId, pair] of Object.entries(ESSENCE_TO_GLYPH)) {
    const type = (['additive', 'subtractive'] as const).find((t) => pair[t] === glyphId)
    if (type) {
      const essence = ESSENCE_BY_ID.get(essenceId)
      if (essence) return { essence, potencyType: type }
    }
  }
  return null
}

export interface EnchantResult {
  glyph: Glyph
  potency: PotencyRune
  essence: EssenceRune
  aspect?: AspectRune
  // The crafted glyph's level and quality, ready to display.
  levelLabel: string
  qualityLabel: string
}

// Resolves the chosen runes into a glyph. Null until both a potency and an essence
// rune are picked; aspect is optional and only sets quality.
export function computeGlyph(
  potencyId: string | null,
  essenceId: string | null,
  aspectId: string | null
): EnchantResult | null {
  if (!potencyId || !essenceId) return null
  const potency = POTENCY_BY_ID.get(potencyId)
  const essence = ESSENCE_BY_ID.get(essenceId)
  if (!potency || !essence) return null
  const glyph = glyphForEssence(essence.id, potency.type)
  if (!glyph) return null
  const aspect = aspectId ? ASPECT_BY_ID.get(aspectId) : undefined
  return {
    glyph,
    potency,
    essence,
    aspect,
    levelLabel: potency.levelLabel,
    qualityLabel: aspect ? aspect.quality : 'depends on Aspect rune'
  }
}
