import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { AddonInstallStatus, AddonStatus, AppSettings, UpdateStatus } from '@shared/types'
import { FEATURE_FLAGS, isFeatureFlagOn, type FeatureFlag } from '@shared/featureFlags'
import { SUPPORTED_LANGUAGES } from '@shared/i18n'
import { SUPPORT_URL } from '@shared/links'
import type { ThemeControl, ThemePreference } from '../hooks/useTheme'
import type { AccountSelection } from '../hooks/useAccountSelection'
import type { AppUpdater } from '../hooks/useAppUpdater'
import type { LanguageControl } from '../hooks/useLanguage'
import { USER_TOGGLEABLE_FEATURES, type FeaturePreferences } from '../hooks/useFeaturePreferences'
import { tKey } from '../i18nDynamicKey'

interface Props {
  theme: ThemeControl
  accountSelection: AccountSelection
  updater: AppUpdater
  features: FeaturePreferences
  language: LanguageControl
}

function updateStatusLabel(t: TFunction, status: UpdateStatus): string | null {
  switch (status.state) {
    case 'idle':
      return null
    case 'checking':
      return t('settings.updateChecking')
    case 'available':
      return t('settings.updateAvailable', { version: status.version })
    case 'not-available':
      return t('settings.updateNotAvailable')
    case 'downloading':
      return t('settings.updateDownloading', { percent: status.percent })
    case 'downloaded':
      return t('settings.updateDownloaded', { version: status.version })
    case 'error':
      return status.message
  }
}

// Exported (along with THEME_OPTIONS below) so tests can verify every nameKey/labelKey/
// descriptionKey resolves against en.ts - tKey() bypasses t()'s compile-time key checking
// for exactly this kind of data-driven key, so nothing else catches a typo'd or renamed key.
// The Data Collector is a hard dependency on LibUndauntedPledges (ESO won't load it
// without it), so both rows matter to exactly the same features.
const DATA_COLLECTOR_FLAGS: FeatureFlag[] = [
  'pledges',
  'dungeonChecklist',
  'ridingTraining',
  'allianceRank',
  'welcomeBanner',
  'wealthTracker',
  'musicBoxes'
]

export const ADDONS: {
  id: 'dataCollector' | 'libUndauntedPledges'
  nameKey: string
  // Where to get an addon the user has to install themselves. Null for the Data Collector,
  // which ships inside this app and is installed from this page.
  url: string | null
  // SavedVariables file this addon writes; its presence means the addon has run at least
  // once. Null for an addon that writes none (a library).
  file: string | null
  required: boolean
  descriptionKey: string
  // Feature flags that consume this addon's data. When every one of these is toggled
  // off (see src/shared/featureFlags.ts), the addon is pointless and its row is hidden.
  relevantFlags: FeatureFlag[]
}[] = [
  {
    id: 'dataCollector',
    nameKey: 'settings.addonsList.dataCollector.name',
    url: null,
    file: 'WhatShouldIDoDataCollector.lua',
    required: true,
    descriptionKey: 'settings.addonsList.dataCollector.description',
    relevantFlags: DATA_COLLECTOR_FLAGS
  },
  {
    id: 'libUndauntedPledges',
    nameKey: 'settings.addonsList.libUndauntedPledges.name',
    url: 'https://www.esoui.com/downloads/info3946-LibUndauntedPledges.html',
    file: null,
    required: true,
    descriptionKey: 'settings.addonsList.libUndauntedPledges.description',
    relevantFlags: DATA_COLLECTOR_FLAGS
  }
]

// What one addon row shows, derived from the install status main reports.
interface AddonRowView {
  // pending = still checking, ok = good to go, update = works but a newer one is on offer,
  // missing = the app can't work without it.
  badge: 'pending' | 'ok' | 'update' | 'missing'
  label: string | null
  note: string | null
  // The button this row offers, if any.
  action: 'install' | 'update' | null
}

const PENDING_ROW: AddonRowView = { badge: 'pending', label: null, note: null, action: null }

