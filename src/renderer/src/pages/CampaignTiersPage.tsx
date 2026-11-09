import { Trans, useTranslation } from 'react-i18next'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import type { AccountSelection } from '../hooks/useAccountSelection'
import type { CampaignTierStatus } from '@shared/types'

interface Props {
  accountSelection: AccountSelection
}

// The stored tier belongs to a finished campaign once its end time has passed. The app
// works this out itself, so it shows up without the character logging in again.
export function hasCampaignEnded(status: CampaignTierStatus, nowMs: number = Date.now()): boolean {
  return status.endsAt > 0 && status.endsAt * 1000 <= nowMs
}

function CampaignTiersPage({ accountSelection }: Props): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const {
    state,
    selectedAccount,
    setSelectedAccount,
    selectedServer,
    setSelectedServer,
    availableServers,
    selectedCharacters
  } = accountSelection

  if (state.status === 'loading') {
    return (
      <div className="page page--centered">
        <p>{t('common.loadingCharacters')}</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="page page--centered">
        <div className="empty-state">
          <h1>{t('campaignTiers.couldntLoadTitle')}</h1>
          <p>{state.message}</p>
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

  const numberFormat = new Intl.NumberFormat(i18n.language)

  return (
    <div className="page page--wide">
      <div className="page__header">
        <div className="app__switchers">
          <AccountSwitcher accounts={state.accounts} selected={selectedAccount ?? ''} onChange={setSelectedAccount} />
          <ServerSwitcher servers={availableServers} selected={selectedServer ?? ''} onChange={setSelectedServer} />
        </div>
      </div>

      <section className="dungeon-table-section">
        <h3>{t('sidebar.campaignTiers')}</h3>

        {selectedCharacters.length === 0 ? (
          <p className="muted">{t('dungeons.noCharacters')}</p>
        ) : (
          <div className="dungeon-table-scroll">
            <table className="dungeon-table campaign-tier-table">
              <thead>
                <tr>
                  <th className="dungeon-table__char-col">{t('common.character')}</th>
                  <th>{t('campaignTiers.campaign')}</th>
                  <th>{t('campaignTiers.rewardTier')}</th>
                  <th>{t('campaignTiers.progress')}</th>
                </tr>
              </thead>
              <tbody>
                {selectedCharacters.map((character) => {
                  const status = character.campaignTier
                  return (
                    <tr key={character.charId}>
                      <td className="dungeon-table__char-col">{character.charName}</td>
                      {!status ? (
                        <td colSpan={3} className="muted">
                          <Trans i18nKey="campaignTiers.noDataYet" components={{ bold: <strong /> }} />
                        </td>
                      ) : hasCampaignEnded(status) ? (
                        <>
                          <td>{status.campaignName}</td>
                          <td colSpan={2} className="muted">
                            {t('campaignTiers.ended')}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{status.campaignName}</td>
                          <td className={status.tier >= 1 ? 'is-done' : undefined}>{status.tier}</td>
                          <td>
                            {status.nextTierTotal > 0
                              ? `${numberFormat.format(status.progress)} / ${numberFormat.format(status.nextTierTotal)}`
                              : numberFormat.format(status.progress)}
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default CampaignTiersPage
