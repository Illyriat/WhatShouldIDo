import { useEffect, useState } from 'react'
import type { AddonStatus, AppSettings, UpdateStatus } from '@shared/types'
import { FEATURE_FLAGS, type FeatureFlag } from '@shared/featureFlags'
import type { ThemeControl, ThemePreference } from '../hooks/useTheme'
import type { AccountSelection } from '../hooks/useAccountSelection'
import type { AppUpdater } from '../hooks/useAppUpdater'
import { USER_TOGGLEABLE_FEATURES, type FeaturePreferences } from '../hooks/useFeaturePreferences'

interface Props {
  theme: ThemeControl
  accountSelection: AccountSelection
  updater: AppUpdater
  features: FeaturePreferences
}

function updateStatusLabel(status: UpdateStatus): string | null {
  switch (status.state) {
    case 'idle':
      return null
    case 'checking':
      return 'Checking for updates…'
    case 'available':
      return `Update v${status.version} found - downloading…`
    case 'not-available':
      return "You're up to date."
    case 'downloading':
      return `Downloading update… ${status.percent}%`
    case 'downloaded':
      return `Version ${status.version} downloaded - restart to install.`
    case 'error':
      return status.message
  }
}

const ADDONS: {
  name: string
  url: string
  // SavedVariables file this addon writes. Used to detect whether it's installed.
  file: string
  required: boolean
  description: string
  // Feature flags that consume this addon's data. When every one of these is toggled
  // off (see src/shared/featureFlags.ts), the addon is pointless and its row is hidden.
  relevantFlags: FeatureFlag[]
}[] = [
  {
    name: 'Skill Lines',
    url: 'https://www.esoui.com/downloads/info4041-SkillLines.html',
    file: 'SkillLines.lua',
    required: true,
    description:
      'Tags each character with the megaserver it lives on (NA / EU). The app relies on this to tell your characters apart and to make the Account and Server switchers work.',
    relevantFlags: ['pledges', 'ridingTraining', 'dungeonChecklist', 'allianceRank', 'musicBoxes']
  },
  {
    name: "Urich's Skill Point Finder (USPF)",
    url: 'https://www.esoui.com/downloads/info1863-UrichsSkillPointFinder.html',
    file: 'USPF.lua',
    required: true,
    description:
      'Records which dungeon quests each character has finished. Powers the daily Undaunted Pledge recommendations and the Dungeon Check List. Without it those pages have no data. THis is the core feature of WhatShouldIDo.',
    relevantFlags: ['pledges', 'dungeonChecklist']
  },
  {
    name: 'Daily Craft Status',
    url: 'https://www.esoui.com/downloads/info2510-DailyCraftStatus.html',
    file: 'DailyCraftStatus.lua',
    required: false,
    description:
      'Tracks each character’s riding-training cooldown and Capacity / Stamina / Speed levels. Powers the Riding Training board on the Home page.',
    relevantFlags: ['ridingTraining']
  },
  {
    name: 'What Should I Do - Data Collector',
    url: 'https://github.com/Illyriat/WhatShouldIDoDataCollector',
    file: 'WhatShouldIDoDataCollector.lua',
    required: false,
    description:
      'A purpose-built companion addon that records each character’s Alliance War rank and Alliance Points progress. Powers the Alliance Rank page.',
    relevantFlags: ['allianceRank']
  }
]

const THEME_OPTIONS: { value: ThemePreference; label: string; description: string; swatch: [string, string] }[] = [
  { value: 'system', label: 'System', description: 'Follows your OS light/dark setting', swatch: ['#16181d', '#f5f6f8'] },
  { value: 'dark', label: 'Dark', description: 'The default - orange & teal', swatch: ['#16181d', '#1e2129'] },
  { value: 'light', label: 'Light', description: 'Same accents, light background', swatch: ['#f5f6f8', '#ffffff'] },
  { value: 'ember', label: 'Ember', description: 'Warm, high-contrast dark', swatch: ['#1a1210', '#241a16'] },
  { value: 'frost', label: 'Frost', description: 'Cool blue dark theme', swatch: ['#0f1620', '#16202c'] }
]