// Exported alongside ADDONS so the state -> row mapping can be tested without rendering.
export function describeAddonRow(
  t: TFunction,
  id: (typeof ADDONS)[number]['id'],
  status: AddonInstallStatus | null,
  hasRun: boolean
): AddonRowView {
  if (!status) return PENDING_ROW

  if (id === 'dataCollector') {
    const { state, installedVersion, bundledVersion } = status.dataCollector
    switch (state) {
      case 'no-game-folder':
        return { badge: 'missing', label: t('settings.notInstalledShort'), note: t('settings.addonNoGameFolder'), action: null }
      case 'bundle-missing':
        return { badge: 'missing', label: null, note: t('settings.addonBundleMissing'), action: null }
      case 'not-installed':
        return { badge: 'missing', label: t('settings.notInstalledShort'), note: null, action: 'install' }
      case 'update-available':
        return {
          badge: 'update',
          label: t('settings.updateAvailableShort', { installed: installedVersion ?? '', bundled: bundledVersion ?? '' }),
          note: null,
          action: 'update'
        }
      case 'up-to-date':
        return {
          badge: 'ok',
          label: t('settings.installedShort', { version: installedVersion ?? '' }),
          note: hasRun ? null : t('settings.addonNoDataNote'),
          action: null
        }
    }
  }

  const { state, version } = status.library
  switch (state) {
    case 'no-game-folder':
      return { badge: 'missing', label: t('settings.notInstalledShort'), note: t('settings.addonNoGameFolder'), action: null }
    case 'missing':
      return { badge: 'missing', label: t('settings.notInstalledShort'), note: t('settings.libMissingNote'), action: null }
    case 'outdated':
      return {
        badge: 'missing',
        label: t('settings.outdatedShort', { version: version ?? '' }),
        note: t('settings.libOutdatedNote'),
        action: null
      }
    case 'installed':
      return { badge: 'ok', label: t('settings.installedShort', { version: version ?? '' }), note: null, action: null }
  }
}

export const THEME_OPTIONS: { value: ThemePreference; labelKey: string; descriptionKey: string; swatch: [string, string] }[] = [
  { value: 'system', labelKey: 'settings.themeSystemLabel', descriptionKey: 'settings.themeSystemDesc', swatch: ['#16181d', '#f5f6f8'] },
  { value: 'dark', labelKey: 'settings.themeDarkLabel', descriptionKey: 'settings.themeDarkDesc', swatch: ['#16181d', '#1e2129'] },
  { value: 'light', labelKey: 'settings.themeLightLabel', descriptionKey: 'settings.themeLightDesc', swatch: ['#f5f6f8', '#ffffff'] },
  { value: 'ember', labelKey: 'settings.themeEmberLabel', descriptionKey: 'settings.themeEmberDesc', swatch: ['#1a1210', '#241a16'] },
  { value: 'frost', labelKey: 'settings.themeFrostLabel', descriptionKey: 'settings.themeFrostDesc', swatch: ['#0f1620', '#16202c'] }
]

