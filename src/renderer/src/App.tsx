import { useState } from 'react'
import Sidebar, { type Page } from './components/Sidebar'
import UpdateBanner from './components/UpdateBanner'
import HomePage from './pages/HomePage'
import DungeonsPage from './pages/DungeonsPage'
import AllianceRankPage from './pages/AllianceRankPage'
import AlchemyPage from './pages/AlchemyPage'
import EnchantingPage from './pages/EnchantingPage'
import MusicBoxesPage from './pages/MusicBoxesPage'
import SettingsPage from './pages/SettingsPage'
import { FEATURE_FLAGS } from '@shared/featureFlags'
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
        {activePage === 'dungeons' && FEATURE_FLAGS.dungeonChecklist && (
          <DungeonsPage accountSelection={accountSelection} />
        )}
        {activePage === 'alliancerank' && FEATURE_FLAGS.allianceRank && (
          <AllianceRankPage accountSelection={accountSelection} />
        )}
        {activePage === 'alchemy' && FEATURE_FLAGS.alchemy && <AlchemyPage />}
        {activePage === 'enchanting' && FEATURE_FLAGS.enchanting && <EnchantingPage />}
        {activePage === 'musicboxes' && FEATURE_FLAGS.musicBoxes && (
          <MusicBoxesPage accountSelection={accountSelection} />
        )}
        {activePage === 'settings' && (
          <SettingsPage theme={theme} accountSelection={accountSelection} updater={updater} />
        )}
      </div>
    </div>
  )
}

export default App
