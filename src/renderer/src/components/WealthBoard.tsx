import { useState } from 'react'
import type { Character, WealthAmounts } from '@shared/types'

interface Props {
  // Shared account-wide bank total for the currently selected server. undefined when the
  // WhatShouldIDoDataCollector addon has no bank data yet for that realm.
  bankWealth: WealthAmounts | undefined
  characters: Character[]
  // Currently selected server, e.g. "NA Megaserver" - shown in the "Total in ... Realm"
  // subtitle since totals are account+realm scoped, not account-wide across realms.
  server: string | null
}

const NUMBER_FORMAT = new Intl.NumberFormat()

const CURRENCIES: { key: keyof WealthAmounts; label: string; short: string }[] = [
  { key: 'gold', label: 'Gold', short: 'Gold' },
  { key: 'alliancePoints', label: 'Alliance Points', short: 'AP' },
  { key: 'telVarStones', label: 'Tel Var Stones', short: 'Tel Var' },
  { key: 'writVouchers', label: 'Writ Vouchers', short: 'Writ' }
]

function fmt(n: number | undefined): string {
  return n === undefined ? '—' : NUMBER_FORMAT.format(n)
}

// Realm total = the shared bank balance plus whatever each character on that realm is
// personally carrying. undefined (rendered as "—") only when neither source has any data
// yet for this currency.
function total(bankWealth: WealthAmounts | undefined, characters: Character[], key: keyof WealthAmounts): number | undefined {
  const hasBank = bankWealth !== undefined
  const hasAnyCharacter = characters.some((c) => c.wealth !== null)
  if (!hasBank && !hasAnyCharacter) return undefined

  const bankAmount = bankWealth?.[key] ?? 0
  const carriedAmount = characters.reduce((sum, c) => sum + (c.wealth?.[key] ?? 0), 0)
  return bankAmount + carriedAmount
}

// Today's Pledges/Riding Training/Alliance Rank all source their data per-character or
// per-realm the same way (see [[project_eso_saved_variables_data_model]]); this board
// mirrors that but for currency - a shared bank total (account+realm scoped, like
// Champion Points) plus each character's own carried amount. The realm total is the
// headline; the bank/by-character split is detail tucked behind a toggle.
function WealthBoard({ bankWealth, characters, server }: Props): React.JSX.Element {
  const [showBreakdown, setShowBreakdown] = useState(false)

  return (
    <section className="board-section wealth-board">
      <div className="pledges-panel__title-row">
        <h2>Wealth</h2>
      </div>
      {server && <p className="wealth-board__subtitle muted">Total in {server} Realm</p>}

      <ul className="wealth-bank-list">
        {CURRENCIES.map((c) => (
          <li key={c.key} className="wealth-bank-list__row">
            <span className="wealth-bank-list__label">{c.label}</span>
            <span className="wealth-bank-list__value">{fmt(total(bankWealth, characters, c.key))}</span>
          </li>
        ))}
      </ul>

      <div className="upcoming-pledges">
        <button
          type="button"
          className="upcoming-pledges__toggle"
          onClick={() => setShowBreakdown((v) => !v)}
          aria-expanded={showBreakdown}
        >
          <span className={`upcoming-pledges__caret${showBreakdown ? ' is-open' : ''}`}>▸</span>
          Show breakdown
        </button>

        {showBreakdown && (
          <>
            <h2 className="recommended-title">Bank</h2>
            <ul className="wealth-bank-list">
              {CURRENCIES.map((c) => (
                <li key={c.key} className="wealth-bank-list__row">
                  <span className="wealth-bank-list__label" title={`${c.label} - shared account-wide bank total`}>
                    {c.label}
                  </span>
                  <span className="wealth-bank-list__value">{fmt(bankWealth?.[c.key])}</span>
                </li>
              ))}
            </ul>

            <h2 className="recommended-title">By Character</h2>

            {characters.length === 0 ? (
              <p className="muted">No characters on this account/server.</p>
            ) : (
              <div className="wealth-table-wrap">
                <table className="wealth-table">
                  <thead>
                    <tr>
                      <th>Character</th>
                      {CURRENCIES.map((c) => (
                        <th key={c.key} title={c.label}>
                          {c.short}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {characters.map((c) => (
                      <tr key={c.charId}>
                        <td className="wealth-table__char">{c.charName}</td>
                        {CURRENCIES.map((cur) => (
                          <td key={cur.key}>{c.wealth ? fmt(c.wealth[cur.key]) : '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default WealthBoard
