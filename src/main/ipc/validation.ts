import { isAbsolute } from 'path'
import { FEATURE_FLAGS, type FeatureFlag } from '@shared/featureFlags'

// IPC arguments come from the renderer, so they're checked here before anything is
// persisted. Only this app's own code runs in the renderer, so this is defence in depth:
// a bad value is rejected (the invoke promise rejects) rather than written to settings.json.

export function validateDocumentsPathOverride(value: unknown): string | null {
  if (value === null) return null
  if (typeof value !== 'string' || value.length === 0 || !isAbsolute(value)) {
    throw new TypeError('Documents folder must be an absolute path or null.')
  }
  return value
}

export function validateDisabledFeatures(value: unknown): FeatureFlag[] {
  if (!Array.isArray(value)) throw new TypeError('Disabled features must be an array.')
  // Unknown names are dropped rather than rejected, so a flag removed in a later build
  // doesn't break saving the rest.
  return value.filter(
    (flag): flag is FeatureFlag => typeof flag === 'string' && Object.hasOwn(FEATURE_FLAGS, flag)
  )
}

export function validateLanguage(value: unknown): string {
  if (typeof value !== 'string' || !FEATURE_FLAGS.languageSupport.some((entry) => entry.code === value)) {
    throw new TypeError('Unsupported language.')
  }
  return value
}
