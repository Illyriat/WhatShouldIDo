import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { WealthAmounts } from '@shared/types'
import { MUSIC_BOXES } from '@shared/musicBoxes'
import { allianceRankAchievement, musicBoxAchievement, wealthAchievement } from '@shared/achievements'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import AchievementCard from '../components/AchievementCard'
import WealthAchievementCard from '../components/WealthAchievementCard'
import type { AccountSelection } from '../hooks/useAccountSelection'
import type { FeaturePreferences } from '../hooks/useFeaturePreferences'
import { useMusicBoxCollection } from '../hooks/useMusicBoxCollection'
import { tKey } from '../i18nDynamicKey'

const WEALTH_KEYS: (keyof WealthAmounts)[] = ['gold', 'alliancePoints', 'telVarStones', 'writVouchers']

interface Props {
  accountSelection: AccountSelection
  features: FeaturePreferences
}

function AchievementsPage({ accountSelection, features }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const {
    state,
    selectedAccount,
    setSelectedAccount,
    selectedServer,
    setSelectedServer,
    availableServers,
    selectedCharacters
  } = accountSelection
  const { accountsReady, hasAccounts, collected } = useMusicBoxCollection(accountSelection)

  const musicBox = useMemo(() => musicBoxAchievement(MUSIC_BOXES.length), [])
  const musicBoxCount = collected.size

  const anyVisible = features.isEnabled('musicBoxes') || features.isEnabled('allianceRank') || features.isEnabled('wealthTracker')

  const allianceRank = useMemo(() => allianceRankAchievement(), [])
  const maxedCount = useMemo(
    () => selectedCharacters.filter((c) => c.allianceRank?.rank === 50).length,
    [selectedCharacters]
  )

  // Same bank + carried total per currency as the Wealth board on Home (see
  // WealthBoard.tsx) - kept per-currency rather than summed, since Wealth's classes gate on
  // all four independently.
  const bankWealth = useMemo(() => {
    if (state.status !== 'ready' || !selectedServer) return undefined
    return state.accounts.find((a) => a.accountName === selectedAccount)?.bankWealth[selectedServer]
  }, [state, selectedAccount, selectedServer])

  const wealth = useMemo(() => wealthAchievement(), [])
  const wealthAmounts = useMemo<WealthAmounts>(() => {
    const totals = { gold: 0, alliancePoints: 0, telVarStones: 0, writVouchers: 0 }
    for (const key of WEALTH_KEYS) {
      const bank = bankWealth?.[key] ?? 0
      const carried = selectedCharacters.reduce((s, c) => s + (c.wealth?.[key] ?? 0), 0)
      totals[key] = bank + carried
    }
    return totals
  }, [bankWealth, selectedCharacters])

  return (
    <div className="page">
      <h2 className="settings-title">{t('achievements.pageTitle')}</h2>

      {hasAccounts && (
        <div className="page__header">
          <div className="app__switchers">
            <AccountSwitcher
              accounts={state.status === 'ready' ? state.accounts : []}
              selected={selectedAccount ?? ''}
              onChange={setSelectedAccount}
            />
            <ServerSwitcher servers={availableServers} selected={selectedServer ?? ''} onChange={setSelectedServer} />
          </div>
        </div>
      )}

      <p className="muted alchemy-intro">{t(hasAccounts ? 'achievements.introTracked' : 'achievements.introUntracked')}</p>

      {!accountsReady ? (
        <p className="muted">{t('common.loadingAccounts')}</p>
      ) : !anyVisible ? (
        <p className="muted">{t('achievements.noneVisible')}</p>
      ) : (
        <div className="achievement-list">
          {features.isEnabled('musicBoxes') && (
            <AchievementCard
              achievement={musicBox}
              count={musicBoxCount}
              progressKey="achievements.musicBox.progress"
              progressParams={{ count: musicBoxCount, total: MUSIC_BOXES.length }}
              notStartedKey="achievements.musicBox.notStarted"
              notStartedParams={{ tier: tKey(t, musicBox.tiers[0].nameKey) }}
            />
          )}

          {features.isEnabled('allianceRank') && (
            <AchievementCard
              achievement={allianceRank}
              count={maxedCount}
              progressKey="achievements.allianceRank.progress"
              progressParams={{ count: maxedCount }}
              notStartedKey="achievements.allianceRank.notStarted"
              notStartedParams={{ tier: tKey(t, allianceRank.tiers[0].nameKey) }}
            />
          )}

          {features.isEnabled('wealthTracker') && (
            <WealthAchievementCard achievement={wealth} amounts={wealthAmounts} />
          )}
        </div>
      )}
    </div>
  )
}

export default AchievementsPage
