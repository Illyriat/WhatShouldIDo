import { useEffect, useMemo, useState } from 'react'
import type { RecommendationsResult } from '@shared/types'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import PledgesBoard from '../components/PledgesBoard'
import RidingBoard from '../components/RidingBoard'
import type { AccountSelection } from '../hooks/useAccountSelection'
import type { FeaturePreferences } from '../hooks/useFeaturePreferences'

type RecommendationsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; recommendations: RecommendationsResult }

const EMPTY_RECOMMENDATIONS: RecommendationsResult = { pledges: [], upcoming: [], stale: false, fetchedAt: '' }

interface Props {
  accountSelection: AccountSelection
  features: FeaturePreferences
}

function HomePage({ accountSelection, features }: Props): React.JSX.Element {
  const {
    state,
    selectedAccount,
    setSelectedAccount,
    selectedServer,
    setSelectedServer,
    availableServers,
    selectedCharacters,
    refresh,
    refreshToken
  } = accountSelection

  const [recState, setRecState] = useState<RecommendationsState>(() =>
    features.isEnabled('pledges') ? { status: 'loading' } : { status: 'ready', recommendations: EMPTY_RECOMMENDATIONS }
  )

  useEffect(() => {
    if (!features.isEnabled('pledges')) return

    let cancelled = false

    window.api
      .getRecommendations()
      .then((recommendations) => {
        if (!cancelled) setRecState({ status: 'ready', recommendations })
      })
      .catch((err: unknown) => {
        if (!cancelled) setRecState({ status: 'error', message: err instanceof Error ? err.message : String(err) })
      })

    return () => {
      cancelled = true
    }
    // Depend on refreshToken so one Refresh click reloads pledges alongside accounts.
  }, [refreshToken])

  const filteredRecommendations = useMemo(() => {
    if (recState.status !== 'ready') return null

    return {
      ...recState.recommendations,
      pledges: recState.recommendations.pledges.map((pledge) => ({
        ...pledge,
        characters: pledge.characters.filter(
          (c) =>
            (!selectedAccount || c.accountName === selectedAccount) &&
            (!selectedServer || c.server === selectedServer)
        )
      }))
    }
  }, [recState, selectedAccount, selectedServer])

  if (state.status === 'loading' || recState.status === 'loading') {
    return (
      <div className="page page--centered">
        <p>Loading your ESO characters…</p>
      </div>
    )
  }

  if (state.status === 'error' || recState.status === 'error') {
    const message = state.status === 'error' ? state.message : recState.status === 'error' ? recState.message : ''
    return (
      <div className="page page--centered">
        <div className="empty-state">
          <h1>Couldn't load pledge data</h1>
          <p>{message}</p>
          <p className="empty-state__hint">
            Make sure the USPF addon is installed and enabled in ESO, and that you've logged into the game at
            least once with it active.
          </p>
        </div>
      </div>
    )
  }

  if (state.accounts.length === 0) {
    return (
      <div className="page page--centered">
        <div className="empty-state">
          <h1>No characters found</h1>
          <p>
            Install and enable the <strong>USPF</strong> addon in ESO, then log into at least one character so it
            can record your progress.
          </p>
        </div>
      </div>
    )
  }

  // Champion Points are account+realm scoped (see accountBuilder.ts), so this reads the
  // total for whichever server is currently selected, not the account as a whole.
  const championPoints = selectedServer
    ? state.accounts.find((a) => a.accountName === selectedAccount)?.championPoints[selectedServer]
    : undefined

  return (
    <div className="page">
      {selectedAccount && (
        <div className="home-welcome-banner">
          <span className="home-welcome-banner__greeting">Welcome,</span>
          <div className="home-welcome-banner__identity">
            <h1>{selectedAccount}!</h1>
            {championPoints !== undefined && (
              <span className="home-welcome-banner__cp-badge">{championPoints.toLocaleString()} CP</span>
            )}
          </div>
        </div>
      )}

      <div className="page__header">
        <button
          className="refresh-button"
          onClick={refresh}
          title="Re-read SavedVariables from disk (ESO only writes them on logout / /reloadui)"
        >
          ⟳ Refresh
        </button>
        <div className="app__switchers">
          <AccountSwitcher accounts={state.accounts} selected={selectedAccount ?? ''} onChange={setSelectedAccount} />
          <ServerSwitcher servers={availableServers} selected={selectedServer ?? ''} onChange={setSelectedServer} />
        </div>
      </div>

      {features.isEnabled('pledges') && filteredRecommendations && (
        <PledgesBoard result={filteredRecommendations} upcomingPledgesEnabled={features.isEnabled('upcomingPledges')} />
      )}
      {features.isEnabled('ridingTraining') && <RidingBoard characters={selectedCharacters} />}
    </div>
  )
}

export default HomePage
