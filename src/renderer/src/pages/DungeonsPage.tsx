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
          <h1>Couldn't load dungeon data</h1>
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

      <DungeonTable title="Base Game" dungeons={BASE_DUNGEONS} characters={selectedCharacters} />
      <DungeonTable title="DLC" dungeons={DLC_DUNGEONS} characters={selectedCharacters} />
    </div>
  )
}

export default DungeonsPage
