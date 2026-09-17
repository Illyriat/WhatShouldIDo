import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import AllianceRankCircle from '../components/AllianceRankCircle'
import type { AccountSelection } from '../hooks/useAccountSelection'

interface Props {
  accountSelection: AccountSelection
}

function AllianceRankPage({ accountSelection }: Props): React.JSX.Element {
  const {
    state,
    selectedAccount,
    setSelectedAccount,
    selectedServer,
    setSelectedServer,
    availableServers,
    selectedCharacters,
    refresh
  } = accountSelection

  if (state.status === 'loading') {
    return (
      <div className="page page--centered">
        <p>Loading your ESO characters…</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="page page--centered">
        <div className="empty-state">
          <h1>Couldn't load character data</h1>
          <p>{state.message}</p>
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

  const total = selectedCharacters.length
  const maxedCount = selectedCharacters.filter((c) => c.allianceRank && c.allianceRank.rank >= 50).length
  const maxedPct = total > 0 ? Math.round((maxedCount / total) * 100) : 0

  return (
    <div className="page page--wide">
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

      <section className="board-section">
        <div className="pledges-panel__title-row musicbox-head">
          <h2>Alliance Rank:</h2>
          <h3 className="settings-section-title">
            {maxedCount} / {total} at max rank
          </h3>
          <div
            className="musicbox-progress"
            role="progressbar"
            aria-valuenow={maxedPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="musicbox-progress__fill" style={{ width: `${maxedPct}%` }} />
          </div>
          <span className="muted">{maxedPct}%</span>
        </div>

        <div className="alliance-rank-grid">
          {selectedCharacters.map((character) => (
            <div key={character.charId} className="alliance-rank-card">
              <span className="alliance-rank-card__name">{character.charName}</span>
              {character.allianceRank ? (
                <AllianceRankCircle status={character.allianceRank} />
              ) : (
                <p className="muted alliance-rank-card__empty">
                  No data yet - log in with the <strong>WhatShouldIDoDataCollector</strong> addon active.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AllianceRankPage
