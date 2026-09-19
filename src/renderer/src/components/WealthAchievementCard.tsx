import type { WealthAmounts } from '@shared/types'
import type { WealthAchievement } from '@shared/achievements'
import { achievementMedalUrl, currentWealthTier } from '@shared/achievements'

interface Props {
  achievement: WealthAchievement
  amounts: WealthAmounts
}

const NUMBER_FORMAT = new Intl.NumberFormat()

// Matches WealthBoard's currency order and short labels, so the two pages read the same way.
const CURRENCY_ROWS: { key: keyof WealthAmounts; short: string }[] = [
  { key: 'gold', short: 'Gold' },
  { key: 'alliancePoints', short: 'AP' },
  { key: 'telVarStones', short: 'Tel Var' },
  { key: 'writVouchers', short: 'Writ' }
]

function WealthAchievementCard({ achievement, amounts }: Props): React.JSX.Element {
  const earned = currentWealthTier(achievement.tiers, amounts)

  return (
    <section className="board-section achievement-card">
      <div className="pledges-panel__title-row">
        <h3 className="settings-section-title">{achievement.title}</h3>
        <span className="muted">
          {NUMBER_FORMAT.format(amounts.gold)} Gold · {NUMBER_FORMAT.format(amounts.alliancePoints)} AP ·{' '}
          {NUMBER_FORMAT.format(amounts.telVarStones)} Tel Var · {NUMBER_FORMAT.format(amounts.writVouchers)} Writ
        </span>
      </div>

      <p className="muted">{achievement.description}</p>

      <div className="achievement-tiers">
        {achievement.tiers.map((tier) => {
          const reached =
            amounts.gold >= tier.requirement.gold &&
            amounts.alliancePoints >= tier.requirement.alliancePoints &&
            amounts.telVarStones >= tier.requirement.telVarStones &&
            amounts.writVouchers >= tier.requirement.writVouchers
          const isCurrent = earned?.tier === tier.tier
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
                alt={reached ? `${tier.name} class, earned` : `${tier.name} class, locked`}
              />
              <span className="achievement-tier__name">{tier.name}</span>
              <div className="achievement-tier__requirements">
                {CURRENCY_ROWS.map((c) => (
                  <span key={c.key}>
                    {c.short} {NUMBER_FORMAT.format(tier.requirement[c.key])}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="muted achievement-card__status">
        {earned ? (
          <>
            Current class: <strong>{earned.name}</strong>
          </>
        ) : (
          `Reach ${NUMBER_FORMAT.format(achievement.tiers[0].requirement.gold)} Gold to earn the ${
            achievement.tiers[0].name
          } class.`
        )}
      </p>
    </section>
  )
}

export default WealthAchievementCard
