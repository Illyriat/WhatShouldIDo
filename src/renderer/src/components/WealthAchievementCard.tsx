import { Trans, useTranslation } from 'react-i18next'
import type { WealthAmounts } from '@shared/types'
import type { WealthAchievement } from '@shared/achievements'
import { achievementMedalUrl, currentWealthTier } from '@shared/achievements'
import { tKey } from '../i18nDynamicKey'

interface Props {
  achievement: WealthAchievement
  amounts: WealthAmounts
}

function WealthAchievementCard({ achievement, amounts }: Props): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const earned = currentWealthTier(achievement.tiers, amounts)
  const fmt = new Intl.NumberFormat(i18n.language)

  return (
    <section className="board-section achievement-card">
      <div className="pledges-panel__title-row">
        <h3 className="settings-section-title">{tKey(t, achievement.titleKey)}</h3>
        <span className="muted">
          {t('achievements.wealth.amountsSummary', {
            gold: fmt.format(amounts.gold),
            ap: fmt.format(amounts.alliancePoints),
            telVar: fmt.format(amounts.telVarStones),
            writ: fmt.format(amounts.writVouchers)
          })}
        </span>
      </div>

      <p className="muted">{tKey(t, achievement.descriptionKey)}</p>

      <div className="achievement-tiers">
        {achievement.tiers.map((tier) => {
          const reached =
            amounts.gold >= tier.requirement.gold &&
            amounts.alliancePoints >= tier.requirement.alliancePoints &&
            amounts.telVarStones >= tier.requirement.telVarStones &&
            amounts.writVouchers >= tier.requirement.writVouchers
          const isCurrent = earned?.tier === tier.tier
          const tierName = tKey(t, tier.nameKey)
          return (
            <div
              key={tier.tier}
              className={`achievement-tier achievement-tier--wealth ${
                reached ? 'achievement-tier--earned' : 'achievement-tier--locked'
              } ${isCurrent ? 'achievement-tier--current' : ''}`}
            >
              <img
                className="achievement-tier__medal"
                src={achievementMedalUrl(achievement.iconSet, tier.tier)}
                alt={reached ? t('achievements.classAltEarned', { tier: tierName }) : t('achievements.classAltLocked', { tier: tierName })}
              />
              <span className="achievement-tier__name">{tierName}</span>
              <div className="achievement-tier__requirements">
                <span>
                  {t('wealth.goldShort')} {fmt.format(tier.requirement.gold)}
                </span>
                <span>
                  {t('wealth.apShort')} {fmt.format(tier.requirement.alliancePoints)}
                </span>
                <span>
                  {t('wealth.telVarShort')} {fmt.format(tier.requirement.telVarStones)}
                </span>
                <span>
                  {t('wealth.writShort')} {fmt.format(tier.requirement.writVouchers)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="muted achievement-card__status">
        {earned ? (
          <Trans i18nKey="achievements.currentClass" values={{ name: tKey(t, earned.nameKey) }} components={{ bold: <strong /> }} />
        ) : (
          t('achievements.wealth.notStarted', {
            gold: fmt.format(achievement.tiers[0].requirement.gold),
            tier: tKey(t, achievement.tiers[0].nameKey)
          })
        )}
      </p>
    </section>
  )
}

export default WealthAchievementCard
