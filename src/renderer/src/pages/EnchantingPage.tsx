import { useEffect, useState } from 'react'
import {
  ADDITIVE_POTENCY,
  ASPECT_RUNES,
  ESSENCE_RUNES,
  GLYPHS,
  SUBTRACTIVE_POTENCY,
  POTENCY_RUNES,
  computeGlyph,
  getGlyph,
  glyphForEssence,
  glyphIconUrl,
  runeIconUrl,
  runesForGlyph,
  type GlyphItemType,
  type PotencyRune,
  type PotencyType
} from '@shared/enchanting'

const STORAGE_KEY = 'enchanting-lab-v1'

interface Persisted {
  potencyId: string | null
  essenceId: string | null
  aspectId: string | null
  targetGlyphId: string | null
}

function loadPersisted(): Persisted {
  const fallback: Persisted = { potencyId: null, essenceId: null, aspectId: null, targetGlyphId: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const p = JSON.parse(raw) as Partial<Persisted>
    return {
      potencyId: typeof p.potencyId === 'string' ? p.potencyId : null,
      essenceId: typeof p.essenceId === 'string' ? p.essenceId : null,
      aspectId: typeof p.aspectId === 'string' ? p.aspectId : null,
      targetGlyphId: typeof p.targetGlyphId === 'string' ? p.targetGlyphId : null
    }
  } catch {
    return fallback
  }
}

const ITEM_TYPE_LABEL: Record<GlyphItemType, string> = { weapon: 'Weapon', armor: 'Armor', jewelry: 'Jewelry' }
const ITEM_TYPE_ORDER: GlyphItemType[] = ['weapon', 'armor', 'jewelry']
const POTENCY_TYPE_LABEL: Record<PotencyType, string> = { additive: 'Additive', subtractive: 'Subtractive' }

