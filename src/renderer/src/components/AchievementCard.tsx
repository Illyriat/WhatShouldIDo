import type { Achievement } from '@shared/achievements'
import { achievementMedalUrl, currentAchievementTier } from '@shared/achievements'

interface Props {
  achievement: Achievement
  count: number
  progressLabel: string
  notStartedHint: string
}

function AchievementCard({ achievement, count, progressLabel, notStartedHint }: Props): React.JSX.Element {
  const earned = currentAchievementTier(achievement.tiers, count)

  return (
    <section className="board-section achievement-card">
      <div className="pledges-panel__title-row">
        <h3 className="settings-section-title">{achievement.title}</h3>
        <span className="muted">{progressLabel}</span>
      </div>

      <p className="muted">{achievement.description}</p>

      <div className="achievement-tiers">
        {achievement.tiers.map((tier) => {
          const reached = count >= tier.threshold
          const isCurrent = earned?.tier === tier.tier
          return (
            <div
              key={tier.tier}
              className={`achievement-tier ${reached ? 'achievement-tier--earned' : 'achievement-tier--locked'} ${
                isCurrent ? 'achievement-tier--current' : ''
              }`}
            >
              <img
                className="achievement-tier__medal"
                src={achievementMedalUrl(achievement.iconSet, tier.tier)}
                alt={reached ? `${tier.name} medal, earned` : `${tier.name} medal, locked`}
              />
              <span className="achievement-tier__name">{tier.name}</span>
              <span className="achievement-tier__threshold">{tier.threshold.toLocaleString()}</span>
            </div>
          )
        })}
      </div>

      <p className="muted achievement-card__status">
        {earned ? (
          <>
            Current medal: <strong>{earned.name}</strong>
          </>
        ) : (
          notStartedHint
        )}
      </p>
    </section>
  )
}

export default AchievementCard
