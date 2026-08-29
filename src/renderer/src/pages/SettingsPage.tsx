import { useEffect, useState } from 'react'
import type { AppSettings, UpdateStatus } from '@shared/types'
import type { ThemeControl, ThemePreference } from '../hooks/useTheme'
import type { AccountSelection } from '../hooks/useAccountSelection'
import type { AppUpdater } from '../hooks/useAppUpdater'

interface Props {
  theme: ThemeControl
  accountSelection: AccountSelection
  updater: AppUpdater
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
  required: boolean
  description: string
}[] = [
  {
    name: 'Skill Lines',
    url: 'https://www.esoui.com/downloads/info4041-SkillLines.html',
    required: true,
    description:
      'Tags each character with the megaserver it lives on (NA / EU). The app relies on this to tell your characters apart and to make the Account and Server switchers work.'
  },
  {
    name: "Urich's Skill Point Finder (USPF)",
    url: 'https://www.esoui.com/downloads/info1863-UrichsSkillPointFinder.html',
    required: true,
    description:
      'Records which dungeon quests each character has finished. Powers the daily Undaunted Pledge recommendations and the Dungeon Check List. Without it those pages have no data. THis is the core feature of WhatShouldIDo.'
  },
  {
    name: 'Daily Craft Status',
    url: 'https://www.esoui.com/downloads/info2510-DailyCraftStatus.html',
    required: false,
    description:
      'Tracks each character’s riding-training cooldown and Capacity / Stamina / Speed levels. Powers the Riding Training board on the Home page.'
  }
]

const THEME_OPTIONS: { value: ThemePreference; label: string; description: string; swatch: [string, string] }[] = [
  { value: 'system', label: 'System', description: 'Follows your OS light/dark setting', swatch: ['#16181d', '#f5f6f8'] },
  { value: 'dark', label: 'Dark', description: 'The default - orange & teal', swatch: ['#16181d', '#1e2129'] },
  { value: 'light', label: 'Light', description: 'Same accents, light background', swatch: ['#f5f6f8', '#ffffff'] },
  { value: 'ember', label: 'Ember', description: 'Warm, high-contrast dark', swatch: ['#1a1210', '#241a16'] },
  { value: 'frost', label: 'Frost', description: 'Cool blue dark theme', swatch: ['#0f1620', '#16202c'] }
]

function SettingsPage({ theme, accountSelection, updater }: Props): React.JSX.Element {
  const [settings, setSettings] = useState<AppSettings | null>(null)

  useEffect(() => {
    let cancelled = false
    window.api.getAppSettings().then((s) => {
      if (!cancelled) setSettings(s)
    })
    return () => {
      cancelled = true
    }
  }, [])

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

      <section className="board-section">
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

      <section className="board-section">
        <div className="pledges-panel__title-row">
          <h3 className="settings-section-title">Addons</h3>
        </div>

        <p className="muted">
          This app reads data that ESO addons write to disk. Install them from{' '}
          <a href="https://www.esoui.com/" target="_blank" rel="noreferrer">
            ESOUI
          </a>{' '}
          (or Minion), enable them in-game, then log into each character once with them active so they have data to
          write.
        </p>

        <ul className="addon-list">
          {ADDONS.map((addon) => (
            <li key={addon.url} className="addon-row">
              <div className="addon-row__head">
                <a className="addon-row__name" href={addon.url} target="_blank" rel="noreferrer">
                  {addon.name}
                </a>
                <span className={`addon-badge ${addon.required ? 'addon-badge--required' : 'addon-badge--optional'}`}>
                  {addon.required ? 'Required' : 'Optional'}
                </span>
              </div>
              <p className="addon-row__desc">{addon.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="board-section">
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

      <section className="board-section">
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
          {updateStatusLabel(updater.status) && <span className="muted">{updateStatusLabel(updater.status)}</span>}
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
  )
}

export default SettingsPage
