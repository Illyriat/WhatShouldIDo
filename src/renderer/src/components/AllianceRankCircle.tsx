import type { AllianceRankStatus } from '@shared/types'

interface Props {
  status: AllianceRankStatus
}

const AP_FORMAT = new Intl.NumberFormat()

function pct(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.min(100, Math.max(0, (numerator / denominator) * 100)) : 0
}

function AllianceRankCircle({ status }: Props): React.JSX.Element {
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
        aria-label={`Rank ${rank}, ${outerPct.toFixed(1)}% of the way to rank 50, ${innerPct.toFixed(1)}% through the current rank`}
      >
        <div className="alliance-circle__inner-ring" style={{ ['--inner-pct' as string]: innerPct }}>
          <div className="alliance-circle__center">
            <span className="alliance-circle__rank">{rank}</span>
            <span className="alliance-circle__subrank">Rank</span>
          </div>
        </div>
      </div>

      <div className="alliance-circle__ap">
        {maxed ? (
          <span className="alliance-circle__maxed">Max rank reached</span>
        ) : (
          <>
            <span>
              {AP_FORMAT.format(currentAP)} / {AP_FORMAT.format(apForMaxRank)} AP
            </span>
            <span className="muted">{AP_FORMAT.format(remaining)} AP to Rank 50</span>
          </>
        )}
      </div>
    </div>
  )
}

export default AllianceRankCircle
