import { useEffect, useState } from 'react'
import { FEATURE_FLAGS, isFeatureFlagOn, type FeatureFlag } from '@shared/featureFlags'

// User-facing "declutter" toggles - separate from FEATURE_FLAGS, which is the
// developer's build-time kill switch. A feature the developer disabled never appears
// here at all (see the FEATURE_FLAGS[flag] filter wherever this list is rendered), so
// the user can only ever narrow what's already shipped, never widen it.
export const USER_TOGGLEABLE_FEATURES: {
  flag: FeatureFlag
  labelKey: string
  descriptionKey: string
  // Only offered while this other flag is also enabled - hides a sub-toggle (like the
  // upcoming-pledges preview) once its parent feature is turned off, since it'd do nothing.
  dependsOn?: FeatureFlag
}[] = [
  { flag: 'welcomeBanner', labelKey: 'settings.features.welcomeBanner.label', descriptionKey: 'settings.features.welcomeBanner.description' },
  { flag: 'pledges', labelKey: 'settings.features.pledges.label', descriptionKey: 'settings.features.pledges.description' },
  {
    flag: 'upcomingPledges',
    labelKey: 'settings.features.upcomingPledges.label',
    descriptionKey: 'settings.features.upcomingPledges.description',
    dependsOn: 'pledges'
  },
  { flag: 'ridingTraining', labelKey: 'settings.features.ridingTraining.label', descriptionKey: 'settings.features.ridingTraining.description' },
  {
    flag: 'dungeonChecklist',
    labelKey: 'settings.features.dungeonChecklist.label',
    descriptionKey: 'settings.features.dungeonChecklist.description'
  },
  {
    flag: 'allianceRank',
    labelKey: 'settings.features.allianceRank.label',
    descriptionKey: 'settings.features.allianceRank.description'
  },
  { flag: 'alchemy', labelKey: 'settings.features.alchemy.label', descriptionKey: 'settings.features.alchemy.description' },
  { flag: 'enchanting', labelKey: 'settings.features.enchanting.label', descriptionKey: 'settings.features.enchanting.description' },
  {
    flag: 'musicBoxes',
    labelKey: 'settings.features.musicBoxes.label',
    descriptionKey: 'settings.features.musicBoxes.description'
  },
  {
    flag: 'wealthTracker',
    labelKey: 'settings.features.wealthTracker.label',
    descriptionKey: 'settings.features.wealthTracker.description'
  },
  {
    flag: 'achievements',
    labelKey: 'settings.features.achievements.label',
    descriptionKey: 'settings.features.achievements.description'
  },
  {
    flag: 'languageSupport',
    labelKey: 'settings.features.languageSupport.label',
    descriptionKey: 'settings.features.languageSupport.description'
  }
]

export interface FeaturePreferences {
  // True only if the developer build flag is on AND the user hasn't turned it off.
  isEnabled: (flag: FeatureFlag) => boolean
  setUserEnabled: (flag: FeatureFlag, enabled: boolean) => void
}

// Persisted via IPC into settings.json (see src/main/ipc/settingsApi.ts), not
// localStorage - Electron's file:// renderer doesn't reliably flush localStorage to
// disk across app restarts, but settings.json is plain fs.writeFile and always does.
export function useFeaturePreferences(): FeaturePreferences {
  const [userDisabled, setUserDisabled] = useState<Set<FeatureFlag>>(new Set())

  useEffect(() => {
    let cancelled = false
    window.api.getAppSettings().then((settings) => {
      if (cancelled) return
      setUserDisabled(new Set(settings.disabledFeatures.filter((f): f is FeatureFlag => f in FEATURE_FLAGS)))
    })
    return () => {
      cancelled = true
    }
  }, [])

  function setUserEnabled(flag: FeatureFlag, enabled: boolean): void {
    setUserDisabled((prev) => {
      const next = new Set(prev)
      if (enabled) next.delete(flag)
      else next.add(flag)
      window.api.setDisabledFeatures([...next])
      return next
    })
  }

  return {
    isEnabled: (flag) => isFeatureFlagOn(FEATURE_FLAGS[flag]) && !userDisabled.has(flag),
    setUserEnabled
  }
}
