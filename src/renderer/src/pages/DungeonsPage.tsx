import { Trans, useTranslation } from 'react-i18next'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import DungeonTable from '../components/DungeonTable'
import type { AccountSelection } from '../hooks/useAccountSelection'
import { PLEDGE_DUNGEONS } from '@shared/pledgeDungeons'

const BASE_DUNGEONS = PLEDGE_DUNGEONS.filter((d) => d.tier === 'base')
const DLC_DUNGEONS = PLEDGE_DUNGEONS.filter((d) => d.tier === 'dlc')

interface Props {
  accountSelection: AccountSelection
}

function DungeonsPage({ accountSelection }: Props): React.JSX.Element {
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
          <h1>{t('dungeons.couldntLoadTitle')}</h1>
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

  return (
    <div className="page page--wide">
      <div className="page__header">
        <div className="app__switchers">
          <AccountSwitcher accounts={state.accounts} selected={selectedAccount ?? ''} onChange={setSelectedAccount} />
          <ServerSwitcher servers={availableServers} selected={selectedServer ?? ''} onChange={setSelectedServer} />
        </div>
      </div>

      <DungeonTable title={t('dungeons.baseGame')} dungeons={BASE_DUNGEONS} characters={selectedCharacters} />
      <DungeonTable title={t('dungeons.dlc')} dungeons={DLC_DUNGEONS} characters={selectedCharacters} />
    </div>
  )
}

export default DungeonsPage
