import { useTranslation } from 'react-i18next'
import type { Character } from '@shared/types'

interface Props {
  characters: Character[]
}

function RidingBoard({ characters }: Props): React.JSX.Element {
  const { t } = useTranslation()
  const recommended = characters.filter((c) => c.readyToTrainRiding)

  return (
    <section className="board-section">
      <div className="pledges-panel__title-row">
        <h2>{t('riding.title')}</h2>
      </div>

      <div className="pledges-row pledges-row--single">
        <div className="pledge-col">
          <span className="pledge-card__master">{t('riding.stableMaster')}</span>
          <span className="pledge-card__tier">{t('riding.daily')}</span>
          <span className="pledge-card__dungeon">{t('riding.trainingOptions')}</span>
        </div>
      </div>

      <h2 className="recommended-title">{t('common.recommended')}</h2>

      <div className="characters-row characters-row--single">
        <div className="character-col">
          {recommended.length === 0 ? (
            <p className="muted">{t('riding.noneReady')}</p>
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
