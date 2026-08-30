import { useEffect, useMemo, useState } from 'react'
import type { RecommendationsResult } from '@shared/types'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import PledgesBoard from '../components/PledgesBoard'
import RidingBoard from '../components/RidingBoard'
import type { AccountSelection } from '../hooks/useAccountSelection'

type RecommendationsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; recommendations: RecommendationsResult }

interface Props {
  accountSelection: AccountSelection
}

function HomePage({ accountSelection }: Props): React.JSX.Element {
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

  const [recState, setRecState] = useState<RecommendationsState>({ status: 'loading' })

  useEffect(() => {
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

  return (
    <div className="page">
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

      {filteredRecommendations && <PledgesBoard result={filteredRecommendations} />}
      <RidingBoard characters={selectedCharacters} />
    </div>
  )
}

export default HomePage