function EnchantingPage(): React.JSX.Element {
  const [state, setState] = useState<Persisted>(loadPersisted)
  const { potencyId, essenceId, aspectId, targetGlyphId } = state

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage disabled - selection just won't persist */
    }
  }, [state])

  const targetGlyph = targetGlyphId ? getGlyph(targetGlyphId) : undefined
  const target = targetGlyphId ? runesForGlyph(targetGlyphId) : null
  const requiredPotencyType: PotencyType | null = target?.potencyType ?? null
  // A target glyph pins the essence rune; otherwise the user picks it directly.
  const effectiveEssenceId = target ? target.essence.id : essenceId
  const result = computeGlyph(potencyId, effectiveEssenceId, aspectId)

  function patch(next: Partial<Persisted>): void {
    setState((s) => ({ ...s, ...next }))
  }

  function pickPotency(id: string): void {
    patch({ potencyId: potencyId === id ? null : id })
  }

  function pickEssence(id: string): void {
    // Choosing an essence directly clears any target-glyph pin.
    patch({ essenceId: essenceId === id && !target ? null : id, targetGlyphId: null })
  }

  function pickAspect(id: string): void {
    patch({ aspectId: aspectId === id ? null : id })
  }

  function setTarget(glyphId: string): void {
    if (targetGlyphId === glyphId) {
      patch({ targetGlyphId: null })
      return
    }
    const runes = runesForGlyph(glyphId)
    // Drop a now-wrong-type potency rune so the result stays consistent.
    const keepPotency = runes != null && POTENCY_RUNES.find((r) => r.id === potencyId)?.type === runes.potencyType
    patch({ targetGlyphId: glyphId, essenceId: runes?.essence.id ?? essenceId, potencyId: keepPotency ? potencyId : null })
  }

  function renderPotencyColumn(type: PotencyType, runes: PotencyRune[]): React.JSX.Element {
    const dimmed = requiredPotencyType != null && requiredPotencyType !== type
    const needed = requiredPotencyType === type
    return (
      <div className={`ench-potency-col ${dimmed ? 'ench-potency-col--dimmed' : ''}`}>
        <span className="ench-potency-col__title">
          {POTENCY_TYPE_LABEL[type]}
          {needed && <span className="badge badge--warning ench-needed">needed</span>}
        </span>
        <div className="ench-potency-list">
          {runes.map((r) => (
            <button
              key={r.id}
              className={`ench-chip ${potencyId === r.id ? 'ench-chip--active' : ''}`}
              onClick={() => pickPotency(r.id)}
            >
              <img src={runeIconUrl(r.id)} alt="" />
              <span className="ench-chip__name">{r.name}</span>
              <span className="ench-chip__meta">{r.levelLabel}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page page--wide">
      <h2 className="settings-title">Enchanting</h2>

      <p className="muted alchemy-intro">
        Build a glyph from the bottom up, or pick the <strong>glyph you want</strong> and the runes you need light up.
        Potency sets the glyph's level and whether it's <strong>additive</strong> or <strong>subtractive</strong>;
        Essence sets the effect; Aspect sets the quality.
      </p>

      <section className="board-section ench-target">
        <div className="pledges-panel__title-row ench-target__head">
          <h3 className="settings-section-title">I want to make…</h3>
          <select
            className="dropdown"
            value={targetGlyphId ?? ''}
            onChange={(e) => (e.target.value ? setTarget(e.target.value) : patch({ targetGlyphId: null }))}
          >
            <option value="">— any glyph (build manually) —</option>
            {ITEM_TYPE_ORDER.map((it) => (
              <optgroup key={it} label={`${ITEM_TYPE_LABEL[it]} glyphs`}>
                {GLYPHS.filter((g) => g.itemType === it)
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          {targetGlyphId && (
            <button className="refresh-button" onClick={() => patch({ targetGlyphId: null })}>
              Clear target
            </button>
          )}
        </div>

        {target && targetGlyph && (
          <div className="ench-target__hint">
            <img src={glyphIconUrl(targetGlyph.id)} alt="" />
            <p className="muted">
              <strong>{targetGlyph.name}</strong> ({ITEM_TYPE_LABEL[targetGlyph.itemType]}) — use essence rune{' '}
              <strong>{target.essence.name}</strong> ({target.essence.translation}) with any{' '}
              <strong>{POTENCY_TYPE_LABEL[target.potencyType]}</strong> potency rune for the level you want
              (highlighted below). Add an Aspect rune for quality.
            </p>
          </div>
        )}
      </section>

      <section className="board-section alchemy-builder">
        <div className="ench-picker-block">
          <h3 className="settings-section-title">Potency rune</h3>
          <div className="ench-potency-grid">
            {renderPotencyColumn('additive', ADDITIVE_POTENCY)}
            {renderPotencyColumn('subtractive', SUBTRACTIVE_POTENCY)}
          </div>
        </div>

        <div className="ench-picker-block">
          <h3 className="settings-section-title">Essence rune</h3>
          <div className="alchemy-grid">
            {ESSENCE_RUNES.map((r) => {
              const isActive = effectiveEssenceId === r.id
              const dimmed = target != null && !isActive
              return (
                <button
                  key={r.id}
                  className={`alchemy-card ${isActive ? 'alchemy-card--selected' : ''} ${dimmed ? 'alchemy-card--dimmed' : ''}`}
                  title={r.translation}
                  onClick={() => pickEssence(r.id)}
                >
                  <img src={runeIconUrl(r.id)} alt="" />
                  <span>{r.name}</span>
                  <span className="ench-card__sub">{r.translation}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="ench-picker-block">
          <h3 className="settings-section-title">Aspect rune</h3>
          <div className="ench-aspect-row">
            {ASPECT_RUNES.map((r) => (
              <button
                key={r.id}
                className={`ench-chip ench-chip--aspect ${aspectId === r.id ? 'ench-chip--active' : ''}`}
                onClick={() => pickAspect(r.id)}
              >
                <img src={runeIconUrl(r.id)} alt="" />
                <span className="ench-chip__name">{r.name}</span>
                <span className="ench-chip__meta" style={{ color: r.color }}>
                  {r.quality}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="board-section alchemy-result ench-result">
        <div className="pledges-panel__title-row">
          <h3 className="settings-section-title">Resulting Glyph</h3>
        </div>

        {!result ? (
          <p className="muted">
            {target
              ? 'Pick a highlighted Potency rune to finish the glyph.'
              : 'Choose a Potency and an Essence rune to see the glyph.'}
          </p>
        ) : (
          <div className="ench-glyph">
            <img className="ench-glyph__icon" src={glyphIconUrl(result.glyph.id)} alt="" />
            <div className="ench-glyph__body">
              <div className="ench-glyph__headline">
                <span className="ench-glyph__name">{result.glyph.name}</span>
                <span className="badge badge--muted">{ITEM_TYPE_LABEL[result.glyph.itemType]} glyph</span>
                <span className={`badge ench-badge--${result.potency.type}`}>{result.potency.type}</span>
              </div>
              <p className="ench-glyph__effect">{result.glyph.effect}</p>
              <dl className="ench-glyph__stats">
                <div>
                  <dt>Level</dt>
                  <dd>{result.levelLabel}</dd>
                </div>
                <div>
                  <dt>Quality</dt>
                  <dd>
                    {result.aspect ? (
                      <span style={{ color: result.aspect.color }}>{result.aspect.quality}</span>
                    ) : (
                      <span className="muted">pick an Aspect rune</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Runes</dt>
                  <dd>
                    {result.potency.name} + {result.essence.name}
                    {result.aspect ? ` + ${result.aspect.name}` : ''}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </section>

      <section className="board-section">
        <div className="pledges-panel__title-row">
          <h3 className="settings-section-title">Essence rune reference</h3>
          <span className="muted">Click a glyph to target it above.</span>
        </div>
        <div className="dungeon-table-scroll">
          <table className="dungeon-table ench-ref-table">
            <thead>
              <tr>
                <th>Essence</th>
                <th>Translation</th>
                <th>+ Additive potency</th>
                <th>+ Subtractive potency</th>
              </tr>
            </thead>
            <tbody>
              {ESSENCE_RUNES.map((r) => {
                const add = glyphForEssence(r.id, 'additive')
                const sub = glyphForEssence(r.id, 'subtractive')
                const rowActive = target?.essence.id === r.id
                return (
                  <tr key={r.id} className={rowActive ? 'ench-ref__row--active' : ''}>
                    <td className="ench-ref__essence">
                      <img src={runeIconUrl(r.id)} alt="" />
                      {r.name}
                    </td>
                    <td>{r.translation}</td>
                    {[add, sub].map((g, i) => (
                      <td key={i}>
                        {g && (
                          <button
                            className={`ench-ref__glyph ${targetGlyphId === g.id ? 'ench-ref__glyph--target' : ''}`}
                            onClick={() => setTarget(g.id)}
                          >
                            <img src={glyphIconUrl(g.id)} alt="" />
                            <span>
                              {g.name} <span className="muted">({ITEM_TYPE_LABEL[g.itemType]})</span>
                            </span>
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default EnchantingPage
