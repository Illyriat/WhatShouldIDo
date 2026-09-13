import { useEffect, useState } from 'react'

export type Page = 'home' | 'dungeons' | 'alchemy' | 'enchanting' | 'musicboxes' | 'settings'

interface Props {
  collapsed: boolean
  onToggleCollapsed: () => void
  activePage: Page
  onNavigate: (page: Page) => void
}

type NavItem =
  | { page: Page; label: string }
  | { group: string; label: string; children: { page: Page; label: string }[] }

const NAV_ITEMS: NavItem[] = [
  { page: 'home', label: 'Home' },
  { page: 'dungeons', label: 'Dungeon Check List' },
  {
    group: 'crafting',
    label: 'Crafting',
    children: [
      { page: 'alchemy', label: 'Alchemy' },
      { page: 'enchanting', label: 'Enchanting' }
    ]
  },
  {
    group: 'collections',
    label: 'Collections',
    children: [{ page: 'musicboxes', label: 'Music Boxes' }]
  }
]

const GROUPS = NAV_ITEMS.filter((item): item is Extract<NavItem, { group: string }> => 'children' in item)

function Sidebar({ collapsed, onToggleCollapsed, activePage, onNavigate }: Props): React.JSX.Element {
  const activeGroup = GROUPS.find((g) => g.children.some((c) => c.page === activePage))?.group ?? null
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
        {NAV_ITEMS.map((item) =>
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
