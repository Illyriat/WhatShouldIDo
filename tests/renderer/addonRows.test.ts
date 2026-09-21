import { describe, it, expect } from 'vitest'
import type { TFunction } from 'i18next'
import type { AddonInstallStatus, DataCollectorState, LibraryState } from '../../src/shared/types'
import { ADDONS, describeAddonRow } from '../../src/renderer/src/pages/SettingsPage'

// Returns the key itself (plus params), so a test can assert WHICH message a state picks
// without depending on the English wording.
const t = ((key: string, params?: Record<string, unknown>) =>
  params ? `${key} ${JSON.stringify(params)}` : key) as unknown as TFunction

function status(
  collector: DataCollectorState,
  library: LibraryState = 'installed',
  versions: { installed?: string | null; bundled?: string | null; library?: string | null } = {}
): AddonInstallStatus {
  return {
    dataCollector: {
      state: collector,
      installedVersion: versions.installed ?? null,
      bundledVersion: versions.bundled ?? '1.5.0'
    },
    library: { state: library, version: versions.library ?? null }
  }
}

describe('ADDONS', () => {
  it('lists the Data Collector as bundled (no link) and the library as an ESOUI link', () => {
    const collector = ADDONS.find((a) => a.id === 'dataCollector')
    const library = ADDONS.find((a) => a.id === 'libUndauntedPledges')
    expect(collector?.url).toBeNull()
    expect(library?.url).toContain('esoui.com')
  })

  it('shows the library to exactly the features that need the Data Collector', () => {
    const collector = ADDONS.find((a) => a.id === 'dataCollector')
    const library = ADDONS.find((a) => a.id === 'libUndauntedPledges')
    expect(library?.relevantFlags).toEqual(collector?.relevantFlags)
  })
})

describe('describeAddonRow - Data Collector', () => {
  it('is pending until the status arrives', () => {
    expect(describeAddonRow(t, 'dataCollector', null, false).badge).toBe('pending')
  })

  it('offers Install when it is not installed', () => {
    const view = describeAddonRow(t, 'dataCollector', status('not-installed'), false)
    expect(view).toMatchObject({ badge: 'missing', action: 'install' })
  })

  it('offers Update, showing both versions, when an older one is installed', () => {
    const view = describeAddonRow(t, 'dataCollector', status('update-available', 'installed', { installed: '1.4.1' }), true)
    expect(view.badge).toBe('update')
    expect(view.action).toBe('update')
    expect(view.label).toContain('"installed":"1.4.1"')
    expect(view.label).toContain('"bundled":"1.5.0"')
  })

  it('offers nothing once up to date, and reminds you to log in if it has not recorded data yet', () => {
    const upToDate = status('up-to-date', 'installed', { installed: '1.5.0' })

    const ran = describeAddonRow(t, 'dataCollector', upToDate, true)
    expect(ran).toMatchObject({ badge: 'ok', action: null, note: null })

    const notRun = describeAddonRow(t, 'dataCollector', upToDate, false)
    expect(notRun).toMatchObject({ badge: 'ok', action: null })
    expect(notRun.note).toBe('settings.addonNoDataNote')
  })

  it('offers no button when there is no game folder or the build lacks the addon', () => {
    expect(describeAddonRow(t, 'dataCollector', status('no-game-folder'), false)).toMatchObject({
      badge: 'missing',
      action: null,
      note: 'settings.addonNoGameFolder'
    })
    expect(describeAddonRow(t, 'dataCollector', status('bundle-missing'), false)).toMatchObject({
      badge: 'missing',
      action: null,
      note: 'settings.addonBundleMissing'
    })
  })
})

describe('describeAddonRow - LibUndauntedPledges', () => {
  it('never offers a button - the app does not install it', () => {
    for (const library of ['no-game-folder', 'missing', 'outdated', 'installed'] as const) {
      expect(describeAddonRow(t, 'libUndauntedPledges', status('up-to-date', library), true).action).toBeNull()
    }
  })

  it('tells the user to get it from ESOUI when missing', () => {
    expect(describeAddonRow(t, 'libUndauntedPledges', status('up-to-date', 'missing'), true)).toMatchObject({
      badge: 'missing',
      note: 'settings.libMissingNote'
    })
  })

  it('flags an outdated one as missing-grade, with its version', () => {
    const view = describeAddonRow(t, 'libUndauntedPledges', status('up-to-date', 'outdated', { library: '1.0.0' }), true)
    expect(view.badge).toBe('missing')
    expect(view.note).toBe('settings.libOutdatedNote')
    expect(view.label).toContain('"version":"1.0.0"')
  })

  it('is ok once a recent enough one is installed', () => {
    const view = describeAddonRow(t, 'libUndauntedPledges', status('up-to-date', 'installed', { library: '1.2.2' }), true)
    expect(view).toMatchObject({ badge: 'ok', note: null })
  })
})
