// Developer-only build-time switches - there's no UI for these. To ship a release
// without a feature, flip its value here and rebuild (`npm run build:win` etc.);
// no other code changes needed. These are plain runtime booleans (not a bundler
// `define`/dead-code-elimination mechanism), so disabled code still ships in the
// bundle, it just never renders or runs.
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
  achievements: true
} as const

export type FeatureFlag = keyof typeof FEATURE_FLAGS
