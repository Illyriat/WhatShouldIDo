import { useMemo } from 'react'
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

const WEALTH_KEYS: (keyof WealthAmounts)[] = ['gold', 'alliancePoints', 'telVarStones', 'writVouchers']

interface Props {
  accountSelection: AccountSelection
  features: FeaturePreferences
}

function AchievementsPage({ accountSelection, features }: Props): React.JSX.Element {
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
      <h2 className="settings-title">Achievements</h2>

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

      <p className="muted alchemy-intro">
        What Should I Do's own medals, earned as you make progress in the app.
        {hasAccounts
          ? ' Tracked separately per account and server, and saved on this device.'
          : ' Saved on this device.'}
      </p>

      {!accountsReady ? (
        <p className="muted">Loading your ESO accounts…</p>
      ) : (
        <div className="achievement-list">
          <AchievementCard
            achievement={musicBox}
            count={musicBoxCount}
            progressLabel={`${musicBoxCount} / ${MUSIC_BOXES.length} collected`}
            notStartedHint={`Collect your first Music Box to earn the ${musicBox.tiers[0].name} medal.`}
          />

          {features.isEnabled('allianceRank') && (
            <AchievementCard
              achievement={allianceRank}
              count={maxedCount}
              progressLabel={`${maxedCount} at Rank 50`}
              notStartedHint={`Get one character to Alliance Rank 50 to earn the ${allianceRank.tiers[0].name} medal.`}
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
