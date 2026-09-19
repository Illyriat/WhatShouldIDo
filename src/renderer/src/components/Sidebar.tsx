import { useEffect, useState } from 'react'
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

type NavItem =
  | { page: Page; label: string; flag?: FeatureFlag }
  | { group: string; label: string; children: { page: Page; label: string; flag?: FeatureFlag }[] }

const ALL_NAV_ITEMS: NavItem[] = [
  { page: 'home', label: 'Home' },
  { page: 'dungeons', label: 'Dungeon Check List', flag: 'dungeonChecklist' },
  { page: 'alliancerank', label: 'Alliance Rank', flag: 'allianceRank' },
  {
    group: 'crafting',
    label: 'Crafting',
    children: [
      { page: 'alchemy', label: 'Alchemy', flag: 'alchemy' },
      { page: 'enchanting', label: 'Enchanting', flag: 'enchanting' }
    ]
  },
  {
    group: 'collections',
    label: 'Collections',
    children: [{ page: 'musicboxes', label: 'Music Boxes', flag: 'musicBoxes' }]
  }
]

function Sidebar({ collapsed, onToggleCollapsed, activePage, onNavigate, features }: Props): React.JSX.Element {
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
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
                title={item.label}
                aria-expanded={openGroups.has(item.group)}
                onClick={() => toggleGroup(item.group)}
              >
                {collapsed ? (
                  item.label.slice(0, 1)
                ) : (
                  <>
                    <span>{item.label}</span>
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
                      title={child.label}
                      onClick={() => onNavigate(child.page)}
                    >
                      {collapsed ? child.label.slice(0, 1) : child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              key={item.page}
              className={`sidebar__nav-item ${activePage === item.page ? 'sidebar__nav-item--active' : ''}`}
              title={item.label}
              onClick={() => onNavigate(item.page)}
            >
              {collapsed ? item.label.slice(0, 1) : item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar__footer">
        {features.isEnabled('achievements') && (
          <button
            className={`sidebar__nav-item ${activePage === 'achievements' ? 'sidebar__nav-item--active' : ''}`}
            title="Achievements"
            aria-label="Achievements"
            onClick={() => onNavigate('achievements')}
          >
            <span className="sidebar__settings-icon" aria-hidden="true">
              🏆
            </span>
            {!collapsed && <span>Achievements</span>}
          </button>
        )}

        <button
          className={`sidebar__nav-item ${activePage === 'settings' ? 'sidebar__nav-item--active' : ''}`}
          title="Settings"
          aria-label="Settings"
          onClick={() => onNavigate('settings')}
        >
          <span className="sidebar__settings-icon" aria-hidden="true">
            ⚙
          </span>
          {!collapsed && <span>Settings</span>}
        </button>

        <a
          className="sidebar__donate"
          href="https://james-robson.dev/"
          target="_blank"
          rel="noreferrer"
          title="Support the project"
          aria-label="Support the project"
        >
          <span className="sidebar__donate-icon" aria-hidden="true">
            ♥
          </span>
          {!collapsed && <span>Support the project</span>}
        </a>
      </div>
    </aside>
  )
}

export default Sidebar
