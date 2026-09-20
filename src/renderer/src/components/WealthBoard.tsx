import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
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

function currencyRows(t: TFunction): { key: keyof WealthAmounts; label: string; short: string }[] {
  return [
    { key: 'gold', label: t('wealth.gold'), short: t('wealth.goldShort') },
    { key: 'alliancePoints', label: t('wealth.alliancePoints'), short: t('wealth.apShort') },
    { key: 'telVarStones', label: t('wealth.telVarStones'), short: t('wealth.telVarShort') },
    { key: 'writVouchers', label: t('wealth.writVouchers'), short: t('wealth.writShort') }
  ]
}

function fmt(n: number | undefined, locale: string): string {
  return n === undefined ? '—' : new Intl.NumberFormat(locale).format(n)
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
  const { t, i18n } = useTranslation()
  const [showBreakdown, setShowBreakdown] = useState(false)
  const currencies = currencyRows(t)

  return (
    <section className="board-section wealth-board">
      <div className="pledges-panel__title-row">
        <h2>{t('wealth.title')}</h2>
      </div>
      {server && <p className="wealth-board__subtitle muted">{t('wealth.totalInRealm', { server })}</p>}

      <ul className="wealth-bank-list">
        {currencies.map((c) => (
          <li key={c.key} className="wealth-bank-list__row">
            <span className="wealth-bank-list__label">{c.label}</span>
            <span className="wealth-bank-list__value">{fmt(total(bankWealth, characters, c.key), i18n.language)}</span>
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
          {t('wealth.showBreakdown')}
        </button>

        {showBreakdown && (
          <>
            <h2 className="recommended-title">{t('wealth.bank')}</h2>
            <ul className="wealth-bank-list">
              {currencies.map((c) => (
                <li key={c.key} className="wealth-bank-list__row">
                  <span className="wealth-bank-list__label" title={t('wealth.bankTitle', { label: c.label })}>
                    {c.label}
                  </span>
                  <span className="wealth-bank-list__value">{fmt(bankWealth?.[c.key], i18n.language)}</span>
                </li>
              ))}
            </ul>

            <h2 className="recommended-title">{t('wealth.byCharacter')}</h2>

            {characters.length === 0 ? (
              <p className="muted">{t('wealth.noCharacters')}</p>
            ) : (
              <div className="wealth-table-wrap">
                <table className="wealth-table">
                  <thead>
                    <tr>
                      <th>{t('common.character')}</th>
                      {currencies.map((c) => (
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
                        {currencies.map((cur) => (
                          <td key={cur.key}>{c.wealth ? fmt(c.wealth[cur.key], i18n.language) : '—'}</td>
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
