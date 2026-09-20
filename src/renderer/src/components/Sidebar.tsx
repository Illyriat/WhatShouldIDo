import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { tKey } from '../i18nDynamicKey'
import type { FeatureFlag } from '@shared/featureFlags'
import type { FeaturePreferences } from '../hooks/useFeaturePreferences'

export type Page =
  | 'home'
  | 'dungeons'
  | 'alliancerank'
  | 'alchemy'
  | 'enchanting'
  | 'musicboxes'
  | 'achievements'
  | 'settings'

interface Props {
  collapsed: boolean
  onToggleCollapsed: () => void
  activePage: Page
  onNavigate: (page: Page) => void
  features: FeaturePreferences
}

export type NavItem =
  | { page: Page; labelKey: string; flag?: FeatureFlag }
  | { group: string; labelKey: string; children: { page: Page; labelKey: string; flag?: FeatureFlag }[] }

// Exported so tests can verify every labelKey resolves against en.ts - tKey() bypasses
// t()'s compile-time key checking for exactly this kind of data-driven key, so nothing
// else catches a typo'd or renamed key here.
export const ALL_NAV_ITEMS: NavItem[] = [
  { page: 'home', labelKey: 'sidebar.home' },
  { page: 'dungeons', labelKey: 'sidebar.dungeonChecklist', flag: 'dungeonChecklist' },
  { page: 'alliancerank', labelKey: 'sidebar.allianceRank', flag: 'allianceRank' },
  {
    group: 'crafting',
    labelKey: 'sidebar.crafting',
    children: [
      { page: 'alchemy', labelKey: 'sidebar.alchemy', flag: 'alchemy' },
      { page: 'enchanting', labelKey: 'sidebar.enchanting', flag: 'enchanting' }
    ]
  },
  {
    group: 'collections',
    labelKey: 'sidebar.collections',
    children: [{ page: 'musicboxes', labelKey: 'sidebar.musicBoxes', flag: 'musicBoxes' }]
  }
]

function Sidebar({ collapsed, onToggleCollapsed, activePage, onNavigate, features }: Props): React.JSX.Element {
  const { t } = useTranslation()

  // Drop flagged-off items (developer build flag or user "declutter" toggle), then drop
  // any group left with no children.
  const navItems: NavItem[] = ALL_NAV_ITEMS.map((item) =>
    'children' in item
      ? { ...item, children: item.children.filter((c) => !c.flag || features.isEnabled(c.flag)) }
      : item
  ).filter((item) => ('children' in item ? item.children.length > 0 : !item.flag || features.isEnabled(item.flag)))

  const groups = navItems.filter((item): item is Extract<NavItem, { group: string }> => 'children' in item)

  const activeGroup = groups.find((g) => g.children.some((c) => c.page === activePage))?.group ?? null
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => (activeGroup ? new Set([activeGroup]) : new Set()))

  // Reveal a group when navigation lands on one of its pages from elsewhere.
  useEffect(() => {
    if (activeGroup) setOpenGroups((prev) => (prev.has(activeGroup) ? prev : new Set(prev).add(activeGroup)))
  }, [activeGroup])

  function toggleGroup(group: string): void {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand">
        {!collapsed && <span className="sidebar__title">What Should I Do?</span>}
        <button
          className="sidebar__toggle"
          onClick={onToggleCollapsed}
          title={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) =>
          'children' in item ? (
            <div key={item.group} className="sidebar__group">
              <button
                className={`sidebar__nav-item sidebar__group-toggle ${
                  activeGroup === item.group && !openGroups.has(item.group) ? 'sidebar__nav-item--active' : ''
                }`}
                title={tKey(t, item.labelKey)}
                aria-expanded={openGroups.has(item.group)}
                onClick={() => toggleGroup(item.group)}
              >
                {collapsed ? (
                  tKey(t, item.labelKey).slice(0, 1)
                ) : (
                  <>
                    <span>{tKey(t, item.labelKey)}</span>
                    <span className="sidebar__group-caret" aria-hidden="true">
                      {openGroups.has(item.group) ? '▾' : '▸'}
                    </span>
                  </>
                )}
              </button>

              {openGroups.has(item.group) && (
                <div className="sidebar__subnav">
                  {item.children.map((child) => (
                    <button
                      key={child.page}
                      className={`sidebar__nav-item sidebar__nav-item--child ${
                        activePage === child.page ? 'sidebar__nav-item--active' : ''
                      }`}
                      title={tKey(t, child.labelKey)}
                      onClick={() => onNavigate(child.page)}
                    >
                      {collapsed ? tKey(t, child.labelKey).slice(0, 1) : tKey(t, child.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              key={item.page}
              className={`sidebar__nav-item ${activePage === item.page ? 'sidebar__nav-item--active' : ''}`}
              title={tKey(t, item.labelKey)}
              onClick={() => onNavigate(item.page)}
            >
              {collapsed ? tKey(t, item.labelKey).slice(0, 1) : tKey(t, item.labelKey)}
            </button>
          )
        )}
      </nav>

      <div className="sidebar__footer">
        {features.isEnabled('achievements') && (
          <button
            className={`sidebar__nav-item ${activePage === 'achievements' ? 'sidebar__nav-item--active' : ''}`}
            title={t('sidebar.achievements')}
            aria-label={t('sidebar.achievements')}
            onClick={() => onNavigate('achievements')}
          >
            <span className="sidebar__settings-icon" aria-hidden="true">
              ★
            </span>
            {!collapsed && <span>{t('sidebar.achievements')}</span>}
          </button>
        )}

        <button
          className={`sidebar__nav-item ${activePage === 'settings' ? 'sidebar__nav-item--active' : ''}`}
          title={t('sidebar.settings')}
          aria-label={t('sidebar.settings')}
          onClick={() => onNavigate('settings')}
        >
          <span className="sidebar__settings-icon" aria-hidden="true">
            ⚙
          </span>
          {!collapsed && <span>{t('sidebar.settings')}</span>}
        </button>

        <a
          className="sidebar__donate"
          href="https://james-robson.dev/"
          target="_blank"
          rel="noreferrer"
          title={t('sidebar.supportProject')}
          aria-label={t('sidebar.supportProject')}
        >
          <span className="sidebar__donate-icon" aria-hidden="true">
            ♥
          </span>
          {!collapsed && <span>{t('sidebar.supportProject')}</span>}
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
