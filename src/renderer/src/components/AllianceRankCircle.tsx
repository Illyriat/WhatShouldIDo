import { useTranslation } from 'react-i18next'
import type { AllianceRankStatus } from '@shared/types'

interface Props {
  status: AllianceRankStatus
}

function pct(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.min(100, Math.max(0, (numerator / denominator) * 100)) : 0
}

function AllianceRankCircle({ status }: Props): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const apFormat = new Intl.NumberFormat(i18n.language)
  const { rank, currentAP, apForMaxRank, currentRankStartAP, currentRankEndAP } = status
  const maxed = rank >= 50

  // Outer ring: overall progress across the whole Rank 0 -> 50 climb.
  const outerPct = maxed ? 100 : pct(currentAP, apForMaxRank)
  // Inner ring: progress within the character's current rank step only.
  const innerPct = maxed ? 100 : pct(currentAP - currentRankStartAP, currentRankEndAP - currentRankStartAP)
  const remaining = Math.max(0, apForMaxRank - currentAP)

  return (
    <div className="alliance-circle-block">
      <div
        className="alliance-circle"
        style={{ ['--outer-pct' as string]: outerPct }}
        role="img"
        aria-label={t('allianceRank.circleAriaLabel', { rank, outerPct: outerPct.toFixed(1), innerPct: innerPct.toFixed(1) })}
      >
        <div className="alliance-circle__inner-ring" style={{ ['--inner-pct' as string]: innerPct }}>
          <div className="alliance-circle__center">
            <span className="alliance-circle__rank">{rank}</span>
            <span className="alliance-circle__subrank">{t('allianceRank.rank')}</span>
          </div>
        </div>
      </div>

      <div className="alliance-circle__ap">
        {maxed ? (
          <span className="alliance-circle__maxed">{t('allianceRank.maxRankReached')}</span>
        ) : (
          <>
            <span>{t('allianceRank.apOfTotal', { current: apFormat.format(currentAP), max: apFormat.format(apForMaxRank) })}</span>
            <span className="muted">{t('allianceRank.apToRank50', { remaining: apFormat.format(remaining) })}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default AllianceRankCircle
