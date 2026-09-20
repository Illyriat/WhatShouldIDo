import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { CURRENCY_LABEL, MUSIC_BOXES, musicBoxIconUrl, type MusicBox } from '@shared/musicBoxes'
import AccountSwitcher from '../components/AccountSwitcher'
import ServerSwitcher from '../components/ServerSwitcher'
import type { AccountSelection } from '../hooks/useAccountSelection'
import { useMusicBoxCollection } from '../hooks/useMusicBoxCollection'

interface Props {
  accountSelection: AccountSelection
}

type Filter = 'all' | 'collected' | 'missing'

function costLabel(box: MusicBox): string {
  if (!box.cost) return '—'
  return `${box.cost} ${CURRENCY_LABEL[box.currency]}`
}

function MusicBoxesPage({ accountSelection }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const { state, selectedAccount, setSelectedAccount, selectedServer, setSelectedServer, availableServers } =
    accountSelection
  const { accountsReady, hasAccounts, collected, toggle } = useMusicBoxCollection(accountSelection)

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MUSIC_BOXES.filter((box) => {
      if (filter === 'collected' && !collected.has(box.id)) return false
      if (filter === 'missing' && collected.has(box.id)) return false
      if (!q) return true
      return (
        box.name.toLowerCase().includes(q) ||
        box.source.toLowerCase().includes(q) ||
        box.description.toLowerCase().includes(q)
      )
    })
  }, [query, filter, collected])

  const total = MUSIC_BOXES.length
  const collectedCount = collected.size
  const pct = total === 0 ? 0 : Math.round((collectedCount / total) * 100)

  return (
    <div className="page page--wide">
      <h2 className="settings-title">{t('musicBoxes.pageTitle')}</h2>

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
        <Trans i18nKey={hasAccounts ? 'musicBoxes.introTracked' : 'musicBoxes.introUntracked'} components={{ bold: <strong /> }} />
      </p>

      <section className="board-section">
        <div className="pledges-panel__title-row musicbox-head">
          <h3 className="settings-section-title">{t('musicBoxes.collected', { count: collectedCount, total })}</h3>
          <div className="musicbox-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="musicbox-progress__fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="muted">{pct}%</span>
        </div>

        <div className="musicbox-toolbar">
          <input
            className="dropdown musicbox-search"
            type="search"
            placeholder={t('musicBoxes.filterPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="alchemy-mode-toggle" role="group" aria-label={t('musicBoxes.filterByCollected')}>
            <button
              className={`alchemy-mode-btn ${filter === 'all' ? 'alchemy-mode-btn--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('musicBoxes.all')}
            </button>
            <button
              className={`alchemy-mode-btn ${filter === 'missing' ? 'alchemy-mode-btn--active' : ''}`}
              onClick={() => setFilter('missing')}
            >
              {t('musicBoxes.missing')}
            </button>
            <button
              className={`alchemy-mode-btn ${filter === 'collected' ? 'alchemy-mode-btn--active' : ''}`}
              onClick={() => setFilter('collected')}
            >
              {t('musicBoxes.collectedFilter')}
            </button>
          </div>
        </div>

        {!accountsReady ? (
          <p className="muted">{t('common.loadingAccounts')}</p>
        ) : (
          <div className="dungeon-table-scroll">
            <table className="dungeon-table musicbox-table">
              <thead>
                <tr>
                  <th className="musicbox-table__check-col">{t('musicBoxes.gotIt')}</th>
                  <th className="musicbox-table__icon-col"></th>
                  <th>{t('musicBoxes.name')}</th>
                  <th>{t('musicBoxes.source')}</th>
                  <th>{t('musicBoxes.cost')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((box) => {
                  const isCollected = collected.has(box.id)
                  return (
                    <tr key={box.id} className={isCollected ? 'musicbox-row--collected' : ''}>
                      <td className="musicbox-table__check-col">
                        <input
                          id={`musicbox-${box.id}`}
                          type="checkbox"
                          checked={isCollected}
                          onChange={() => toggle(box.id)}
                        />
                      </td>
                      <td className="musicbox-table__icon-col">
                        <img className="musicbox-icon" src={musicBoxIconUrl(box.id)} alt="" />
                      </td>
                      <td className="musicbox-table__name">
                        <label htmlFor={`musicbox-${box.id}`}>{box.name}</label>
                        <span className="muted musicbox-table__desc">{box.description}</span>
                      </td>
                      <td>{box.source}</td>
                      <td className="musicbox-table__cost">{costLabel(box)}</td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="muted musicbox-table__empty">
                      {t('musicBoxes.noMatches', { query })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default MusicBoxesPage