function SettingsPage({ theme, accountSelection, updater, features }: Props): React.JSX.Element {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [addonStatus, setAddonStatus] = useState<AddonStatus | null>(null)
  // Which of the collapsible box-list sections (Features, Addons) are collapsed. Empty
  // by default so nothing is hidden the first time someone opens Settings.
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  function toggleSection(id: string): void {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Jump-to-section nav: scrolls to the section and expands it if it was collapsed.
  function jumpToSection(id: string): void {
    setCollapsedSections((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    document.getElementById(`settings-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Addons whose data nothing currently visible uses (developer flag off, or the user
  // declutter-toggled every consuming feature off) don't need a row here either.
  const visibleAddons = ADDONS.filter((addon) => addon.relevantFlags.some((flag) => features.isEnabled(flag)))

  // Only offer a toggle for features the developer actually shipped (FEATURE_FLAGS
  // true), and only show a sub-toggle (like upcomingPledges) while its parent is on.
  const visibleToggleableFeatures = USER_TOGGLEABLE_FEATURES.filter(
    (item) => FEATURE_FLAGS[item.flag] && (!item.dependsOn || features.isEnabled(item.dependsOn))
  )

  const tocSections = [
    { id: 'data-folder', label: 'ESO Data Folder', visible: true },
    { id: 'features', label: 'Features', visible: visibleToggleableFeatures.length > 0 },
    { id: 'addons', label: 'Addons', visible: visibleAddons.length > 0 },
    { id: 'theme', label: 'Theme', visible: true },
    { id: 'about', label: 'About', visible: true }
  ].filter((s) => s.visible)

  useEffect(() => {
    let cancelled = false
    window.api.getAppSettings().then((s) => {
      if (!cancelled) setSettings(s)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Re-check whenever the data folder changes.
  useEffect(() => {
    let cancelled = false
    window.api.getAddonStatus().then((s) => {
      if (!cancelled) setAddonStatus(s)
    })
    return () => {
      cancelled = true
    }
  }, [accountSelection.refreshToken])

  async function handleBrowse(): Promise<void> {
    const picked = await window.api.pickDocumentsFolder()
    if (!picked) return
    const updated = await window.api.setDocumentsPathOverride(picked)
    setSettings(updated)
    accountSelection.refresh()
  }

  async function handleReset(): Promise<void> {
    const updated = await window.api.setDocumentsPathOverride(null)
    setSettings(updated)
    accountSelection.refresh()
  }

  const effectivePath = settings?.documentsPathOverride ?? settings?.defaultDocumentsPath ?? '...'

  let foundStatus: string | null = null
  if (accountSelection.state.status === 'ready') {
    const accountCount = accountSelection.state.accounts.length
    const charCount = accountSelection.state.accounts.reduce((sum, a) => sum + a.characters.length, 0)
    foundStatus =
      accountCount === 0
        ? 'No accounts found in this folder - double check it contains an "Elder Scrolls Online" folder with your addon data.'
        : `Found ${accountCount} account${accountCount === 1 ? '' : 's'}, ${charCount} character${charCount === 1 ? '' : 's'}.`
  } else if (accountSelection.state.status === 'error') {
    foundStatus = `Couldn't read this folder: ${accountSelection.state.message}`
  }

  return (
    <div className="page">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-layout">
        <nav className="settings-toc" aria-label="Jump to settings section">
          {tocSections.map((s) => (
            <button key={s.id} type="button" className="settings-toc__item" onClick={() => jumpToSection(s.id)}>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="settings-sections">
          <section id="settings-data-folder" className="board-section">
            <div className="pledges-panel__title-row">
              <h3 className="settings-section-title">ESO Data Folder</h3>
            </div>

            <p className="muted">
              This app reads your ESO SavedVariables from your Documents folder. If Windows/OneDrive has redirected
              Documents elsewhere, point it at the right one here.
            </p>

            <div className="settings-folder-row">
              <code className="settings-folder-path">{effectivePath}</code>
              <button className="refresh-button" onClick={handleBrowse}>
                Browse…
              </button>
              {settings?.documentsPathOverride && (
                <button className="refresh-button" onClick={handleReset}>
                  Reset to default
                </button>
              )}
            </div>

            {foundStatus && <p className="muted settings-found-status">{foundStatus}</p>}
          </section>

          {visibleToggleableFeatures.length > 0 && (
            <section id="settings-features" className="board-section">
              <div className="pledges-panel__title-row">
                <button
                  type="button"
                  className="settings-section-toggle"
                  onClick={() => toggleSection('features')}
                  aria-expanded={!collapsedSections.has('features')}
                >
                  <span className={`settings-section-caret${collapsedSections.has('features') ? '' : ' is-open'}`}>
                    ▸
                  </span>
                  <h3 className="settings-section-title">Features</h3>
                </button>
              </div>

              {!collapsedSections.has('features') && (
                <>
                  <p className="muted">
                    Turn off anything you don't use to declutter the sidebar. This only hides the page - your data
                    isn't touched, and you can turn it back on anytime.
                  </p>

                  <ul className="feature-toggle-list">
                    {visibleToggleableFeatures.map((item) => (
                      <li key={item.flag} className="feature-toggle-row">
                        <label className="feature-toggle-row__label">
                          <input
                            type="checkbox"
                            checked={features.isEnabled(item.flag)}
                            onChange={(e) => features.setUserEnabled(item.flag, e.target.checked)}
                          />
                          <span className="feature-toggle-row__name">{item.label}</span>
                        </label>
                        <p className="feature-toggle-row__desc">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          {visibleAddons.length > 0 && (
            <section id="settings-addons" className="board-section">
              <div className="pledges-panel__title-row">
                <button
                  type="button"
                  className="settings-section-toggle"
                  onClick={() => toggleSection('addons')}
                  aria-expanded={!collapsedSections.has('addons')}
                >
                  <span className={`settings-section-caret${collapsedSections.has('addons') ? '' : ' is-open'}`}>
                    ▸
                  </span>
                  <h3 className="settings-section-title">Addons</h3>
                </button>
              </div>

              {!collapsedSections.has('addons') && (
                <>
                  <p className="muted">
                    This app reads data that ESO addons write to disk. Install them from{' '}
                    <a href="https://www.esoui.com/" target="_blank" rel="noreferrer">
                      ESOUI
                    </a>{' '}
                    (or Minion), enable them in-game, then log into each character once with them active so they
                    have data to write.
                  </p>

                  <ul className="addon-list">
                    {visibleAddons.map((addon) => {
                      const detected = addonStatus?.[addon.file] ?? false
                      const badgeState = addonStatus == null
                        ? 'addon-badge--pending'
                        : detected
                          ? 'addon-badge--detected'
                          : addon.required
                            ? 'addon-badge--missing'
                            : 'addon-badge--optional'
                      return (
                        <li key={addon.url} className="addon-row">
                          <div className="addon-row__head">
                            <a className="addon-row__name" href={addon.url} target="_blank" rel="noreferrer">
                              {addon.name}
                            </a>
                            <span
                              className={`addon-badge ${badgeState}`}
                              title={
                                addonStatus == null
                                  ? 'Checking…'
                                  : detected
                                    ? `Detected (${addon.file} found)`
                                    : `Not detected (no ${addon.file} on disk)`
                              }
                            >
                              {addon.required ? 'Required' : 'Optional'}
                            </span>
                            {addonStatus != null && (
                              <span className="addon-row__detect muted">
                                {detected ? '✓ detected' : 'not detected'}
                              </span>
                            )}
                          </div>
                          <p className="addon-row__desc">{addon.description}</p>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </section>
          )}

          <section id="settings-theme" className="board-section">
            <div className="pledges-panel__title-row">
              <h3 className="settings-section-title">Theme</h3>
            </div>

            <div className="theme-options">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`theme-option ${theme.preference === option.value ? 'theme-option--active' : ''}`}
                  onClick={() => theme.setPreference(option.value)}
                >
                  <span className="theme-option__swatch">
                    <span style={{ background: option.swatch[0] }} />
                    <span style={{ background: option.swatch[1] }} />
                  </span>
                  <span className="theme-option__label">{option.label}</span>
                  <span className="theme-option__description">{option.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section id="settings-about" className="board-section">
            <div className="pledges-panel__title-row">
              <h3 className="settings-section-title">About</h3>
            </div>

            <dl className="about-list">
              <div className="about-row">
                <dt>Version</dt>
                <dd>{__APP_VERSION__}</dd>
              </div>
              <div className="about-row">
                <dt>Build</dt>
                <dd>{__BUILD_NUMBER__}</dd>
              </div>
            </dl>

            <div className="settings-folder-row">
              <button className="refresh-button" onClick={updater.checkForUpdates}>
                Check for Updates
              </button>
              {updater.status.state === 'downloaded' && (
                <button className="refresh-button" onClick={updater.quitAndInstallUpdate}>
                  Restart &amp; Install
                </button>
              )}
              {updateStatusLabel(updater.status) && (
                <span className="muted">{updateStatusLabel(updater.status)}</span>
              )}
            </div>

            <p className="muted">
              Made by Illyriat. If this app is useful to you, you can{' '}
              <a className="about-donate" href="https://james-robson.dev/" target="_blank" rel="noreferrer">
                support the project
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
