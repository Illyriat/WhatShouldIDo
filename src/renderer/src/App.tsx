import { useState } from 'react'
import Sidebar, { type Page } from './components/Sidebar'
import UpdateBanner from './components/UpdateBanner'
import HomePage from './pages/HomePage'
import DungeonsPage, { type DungeonSection } from './pages/DungeonsPage'
import AllianceRankPage from './pages/AllianceRankPage'
import AlchemyPage from './pages/AlchemyPage'
import EnchantingPage from './pages/EnchantingPage'
import MusicBoxesPage from './pages/MusicBoxesPage'
import AchievementsPage from './pages/AchievementsPage'
import SettingsPage from './pages/SettingsPage'
import { useAccountSelection } from './hooks/useAccountSelection'
import { useTheme } from './hooks/useTheme'
import { useAppUpdater } from './hooks/useAppUpdater'
import { useFeaturePreferences } from './hooks/useFeaturePreferences'
import { useLanguage } from './hooks/useLanguage'

// Each Dungeon Check List sub-page in the sidebar shows one section of the same page.
const DUNGEON_SECTION_BY_PAGE: Partial<Record<Page, DungeonSection>> = {
  'dungeons-base': 'base',
  'dungeons-dlc': 'dlc',
  'dungeons-solo': 'solo',
  'dungeons-arenas': 'arenas'
}

function App(): React.JSX.Element {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<Page>('home')
  const accountSelection = useAccountSelection()
  const theme = useTheme()
  const updater = useAppUpdater()
  const features = useFeaturePreferences()
  const language = useLanguage()
  const dungeonSection = DUNGEON_SECTION_BY_PAGE[activePage]

  return (
    <div className="layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        activePage={activePage}
        onNavigate={setActivePage}
        features={features}
      />
      <div className="layout__content">
        <UpdateBanner updater={updater} />
        {activePage === 'home' && <HomePage accountSelection={accountSelection} features={features} />}
        {dungeonSection && features.isEnabled('dungeonChecklist') && (
          <DungeonsPage accountSelection={accountSelection} section={dungeonSection} />
        )}
        {activePage === 'alliancerank' && features.isEnabled('allianceRank') && (
          <AllianceRankPage accountSelection={accountSelection} />
        )}
        {activePage === 'alchemy' && features.isEnabled('alchemy') && <AlchemyPage />}
        {activePage === 'enchanting' && features.isEnabled('enchanting') && <EnchantingPage />}
        {activePage === 'musicboxes' && features.isEnabled('musicBoxes') && (
          <MusicBoxesPage accountSelection={accountSelection} />
        )}
        {activePage === 'achievements' && features.isEnabled('achievements') && (
          <AchievementsPage accountSelection={accountSelection} features={features} />
        )}
        {activePage === 'settings' && (
          <SettingsPage
            theme={theme}
            accountSelection={accountSelection}
            updater={updater}
            features={features}
            language={language}
          />
        )}
      </div>
    </div>
  )
}

export default App
