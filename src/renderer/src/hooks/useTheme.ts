import { useEffect, useState } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark' | 'ember' | 'frost'
export type EffectiveTheme = 'light' | 'dark' | 'ember' | 'frost'

const STORAGE_KEY = 'wsid-theme-preference'

function resolveSystemTheme(): EffectiveTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'system' || stored === 'light' || stored === 'dark' || stored === 'ember' || stored === 'frost') {
    return stored
  }
  return 'system'
}

export interface ThemeControl {
  preference: ThemePreference
  effectiveTheme: EffectiveTheme
  setPreference: (preference: ThemePreference) => void
}

// Applies the theme as a `data-theme` attribute on <html> for styles.css to key off.
// "system" tracks the OS light/dark preference live via a matchMedia listener.
export function useTheme(): ThemeControl {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference)

  const setPreference = (next: ThemePreference): void => {
    setPreferenceState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() =>
    preference === 'system' ? resolveSystemTheme() : preference
  )

  useEffect(() => {
    if (preference !== 'system') {
      setEffectiveTheme(preference)
      return undefined
    }

    setEffectiveTheme(resolveSystemTheme())
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (): void => setEffectiveTheme(resolveSystemTheme())
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [preference])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme)
  }, [effectiveTheme])

  return { preference, effectiveTheme, setPreference }
}
