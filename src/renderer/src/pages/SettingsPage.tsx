import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { AddonStatus, AppSettings, UpdateStatus } from '@shared/types'
import { FEATURE_FLAGS, isFeatureFlagOn, type FeatureFlag } from '@shared/featureFlags'
import { SUPPORTED_LANGUAGES } from '@shared/i18n'
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

const ADDONS: {
  nameKey: string
  url: string
  // SavedVariables file this addon writes. Used to detect whether it's installed.
  file: string
  required: boolean
  descriptionKey: string
  // Feature flags that consume this addon's data. When every one of these is toggled
  // off (see src/shared/featureFlags.ts), the addon is pointless and its row is hidden.
  relevantFlags: FeatureFlag[]
}[] = [
  {
    nameKey: 'settings.addonsList.skillLines.name',
    url: 'https://www.esoui.com/downloads/info4041-SkillLines.html',
    file: 'SkillLines.lua',
    required: true,
    descriptionKey: 'settings.addonsList.skillLines.description',
    relevantFlags: ['pledges', 'ridingTraining', 'dungeonChecklist', 'allianceRank', 'musicBoxes']
  },
  {
    nameKey: 'settings.addonsList.uspf.name',
    url: 'https://www.esoui.com/downloads/info1863-UrichsSkillPointFinder.html',
    file: 'USPF.lua',
    required: true,
    descriptionKey: 'settings.addonsList.uspf.description',
    relevantFlags: ['pledges', 'dungeonChecklist']
  },
  {
    nameKey: 'settings.addonsList.dailyCraftStatus.name',
    url: 'https://www.esoui.com/downloads/info2510-DailyCraftStatus.html',
    file: 'DailyCraftStatus.lua',
    required: false,
    descriptionKey: 'settings.addonsList.dailyCraftStatus.description',
    relevantFlags: ['ridingTraining']
  },
  {
    nameKey: 'settings.addonsList.dataCollector.name',
    url: 'https://github.com/Illyriat/WhatShouldIDoDataCollector',
    file: 'WhatShouldIDoDataCollector.lua',
    required: false,
    descriptionKey: 'settings.addonsList.dataCollector.description',
    relevantFlags: ['allianceRank', 'welcomeBanner', 'wealthTracker']
  }
]

const THEME_OPTIONS: { value: ThemePreference; labelKey: string; descriptionKey: string; swatch: [string, string] }[] = [
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
                              {tKey(t, addon.nameKey)}
                            </a>
                            <span
                              className={`addon-badge ${badgeState}`}
                              title={
                                addonStatus == null
                                  ? t('settings.checking')
                                  : detected
                                    ? t('settings.detected', { file: addon.file })
                                    : t('settings.notDetected', { file: addon.file })
                              }
                            >
                              {addon.required ? t('settings.required') : t('settings.optional')}
                            </span>
                            {addonStatus != null && (
                              <span className="addon-row__detect muted">
                                {detected ? t('settings.detectedShort') : t('settings.notDetectedShort')}
                              </span>
                            )}
                          </div>
                          <p className="addon-row__desc">{tKey(t, addon.descriptionKey)}</p>
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
                components={{ support: <a className="about-donate" href="https://james-robson.dev/" target="_blank" rel="noreferrer" /> }}
              />
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
