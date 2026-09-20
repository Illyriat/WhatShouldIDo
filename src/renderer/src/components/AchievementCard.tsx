import { Trans, useTranslation } from 'react-i18next'
import type { Achievement } from '@shared/achievements'
import { achievementMedalUrl, currentAchievementTier } from '@shared/achievements'
import { tKey } from '../i18nDynamicKey'

interface Props {
  achievement: Achievement
  count: number
  // e.g. 'achievements.musicBox.progress' with { count, total }.
  progressKey: string
  progressParams: Record<string, unknown>
  // e.g. 'achievements.musicBox.notStarted' with { tier: <first tier's translated name> }.
  notStartedKey: string
  notStartedParams: Record<string, unknown>
}

function AchievementCard({
  achievement,
  count,
  progressKey,
  progressParams,
  notStartedKey,
  notStartedParams
}: Props): React.JSX.Element {
  const { t } = useTranslation()
  const earned = currentAchievementTier(achievement.tiers, count)

  return (
    <section className="board-section achievement-card">
      <div className="pledges-panel__title-row">
        <h3 className="settings-section-title">{tKey(t, achievement.titleKey)}</h3>
        <span className="muted">{tKey(t, progressKey, progressParams)}</span>
      </div>

      <p className="muted">{tKey(t, achievement.descriptionKey)}</p>

      <div className="achievement-tiers">
        {achievement.tiers.map((tier) => {
          const reached = count >= tier.threshold
          const isCurrent = earned?.tier === tier.tier
          const tierName = tKey(t, tier.nameKey)
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
                alt={reached ? t('achievements.medalAltEarned', { tier: tierName }) : t('achievements.medalAltLocked', { tier: tierName })}
              />
              <span className="achievement-tier__name">{tierName}</span>
              <span className="achievement-tier__threshold">{tier.threshold.toLocaleString()}</span>
            </div>
          )
        })}
      </div>

      <p className="muted achievement-card__status">
        {earned ? (
          <Trans i18nKey="achievements.currentMedal" values={{ name: tKey(t, earned.nameKey) }} components={{ bold: <strong /> }} />
        ) : (
          tKey(t, notStartedKey, notStartedParams)
        )}
      </p>
    </section>
  )
}

export default AchievementCard
