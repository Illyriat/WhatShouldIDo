import { useEffect, useState } from 'react'
import { FEATURE_FLAGS, type FeatureFlag } from '@shared/featureFlags'

// User-facing "declutter" toggles - separate from FEATURE_FLAGS, which is the
// developer's build-time kill switch. A feature the developer disabled never appears
// here at all (see the FEATURE_FLAGS[flag] filter wherever this list is rendered), so
// the user can only ever narrow what's already shipped, never widen it.
export const USER_TOGGLEABLE_FEATURES: {
  flag: FeatureFlag
  label: string
  description: string
  // Only offered while this other flag is also enabled - hides a sub-toggle (like the
  // upcoming-pledges preview) once its parent feature is turned off, since it'd do nothing.
  dependsOn?: FeatureFlag
}[] = [
  {
    flag: 'welcomeBanner',
    label: 'Welcome banner',
    description: 'The "Welcome, <account>!" banner (and Champion Points) at the top of the Home page.'
  },
  { flag: 'pledges', label: "Today's Pledges", description: "Today's Undaunted Pledge dungeons and recommendations on the Home page." },
  {
    flag: 'upcomingPledges',
    label: 'Upcoming pledges preview',
    description: "The 5-day upcoming-pledges toggle under Today's Pledges.",
    dependsOn: 'pledges'
  },
  { flag: 'ridingTraining', label: 'Riding Training', description: 'The Riding Training board on the Home page.' },
  {
    flag: 'dungeonChecklist',
    label: 'Dungeon Check List',
    description: 'The full per-character dungeon completion checklist page.'
  },
  { flag: 'allianceRank', label: 'Alliance Rank', description: 'The Alliance Rank page.' },
  { flag: 'alchemy', label: 'Alchemy', description: 'The Alchemy calculator page.' },
  { flag: 'enchanting', label: 'Enchanting', description: 'The Enchanting calculator page.' },
  { flag: 'musicBoxes', label: 'Music Boxes', description: 'The Music Boxes collection checklist.' },
  {
    flag: 'wealthTracker',
    label: 'Wealth Tracker',
    description: 'The Gold / Alliance Points / Tel Var Stones / Writ Vouchers board on the Home page.'
  },
  {
    flag: 'achievements',
    label: 'Achievements',
    description: "This app's own achievements page (currently: Music Box collection medals)."
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
    isEnabled: (flag) => FEATURE_FLAGS[flag] && !userDisabled.has(flag),
    setUserEnabled
  }
}