function SettingsPage({ theme, accountSelection, updater, features, language }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [addonStatus, setAddonStatus] = useState<AddonStatus | null>(null)
  const [installStatus, setInstallStatus] = useState<AddonInstallStatus | null>(null)
  const [installing, setInstalling] = useState(false)
  const [installError, setInstallError] = useState<string | null>(null)
  // Set once the user has installed/updated from this page, to tell them the game needs
  // a restart (or /reloadui) before it loads the addon.
  const [justInstalled, setJustInstalled] = useState(false)
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
    (item) => isFeatureFlagOn(FEATURE_FLAGS[item.flag]) && (!item.dependsOn || features.isEnabled(item.dependsOn))
  )

  const tocSections = [
    { id: 'data-folder', labelKey: 'settings.dataFolderNav', visible: true },
    { id: 'features', labelKey: 'settings.featuresNav', visible: visibleToggleableFeatures.length > 0 },
    { id: 'addons', labelKey: 'settings.addonsNav', visible: visibleAddons.length > 0 },
    { id: 'language', labelKey: 'settings.languageNav', visible: features.isEnabled('languageSupport') },
    { id: 'theme', labelKey: 'settings.themeNav', visible: true },
    { id: 'about', labelKey: 'settings.aboutNav', visible: true }
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
    window.api.getAddonInstallStatus().then((s) => {
      if (!cancelled) setInstallStatus(s)
    })
    return () => {
      cancelled = true
    }
  }, [accountSelection.refreshToken])

  async function handleInstallAddon(): Promise<void> {
    setInstalling(true)
    setInstallError(null)
    try {
      setInstallStatus(await window.api.installDataCollectorAddon())
      setJustInstalled(true)
    } catch (error) {
      // Electron prefixes a rejected invoke() with "Error invoking remote method '...': Error: ".
      const message = error instanceof Error ? error.message : String(error)
      setInstallError(message.replace(/^Error invoking remote method '[^']+': (Error: )?/, ''))
    } finally {
      setInstalling(false)
    }
  }

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
        ? t('settings.noAccountsFound')
        : `${t('settings.foundAccounts', { count: accountCount })} ${t('settings.foundCharacters', { count: charCount })}`
  } else if (accountSelection.state.status === 'error') {
    foundStatus = t('settings.couldntReadFolder', { message: accountSelection.state.message })
  }

  return (
    <div className="page">
      <h2 className="settings-title">{t('settings.pageTitle')}</h2>

      <div className="settings-layout">
        <nav className="settings-toc" aria-label={t('settings.jumpToSection')}>
          {tocSections.map((s) => (
            <button key={s.id} type="button" className="settings-toc__item" onClick={() => jumpToSection(s.id)}>
              {tKey(t, s.labelKey)}
            </button>
          ))}
        </nav>

        <div className="settings-sections">
          <div className="page__header">
            <button className="refresh-button" onClick={accountSelection.refresh} title={t('common.refreshTitle')}>
              ⟳ {t('common.refresh')}
            </button>
          </div>

          <section id="settings-data-folder" className="board-section">
            <div className="pledges-panel__title-row">
              <h3 className="settings-section-title">{t('settings.dataFolderTitle')}</h3>
            </div>

            <p className="muted">{t('settings.dataFolderBody')}</p>

            <div className="settings-folder-row">
              <code className="settings-folder-path">{effectivePath}</code>
              <button className="refresh-button" onClick={handleBrowse}>
                {t('settings.browse')}
              </button>
              {settings?.documentsPathOverride && (
                <button className="refresh-button" onClick={handleReset}>
                  {t('settings.resetToDefault')}
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
                  <h3 className="settings-section-title">{t('settings.featuresTitle')}</h3>
                </button>
              </div>

              {!collapsedSections.has('features') && (
                <>
                  <p className="muted">{t('settings.featuresBody')}</p>

                  <ul className="feature-toggle-list">
                    {visibleToggleableFeatures.map((item) => (
                      <li key={item.flag} className="feature-toggle-row">
                        <label className="feature-toggle-row__label">
                          <input
                            type="checkbox"
                            checked={features.isEnabled(item.flag)}
                            onChange={(e) => features.setUserEnabled(item.flag, e.target.checked)}
                          />
                          <span className="feature-toggle-row__name">{tKey(t, item.labelKey)}</span>
                        </label>
                        <p className="feature-toggle-row__desc">{tKey(t, item.descriptionKey)}</p>
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
                  <h3 className="settings-section-title">{t('settings.addonsTitle')}</h3>
                </button>
              </div>

              {!collapsedSections.has('addons') && (
                <>
                  <p className="muted">
                    <Trans
                      i18nKey="settings.addonsBody"
                      components={{ esoui: <a href="https://www.esoui.com/" target="_blank" rel="noreferrer" /> }}
                    />
                  </p>

                  <ul className="addon-list">
                    {visibleAddons.map((addon) => {
                      const hasRun = addon.file == null || (addonStatus?.[addon.file] ?? false)
                      const view = describeAddonRow(t, addon.id, installStatus, hasRun)
                      const isCollector = addon.id === 'dataCollector'
                      return (
                        <li key={addon.id} className="addon-row">
                          <div className="addon-row__head">
                            {addon.url ? (
                              <a className="addon-row__name" href={addon.url} target="_blank" rel="noreferrer">
                                {tKey(t, addon.nameKey)}
                              </a>
                            ) : (
                              <span className="addon-row__name addon-row__name--static">{tKey(t, addon.nameKey)}</span>
                            )}
                            <span
                              className={`addon-badge addon-badge--${view.badge}`}
                              title={view.badge === 'pending' ? t('settings.checking') : undefined}
                            >
                              {addon.required ? t('settings.required') : t('settings.optional')}
                            </span>
                            {view.label && <span className="addon-row__detect muted">{view.label}</span>}
                            {view.action && (
                              <button
                                className="refresh-button addon-row__action"
                                onClick={handleInstallAddon}
                                disabled={installing}
                              >
                                {installing
                                  ? t('settings.addonInstalling')
                                  : view.action === 'install'
                                    ? t('settings.addonInstall')
                                    : t('settings.addonUpdate')}
                              </button>
                            )}
                          </div>
                          <p className="addon-row__desc">{tKey(t, addon.descriptionKey)}</p>
                          {view.note && <p className="addon-row__note">{view.note}</p>}
                          {isCollector && justInstalled && <p className="addon-row__note">{t('settings.addonRestartNote')}</p>}
                          {isCollector && installError && (
                            <p className="addon-row__note addon-row__note--error">
                              {t('settings.addonInstallFailed', { message: installError })}
                            </p>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </section>
          )}

          {features.isEnabled('languageSupport') && (
            <section id="settings-language" className="board-section">
              <div className="pledges-panel__title-row">
                <h3 className="settings-section-title">{t('settings.languageTitle')}</h3>
              </div>

              <p className="muted">{t('settings.languageBody')}</p>

              <div className="theme-options">
                {SUPPORTED_LANGUAGES.map((option) => (
                  <button
                    key={option.code}
                    className={`theme-option ${language.language === option.code ? 'theme-option--active' : ''}`}
                    onClick={() => language.setLanguage(option.code)}
                  >
                    <span className="theme-option__label">{option.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section id="settings-theme" className="board-section">
            <div className="pledges-panel__title-row">
              <h3 className="settings-section-title">{t('settings.themeTitle')}</h3>
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
                  <span className="theme-option__label">{tKey(t, option.labelKey)}</span>
                  <span className="theme-option__description">{tKey(t, option.descriptionKey)}</span>
                </button>
              ))}
            </div>
          </section>

          <section id="settings-about" className="board-section">
            <div className="pledges-panel__title-row">
              <h3 className="settings-section-title">{t('settings.aboutTitle')}</h3>
            </div>

            <dl className="about-list">
              <div className="about-row">
                <dt>{t('settings.version')}</dt>
                <dd>{__APP_VERSION__}</dd>
              </div>
              <div className="about-row">
                <dt>{t('settings.build')}</dt>
                <dd>{__BUILD_NUMBER__}</dd>
              </div>
            </dl>

            <div className="settings-folder-row">
              <button className="refresh-button" onClick={updater.checkForUpdates}>
                {t('settings.checkForUpdates')}
              </button>
              {updater.status.state === 'downloaded' && (
                <button className="refresh-button" onClick={updater.quitAndInstallUpdate}>
                  {t('settings.restartAndInstall')}
                </button>
              )}
              {updateStatusLabel(t, updater.status) && (
                <span className="muted">{updateStatusLabel(t, updater.status)}</span>
              )}
            </div>

            <p className="muted">
              <Trans
                i18nKey="settings.madeBy"
                components={{ support: <a className="about-donate" href={SUPPORT_URL} target="_blank" rel="noreferrer" /> }}
              />
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
