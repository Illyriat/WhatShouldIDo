import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { RecommendationsResult } from '@shared/types'

interface Props {
  result: RecommendationsResult
  upcomingPledgesEnabled: boolean
}

function PledgesBoard({ result, upcomingPledgesEnabled }: Props): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const [showUpcoming, setShowUpcoming] = useState(false)

  function formatUpcomingLabel(esoDay: string, index: number): string {
    if (index === 0) return t('pledges.tomorrow')
    return new Date(`${esoDay}T00:00:00Z`).toLocaleDateString(i18n.language, { weekday: 'short', timeZone: 'UTC' })
  }

  return (
    <section className="board-section">
      <div className="pledges-panel__title-row">
        <h2>{t('pledges.title')}</h2>
        {result.stale && (
          <span className="badge badge--warning" title={t('pledges.cachedTitle', { fetchedAt: result.fetchedAt })}>
            {t('pledges.cachedBadge')}
          </span>
        )}
      </div>

      <div className="pledges-row">
        {result.pledges.map((pledge) => (
          <div key={pledge.master.name} className="pledge-col">
            <span className="pledge-card__master">{pledge.master.name}</span>
            <span className="pledge-card__tier">{pledge.master.tier === 'dlc' ? t('pledges.dlc') : t('pledges.base')}</span>
            <span className="pledge-card__dungeon">
              {pledge.scrapedName || t('pledges.unknownDungeon')}
              {!pledge.dungeon && (
                <span className="badge badge--muted" title={t('pledges.noDataMapped')}>
                  {t('pledges.noDataBadge')}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {upcomingPledgesEnabled && result.upcoming.length > 0 && (
        <div className="upcoming-pledges">
          <button
            type="button"
            className="upcoming-pledges__toggle"
            onClick={() => setShowUpcoming((v) => !v)}
            aria-expanded={showUpcoming}
          >
            <span className={`upcoming-pledges__caret${showUpcoming ? ' is-open' : ''}`}>▸</span>
            {t('pledges.showUpcoming', { count: result.upcoming.length })}
          </button>

          {showUpcoming && (
            <ul className="upcoming-pledges__list">
              {result.upcoming.map((day, i) => (
                <li key={day.esoDay} className="upcoming-pledges__day">
                  <span className="upcoming-pledges__label">{formatUpcomingLabel(day.esoDay, i)}</span>
                  <span className="upcoming-pledges__dungeons">
                    {day.pledges.map((p) => p.scrapedName || t('pledges.unknownDungeon')).join(' · ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <h2 className="recommended-title">{t('common.recommended')}</h2>

      <div className="characters-row">
        {result.pledges.map((pledge) => {
          const recommended = pledge.characters.filter((c) => c.recommended)

          return (
            <div key={pledge.master.name} className="character-col">
              {!pledge.dungeon ? (
                <p className="muted">{t('pledges.noData')}</p>
              ) : recommended.length === 0 ? (
                <p className="muted">{t('pledges.everyoneDone')}</p>
              ) : (
                <ul>
                  {recommended.map((c) => (
                    <li key={c.charId}>{c.charName}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PledgesBoard
