/**
 * ESO Music Box furnishings - a Collections checklist, not a calculator: each box is a
 * static reference entry, and the "collected" state is per-viewer, stored locally (see
 * the Music Boxes page). Currently obtainable boxes only - datamined/unreleased ones are
 * left out until UESP confirms how they're actually acquired.
 *
 * Source of truth: UESP "Online:Services Furnishings/Music Boxes"
 * (https://en.uesp.net/wiki/Online:Services_Furnishings/Music_Boxes).
 */

export type MusicBoxCurrency = 'crowns' | 'gold' | 'tradebars' | 'none'

export interface MusicBox {
  id: string
  name: string
  // Display price text, e.g. "800 / 640 (Discounted)". Null when there's no fixed price
  // (quest/event reward).
  cost: string | null
  currency: MusicBoxCurrency
  // Where to get it - vendor, antiquity lead, or quest/event reward.
  source: string
  description: string
}

export const MUSIC_BOXES: MusicBox[] = [
  { id: 'music-box-a-clash-of-fang-and-flame', name: 'A Clash of Fang and Flame', cost: '800 / 640 (Discounted)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays the rousing music box composition "A Clash of Fang and Flame."' },
  { id: 'music-box-a-frost-melt-melody', name: 'A Frost Melt Melody', cost: '800 / 640 (Discounted)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the traditional New Life Festival song, "A Frost Melt Melody."' },
  { id: 'music-box-a-wish-for-fish', name: 'A Wish for Fish', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the sedate "A Wish for Fish" composition.' },
  { id: 'music-box-ascension-to-the-ruby-throne', name: 'Ascension to the Ruby Throne', cost: '1,100', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays the majestic music box composition "Ascension to the Ruby Throne."' },
  { id: 'music-box-bleak-beacon-shanty', name: 'Bleak Beacon Shanty', cost: '1,000 / 800 (Discounted)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the eldritch "Bleak Beacon Shanty" composition.' },
  { id: 'music-box-blessings-of-stone', name: 'Blessings of Stone', cost: '150,000', currency: 'gold', source: 'Antiquities - Vendor: Idrenie Beren in Vastyr', description: 'When activated, plays a music box arrangement of the contemplative "Blessings of Stone" composition.' },
  { id: 'music-box-blood-and-glory', name: 'Blood and Glory', cost: '800', currency: 'crowns', source: 'Vendor: Housing Editor', description: 'When activated, plays a music box arrangement of the stirring "For Blood, For Glory, For Honor" theme.' },
  { id: 'music-box-dancing-among-the-flowers-fine', name: 'Dancing Among the Flowers Fine', cost: '800 / 640 (Discounted)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the soothing "Dancing Among the Flowers Fine" composition.' },
  { id: 'music-box-dawnbreakers-forging', name: 'Dawnbreaker\'s Forging', cost: '1,100 / 880 (ESO Plus Discount)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the exultant "Dawnbreaker\'s Forging" composition.' },
  { id: 'music-box-deeproot-dirge', name: 'Deeproot Dirge', cost: '1,000 / 800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the meditative "Deeproot" composition.' },
  { id: 'music-box-diamond-melody', name: 'Diamond Melody', cost: '800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box composition of the traditional imperial song "Chim-el Adabal."' },
  { id: 'music-box-dirennis-swan', name: 'Direnni\'s Swan', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the "Direnni\'s Swan" composition.' },
  { id: 'music-box-dreams-and-memories', name: 'Dreams and Memories', cost: '150,000', currency: 'gold', source: 'Antiquities - Vendor: Athrahgor in Skywatch, Redfur Trading Post, Uzipa in Vivec City or Tarmimn in Alinor', description: 'When activated, plays a music box arrangement of the poignant "Dreams and Memories" composition.' },
  { id: 'music-box-dreams-of-yokuda', name: 'Dreams of Yokuda', cost: '1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the soothing "Dreams of Yokuda" composition.' },
  { id: 'music-box-duel-of-the-seablades', name: 'Duel of the Seablades', cost: '1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the daring "Duel of the Seablades" composition.' },
  { id: 'music-box-enigmas-of-the-elder-way', name: 'Enigmas of the Elder Way', cost: '1,000 / 800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the mesmerizing "Enigmas of the Elder Way" composition.' },
  { id: 'music-box-farewell-to-nenalata', name: 'Farewell to Nenalata', cost: '800 / 640 (Discounted)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the wistful "Farewell to Nenalata" composition.' },
  { id: 'music-box-fargrave-daydreams', name: 'Fargrave Daydreams', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, this artistic rendering of the Celestial Palanquin plays a music box arrangement of the ominous "Fargrave Daydreams" composition.' },
  { id: 'music-box-feast-of-all-flames', name: 'Feast of all Flames', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the playfully tumultuous "Feast of All Flames" composition.' },
  { id: 'music-box-flickering-shadows', name: 'Flickering Shadows', cost: '800', currency: 'crowns', source: 'Vendor: Housing Editor', description: 'When activated, plays a music box arrangement of the mysterious "Flickering Shadows" composition.' },
  { id: 'music-box-glyphic-secrets', name: 'Glyphic Secrets', cost: '150,000', currency: 'gold', source: 'Antiquities - Vendor: Vasei in Necrom', description: 'When activated, plays a music box arrangement of the recondite "Glyphic Motion" composition.' },
  { id: 'music-box-gonfalon-galliard', name: 'Gonfalon Galliard', cost: '1,500 / 1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the sprightly "Gonfalon Galliard" composition.' },
  { id: 'music-box-high-isle-duel', name: 'High Isle Duel', cost: '1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the dramatic "High Isle Duel" composition.' },
  { id: 'music-box-hinterlands', name: 'Hinterlands', cost: '800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the Ebonheart Pact "Hinterlands" composition.' },
  { id: 'music-box-hymn-of-five-hundred-axes', name: 'Hymn of Five-Hundred Axes', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the Nord favorite "Hymn of Five-Hundred Axes" composition.' },
  { id: 'music-box-invitation-to-chaos', name: 'Invitation to Chaos', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the ominous "Invitation to Chaos" composition.' },
  { id: 'music-box-jesters-caprice', name: 'Jester\'s Caprice', cost: '1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the freeform "Jester\'s Caprice" composition.' },
  { id: 'music-box-lament-for-the-path-not-taken', name: 'Lament For the Path Not Taken', cost: '150,000', currency: 'gold', source: 'Antiquities - Vendor: Gathareth in Skingrad', description: 'When activated, plays a music box arrangement of the haunting "Lament for the Path Not Taken" composition.' },
  { id: 'music-box-mad-gods-garden', name: 'Mad God\'s Garden', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the frenetic "Mad God\'s Garden" composition.' },
  { id: 'music-box-merry-mudcrab-melody', name: 'Merry Mudcrab Melody', cost: '1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays the jaunty music box composition "Merry Mudcrab Melody."' },
  { id: 'music-box-mother-morrowinds-sacred-lullaby', name: 'Mother Morrowind\'s Sacred Lullaby', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the soporific "Mother Morrowind\'s Sacred Lullaby" composition.' },
  { id: 'music-box-never-fall-never-die', name: 'Never Fall, Never Die', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the Undaunted\'s rousing "Never Fall, Never Die" composition.' },
  { id: 'music-box-new-life-snow-symphony', name: 'New Life Snow Symphony', cost: '1,100', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays the ephemeral music box composition "New Life Snow Symphony."' },
  { id: 'music-box-oath-of-the-keepers', name: 'Oath of the Keepers', cost: '2,000', currency: 'tradebars', source: 'Vendor: Gold Coast Bazaar', description: 'When activated, plays a music box arrangement of the profound "Oath of the Keepers" composition.' },
  { id: 'music-box-sands-of-the-alikr', name: 'Sands of the Alik\'r', cost: '800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the Daggerfall Covenant "Sands of the Alik\'r" composition.' },
  { id: 'music-box-silver-rose', name: 'Silver Rose', cost: '1,000 / 800 / 640 (Discounted)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the devotional "Silver Rose" composition.' },
  { id: 'music-box-songbirds-paradise', name: 'Songbird\'s Paradise', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the uplifting "Songbird\'s Paradise" composition.' },
  { id: 'music-box-steadfast-armistice', name: 'Steadfast Armistice', cost: '1,000 / 800 (ESO Plus Discount)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the solemn "Steadfast Armistice" composition.' },
  { id: 'music-box-subterranean-sonata', name: 'Subterranean Sonata', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the otherworldly "Subterranean Sonata" composition.' },
  { id: 'music-box-that-breezy-night-in-bruma', name: 'That Breezy Night in Bruma', cost: '800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the romantic Heart\'s Day favorite, "That Breezy Night in Bruma."' },
  { id: 'music-box-the-ghosts-of-frostfall', name: 'The Ghosts of Frostfall', cost: '800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays the music box composition "The Ghosts of Frostfall."' },
  { id: 'music-box-the-hermit-crab-dance', name: 'The Hermit Crab Dance', cost: '150,000', currency: 'gold', source: 'Antiquities - Vendor: Wanam-Teemeetta in Sunport', description: 'When activated, plays a music box arrangement of the cheeky "The Hermit Crab Dance" composition.' },
  { id: 'music-box-the-liberation-of-leyawiin', name: 'The Liberation of Leyawiin', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the adventurous "The Liberation of Leyawiin" composition.' },
  { id: 'music-box-the-mad-harlequins-reverie', name: 'The Mad Harlequin\'s Reverie', cost: '800 / 640 (ESO Plus Discount)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the playful "The Mad Harlequin\'s Reverie" composition.' },
  { id: 'music-box-the-merry-meadmaker', name: 'The Merry Meadmaker', cost: null, currency: 'none', source: 'Reward for: A Salskap to Remember', description: 'When activated, plays a music box arrangement of the jaunty "The Merry Meadmaker" composition.' },
  { id: 'music-box-the-mirefrogs-hymn', name: 'The Mirefrog\'s Hymn', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the curiously adorable "The Mirefrog\'s Hymn" composition' },
  { id: 'music-box-the-shadows-stir', name: 'The Shadows Stir', cost: '800 / 640 (Discounted)', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the haunting "The Shadows Stir" composition.' },
  { id: 'music-box-times-architect', name: 'Time\'s Architect', cost: '1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the enigmatic "Time\'s Architect" composition.' },
  { id: 'music-box-unfathomable-knowledge', name: 'Unfathomable Knowledge', cost: '1,000', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the cryptic "Unfathomable Knowledge" composition.' },
  { id: 'music-box-witchmothers-bubbling-brew', name: 'Witchmother\'s Bubbling Brew', cost: '1,200', currency: 'crowns', source: 'Vendor: Crown Store', description: '"Pulp of pumpkin, dash of guts. Prep your cauldron, make your cuts. Capture death \'cause it\'s your due. Stir it all and then you\'re through." When activated, plays a music box arrangement of the macabre "Witchmother\'s Bubbling Brew" composition.' },
  { id: 'music-box-wonders-of-the-shoals', name: 'Wonders of the Shoals', cost: '1,100', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the whimsical "Wonders of the Shoals" composition.' },
  { id: 'music-box-yffre-in-every-leaf', name: 'Y\'ffre in Every Leaf', cost: '800', currency: 'crowns', source: 'Vendor: Crown Store', description: 'When activated, plays a music box arrangement of the Aldmeri Dominion "Y\'ffre in Every Leaf" composition.' }
]

const MUSIC_BOXES_BY_ID = new Map(MUSIC_BOXES.map((b) => [b.id, b]))

export function getMusicBox(id: string): MusicBox | undefined {
  return MUSIC_BOXES_BY_ID.get(id)
}

// Keep this relative: the packaged app loads index.html over file://, where a leading
// '/' points at the filesystem root, not the app directory.
export function musicBoxIconUrl(id: string): string {
  return `./musicboxes/${id}.jpg`
}

export const CURRENCY_LABEL: Record<MusicBoxCurrency, string> = {
  crowns: 'Crowns',
  gold: 'Gold',
  tradebars: 'Trade Bars',
  none: 'Reward'
}
