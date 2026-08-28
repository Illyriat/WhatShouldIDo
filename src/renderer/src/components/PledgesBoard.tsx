import type { RecommendationsResult } from '@shared/types'

interface Props {
  result: RecommendationsResult
}

function PledgesBoard({ result }: Props): React.JSX.Element {
  return (
    <section className="board-section">
      <div className="pledges-panel__title-row">
        <h2>Today's Pledges</h2>
        {result.stale && (
          <span className="badge badge--warning" title={`Last fetched ${result.fetchedAt}`}>
            showing cached data
          </span>
        )}
      </div>

      <div className="pledges-row">
        {result.pledges.map((pledge) => (
          <div key={pledge.master.name} className="pledge-col">
            <span className="pledge-card__master">{pledge.master.name}</span>
            <span className="pledge-card__tier">{pledge.master.tier === 'dlc' ? 'DLC' : 'Base'}</span>
            <span className="pledge-card__dungeon">
              {pledge.scrapedName || 'Unknown'}
              {!pledge.dungeon && (
                <span className="badge badge--muted" title="No completion data mapped for this dungeon yet">
                  no data
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <h2 className="recommended-title">Recommended</h2>

      <div className="characters-row">
        {result.pledges.map((pledge) => {
          const recommended = pledge.characters.filter((c) => c.recommended)

          return (
            <div key={pledge.master.name} className="character-col">
              {!pledge.dungeon ? (
                <p className="muted">No data.</p>
              ) : recommended.length === 0 ? (
                <p className="muted">Every character has done this one.</p>
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
