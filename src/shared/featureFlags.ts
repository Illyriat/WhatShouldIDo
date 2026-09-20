// Developer-only build-time switches - there's no UI for these. To ship a release
// without a feature, flip its value here and rebuild (`npm run build:win` etc.);
// no other code changes needed. These are plain runtime booleans (not a bundler
// `define`/dead-code-elimination mechanism), so disabled code still ships in the
// bundle, it just never renders or runs.
//
// languageSupport is the one exception: instead of a plain boolean, its value is an
// array of per-language switches (see src/shared/i18n/), so e.g. French can be pulled
// from a release (still translating it, found a quality issue) without disabling
// language support altogether. Codes match the locale files under
// src/shared/i18n/locales/. "Enabled overall" (isFeatureFlagOn below) means at least one
// language in the array is enabled; disabling every language falls back to English, same
// as a user who's never picked one.
export const FEATURE_FLAGS = {
  welcomeBanner: false,
  pledges: true,
  upcomingPledges: true,
  ridingTraining: true,
  dungeonChecklist: true,
  allianceRank: false,
  alchemy: true,
  enchanting: true,
  musicBoxes: true,
  wealthTracker: false,
  achievements: true,
  languageSupport: [
    { code: 'en', enabled: true },
    { code: 'fr', enabled: true }
  ] as { code: string; enabled: boolean }[]
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS

// Most flags are a plain boolean; languageSupport is an array of { code, enabled }
// entries instead (see above). Everywhere a flag's on/off state is checked - including
// user "declutter" overrides in useFeaturePreferences - goes through this so both shapes
// resolve to a single boolean rather than relying on an array's own (always-true)
// truthiness.
export function isFeatureFlagOn(value: (typeof FEATURE_FLAGS)[FeatureFlag]): boolean {
  return typeof value === 'boolean' ? value : value.some((entry) => entry.enabled)
}
