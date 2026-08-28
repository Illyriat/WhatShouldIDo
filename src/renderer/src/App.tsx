import { useState } from 'react'
import Sidebar, { type Page } from './components/Sidebar'
import UpdateBanner from './components/UpdateBanner'
import HomePage from './pages/HomePage'
import DungeonsPage from './pages/DungeonsPage'
import AlchemyPage from './pages/AlchemyPage'
import EnchantingPage from './pages/EnchantingPage'
import SettingsPage from './pages/SettingsPage'
import { useAccountSelection } from './hooks/useAccountSelection'
import { useTheme } from './hooks/useTheme'
import { useAppUpdater } from './hooks/useAppUpdater'

function App(): React.JSX.Element {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<Page>('home')
  const accountSelection = useAccountSelection()
  const theme = useTheme()
  const updater = useAppUpdater()

  return (
    <div className="layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      <div className="layout__content">
        <UpdateBanner updater={updater} />
        {activePage === 'home' && <HomePage accountSelection={accountSelection} />}
        {activePage === 'dungeons' && <DungeonsPage accountSelection={accountSelection} />}
        {activePage === 'alchemy' && <AlchemyPage />}
        {activePage === 'enchanting' && <EnchantingPage />}
        {activePage === 'settings' && (
          <SettingsPage theme={theme} accountSelection={accountSelection} updater={updater} />
        )}
      </div>
    </div>
  )
}

export default App
