export type Page = 'home' | 'dungeons' | 'alchemy' | 'enchanting' | 'settings'

interface Props {
  collapsed: boolean
  onToggleCollapsed: () => void
  activePage: Page
  onNavigate: (page: Page) => void
}

const NAV_ITEMS: { page: Page; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'dungeons', label: 'Dungeon Check List' },
  { page: 'alchemy', label: 'Potion Crafting' },
  { page: 'enchanting', label: 'Enchanting' }
]

function Sidebar({ collapsed, onToggleCollapsed, activePage, onNavigate }: Props): React.JSX.Element {
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
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            className={`sidebar__nav-item ${activePage === item.page ? 'sidebar__nav-item--active' : ''}`}
            title={item.label}
            onClick={() => onNavigate(item.page)}
          >
            {collapsed ? item.label.slice(0, 1) : item.label}
          </button>
        ))}
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
