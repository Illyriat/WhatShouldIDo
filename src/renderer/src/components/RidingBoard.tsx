import type { Character } from '@shared/types'

interface Props {
  characters: Character[]
}

function RidingBoard({ characters }: Props): React.JSX.Element {
  const recommended = characters.filter((c) => c.readyToTrainRiding)

  return (
    <section className="board-section">
      <div className="pledges-panel__title-row">
        <h2>Riding Training</h2>
      </div>

      <div className="pledges-row pledges-row--single">
        <div className="pledge-col">
          <span className="pledge-card__master">Stable Master</span>
          <span className="pledge-card__tier">DAILY</span>
          <span className="pledge-card__dungeon">Capacity, Stamina or Speed</span>
        </div>
      </div>

      <h2 className="recommended-title">Recommended</h2>

      <div className="characters-row characters-row--single">
        <div className="character-col">
          {recommended.length === 0 ? (
            <p className="muted">No characters ready to train right now.</p>
          ) : (
            <ul>
              {recommended.map((c) => (
                <li key={c.charId}>{c.charName}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default RidingBoard
