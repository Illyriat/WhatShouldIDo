import { useMemo } from 'react'
import { MUSIC_BOXES } from '@shared/musicBoxes'
import { allianceRankAchievement, musicBoxAchievement } from '@shared/achievements'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import AchievementCard from '../components/AchievementCard'
import type { AccountSelection } from '../hooks/useAccountSelection'
import { useMusicBoxCollection } from '../hooks/useMusicBoxCollection'

interface Props {
  accountSelection: AccountSelection
}

function AchievementsPage({ accountSelection }: Props): React.JSX.Element {
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

          <AchievementCard
            achievement={allianceRank}
            count={maxedCount}
            progressLabel={`${maxedCount} at Rank 50`}
            notStartedHint={`Get one character to Alliance Rank 50 to earn the ${allianceRank.tiers[0].name} medal.`}
          />
        </div>
      )}
    </div>
  )
}

export default AchievementsPage
