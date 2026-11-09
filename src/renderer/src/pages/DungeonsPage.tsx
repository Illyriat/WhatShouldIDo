import { Trans, useTranslation } from 'react-i18next'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import DungeonTable from '../components/DungeonTable'
import type { AccountSelection } from '../hooks/useAccountSelection'
import { PLEDGE_DUNGEONS } from '@shared/pledgeDungeons'
import { ARENAS, SOLO_DUNGEONS } from '@shared/skillPointActivities'

export type DungeonSection = 'base' | 'dlc' | 'solo' | 'arenas'

// One sidebar sub-page per section, so the page doesn't grow into one long scroll.
const SECTIONS = {
  base: { titleKey: 'dungeons.baseGame', dungeons: PLEDGE_DUNGEONS.filter((d) => d.tier === 'base') },
  dlc: { titleKey: 'dungeons.dlc', dungeons: PLEDGE_DUNGEONS.filter((d) => d.tier === 'dlc') },
  solo: { titleKey: 'dungeons.soloDungeons', dungeons: SOLO_DUNGEONS },
  arenas: { titleKey: 'dungeons.arenas', dungeons: ARENAS }
} as const

interface Props {
  accountSelection: AccountSelection
  section: DungeonSection
}

function DungeonsPage({ accountSelection, section }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const { titleKey, dungeons } = SECTIONS[section]
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

      <DungeonTable title={t(titleKey)} dungeons={dungeons} characters={selectedCharacters} />
    </div>
  )
}

export default DungeonsPage
