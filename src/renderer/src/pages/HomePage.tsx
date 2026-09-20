import { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { RecommendationsResult } from '@shared/types'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import PledgesBoard from '../components/PledgesBoard'
import RidingBoard from '../components/RidingBoard'
import WealthBoard from '../components/WealthBoard'
import type { AccountSelection } from '../hooks/useAccountSelection'
import type { FeaturePreferences } from '../hooks/useFeaturePreferences'

type RecommendationsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; recommendations: RecommendationsResult }

const EMPTY_RECOMMENDATIONS: RecommendationsResult = { pledgesByRealm: [] }

interface Props {
  accountSelection: AccountSelection
  features: FeaturePreferences
}

function HomePage({ accountSelection, features }: Props): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const {
    state,
    selectedAccount,
    setSelectedAccount,
    selectedServer,
    setSelectedServer,
    availableServers,
    selectedCharacters,
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

  // Pledges are realm-scoped (see pledgesApi.ts) - pick the recommendations for whichever
  // realm is currently selected, then filter its characters down to the selected account
  // (the realm filter is already baked in by picking this entry).
  const realmPledges = useMemo(() => {
    if (recState.status !== 'ready' || !selectedServer) return null
    return recState.recommendations.pledgesByRealm.find((r) => r.server === selectedServer) ?? null
  }, [recState, selectedServer])

  const filteredPledges = useMemo(() => {
    if (!realmPledges) return null
    return realmPledges.pledges.map((pledge) => ({
      ...pledge,
      characters: pledge.characters.filter((c) => !selectedAccount || c.accountName === selectedAccount)
    }))
  }, [realmPledges, selectedAccount])

  if (state.status === 'loading' || recState.status === 'loading') {
    return (
      <div className="page page--centered">
        <p>{t('common.loadingCharacters')}</p>
      </div>
    )
  }

  if (state.status === 'error' || recState.status === 'error') {
    const message = state.status === 'error' ? state.message : recState.status === 'error' ? recState.message : ''
    return (
      <div className="page page--centered">
        <div className="empty-state">
          <h1>{t('home.couldntLoadTitle')}</h1>
          <p>{message}</p>
          <p className="empty-state__hint">{t('home.couldntLoadHint')}</p>
        </div>
      </div>
    )
  }

  if (state.accounts.length === 0) {
    return (
      <div className="page page--centered">
        <div className="empty-state">
          <h1>{t('common.noCharactersFoundTitle')}</h1>
          <p>
            <Trans i18nKey="common.noCharactersFoundBody" components={{ bold: <strong /> }} />
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

  // Bank currency is account+realm scoped too, same reasoning as Champion Points above.
  const bankWealth = selectedServer
    ? state.accounts.find((a) => a.accountName === selectedAccount)?.bankWealth[selectedServer]
    : undefined

  return (
    <div className="page">
      {features.isEnabled('welcomeBanner') && selectedAccount && (
        <div className="home-welcome-banner">
          <span className="home-welcome-banner__greeting">{t('home.greeting')}</span>
          <div className="home-welcome-banner__identity">
            <h1>{selectedAccount}!</h1>
            {championPoints !== undefined && (
              <span className="home-welcome-banner__cp-badge">
                {new Intl.NumberFormat(i18n.language).format(championPoints)} CP
              </span>
            )}
          </div>
        </div>
      )}

      <div className="page__header">
        <div className="app__switchers">
          <AccountSwitcher accounts={state.accounts} selected={selectedAccount ?? ''} onChange={setSelectedAccount} />
          <ServerSwitcher servers={availableServers} selected={selectedServer ?? ''} onChange={setSelectedServer} />
        </div>
      </div>

      {(features.isEnabled('wealthTracker') ||
        (features.isEnabled('pledges') && filteredPledges) ||
        features.isEnabled('ridingTraining')) && (
        <div className="home-top-row">
          {features.isEnabled('wealthTracker') && (
            <div className="home-top-row__wealth">
              <WealthBoard bankWealth={bankWealth} characters={selectedCharacters} server={selectedServer} />
            </div>
          )}
          <div className="home-top-row__main">
            {features.isEnabled('pledges') && filteredPledges && realmPledges && (
              <PledgesBoard
                pledges={filteredPledges}
                upcoming={realmPledges.upcoming}
                upcomingPledgesEnabled={features.isEnabled('upcomingPledges')}
              />
            )}
            {features.isEnabled('ridingTraining') && <RidingBoard characters={selectedCharacters} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
