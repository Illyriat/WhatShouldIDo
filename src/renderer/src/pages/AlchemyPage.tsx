import { useEffect, useMemo, useState } from 'react'
import {
  ALCHEMY_EFFECTS,
  REAGENTS,
  SOLVENTS,
  computeAlchemyResult,
  effectIconUrl,
  findRecipesForEffects,
  getEffect,
  getReagent,
  getSolvent,
  reagentIconUrl,
  solventIconUrl,
  type AlchemyMode
} from '@shared/alchemy'

const MAX_REAGENTS = 3
const MAX_TARGETS = 3
const RECIPES_SHOWN = 15
const STORAGE_KEY = 'alchemy-lab-v1'

interface Persisted {
  mode: AlchemyMode
  solventId: string | null
  reagentIds: string[]
  targetEffectIds: string[]
}

function loadPersisted(): Persisted {
  const fallback: Persisted = { mode: 'potion', solventId: null, reagentIds: [], targetEffectIds: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<Persisted>
    const mode: AlchemyMode = parsed.mode === 'poison' ? 'poison' : 'potion'
    const reagentIds = Array.isArray(parsed.reagentIds)
      ? parsed.reagentIds.filter((id) => typeof id === 'string' && getReagent(id)).slice(0, MAX_REAGENTS)
      : []
    const targetEffectIds = Array.isArray(parsed.targetEffectIds)
      ? parsed.targetEffectIds.filter((id) => typeof id === 'string' && getEffect(id)).slice(0, MAX_TARGETS)
      : []
    const solventId =
      typeof parsed.solventId === 'string' && getSolvent(parsed.solventId)?.mode === mode ? parsed.solventId : null
    return { mode, solventId, reagentIds, targetEffectIds }
  } catch {
    return fallback
  }
}

function AlchemyPage(): React.JSX.Element {
  const [{ mode, solventId, reagentIds, targetEffectIds }, setState] = useState<Persisted>(loadPersisted)
  const [query, setQuery] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, solventId, reagentIds, targetEffectIds }))
    } catch {
      /* private mode / storage disabled - selection just won't persist */
    }
  }, [mode, solventId, reagentIds, targetEffectIds])

  const result = useMemo(() => computeAlchemyResult(reagentIds, mode), [reagentIds, mode])
  const recipes = useMemo(
    () => findRecipesForEffects(targetEffectIds, mode, 60),
    [targetEffectIds, mode]
  )
  const suggestedReagentIds = useMemo(
    () => new Set(recipes.flatMap((m) => m.reagentIds)),
    [recipes]
  )
  const solvent = solventId ? getSolvent(solventId) : undefined
  const modeSolvents = SOLVENTS.filter((s) => s.mode === mode)

  function setMode(next: AlchemyMode): void {
    setState((s) => ({
      ...s,
      mode: next,
      solventId: s.solventId && getSolvent(s.solventId)?.mode === next ? s.solventId : null
    }))
  }

  function toggleReagent(id: string): void {
    setState((s) => {
      if (s.reagentIds.includes(id)) {
        return { ...s, reagentIds: s.reagentIds.filter((r) => r !== id) }
      }
      if (s.reagentIds.length >= MAX_REAGENTS) return s
      return { ...s, reagentIds: [...s.reagentIds, id] }
    })
  }

  function clearReagents(): void {
    setState((s) => ({ ...s, reagentIds: [] }))
  }

  function toggleTarget(id: string): void {
    setState((s) => {
      if (s.targetEffectIds.includes(id)) {
        return { ...s, targetEffectIds: s.targetEffectIds.filter((e) => e !== id) }
      }
      if (s.targetEffectIds.length >= MAX_TARGETS) return s
      return { ...s, targetEffectIds: [...s.targetEffectIds, id] }
    })
  }

  function clearTargets(): void {
    setState((s) => ({ ...s, targetEffectIds: [] }))
  }

  function useRecipe(ids: string[]): void {
    setState((s) => ({ ...s, reagentIds: ids.slice(0, MAX_REAGENTS) }))
  }

  const activeTraitIds = new Set(result.effects.map((e) => e.effect.id))
  const filteredReagents = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return REAGENTS
    return REAGENTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.traits.some((t) => getEffect(t)?.name.toLowerCase().includes(q))
    )
  }, [query])

  const slots = Array.from({ length: MAX_REAGENTS }, (_, i) => reagentIds[i] ?? null)
  const counterproductive = new Set(result.counterproductiveEffectIds)
  const targetSet = new Set(targetEffectIds)
  const searching = targetEffectIds.length > 0

  return (
    <div className="page page--wide">
      <h2 className="settings-title">Potion Crafting</h2>

      <p className="muted alchemy-intro">
        Pick a solvent and 2–3 reagents. Any trait shared by <strong>two or more</strong> of your reagents becomes an
        active effect. Water solvents make <strong>potions</strong> (effects land on you); oils make{' '}
        <strong>poisons</strong> (effects land on the enemy you hit).
      </p>

      <section className="board-section">
        <div className="pledges-panel__title-row alchemy-picker__head">
          <h3 className="settings-section-title">Find a recipe by effect</h3>
          <span className="muted">
            {searching
              ? `${recipes.length} ${mode === 'potion' ? 'potion' : 'poison'} combination${recipes.length === 1 ? '' : 's'} — best first`
              : `Pick up to ${MAX_TARGETS} effects you want in the result`}
          </span>
          {searching && (
            <button className="refresh-button" onClick={clearTargets}>
              Clear
            </button>
          )}
        </div>

        <div className="alchemy-target-effects">
          {ALCHEMY_EFFECTS.map((e) => {
            const on = targetSet.has(e.id)
            const disabled = !on && targetEffectIds.length >= MAX_TARGETS
            return (
              <button
                key={e.id}
                className={`alchemy-target-chip alchemy-target-chip--${e.kind} ${on ? 'alchemy-target-chip--on' : ''}`}
                disabled={disabled}
                title={e.description}
                onClick={() => toggleTarget(e.id)}
              >
                <img src={effectIconUrl(e.id)} alt="" />
                {e.name}
              </button>
            )
          })}
        </div>

        {searching && (
          <div className="alchemy-recipes">
            {recipes.length === 0 ? (
              <p className="muted alchemy-warning">
                No 2–3 reagent combination produces{' '}
                <strong>{targetEffectIds.map((id) => getEffect(id)?.name).join(' + ')}</strong> together
                {mode === 'potion' ? ' in a potion' : ' in a poison'}.
              </p>
            ) : (
              <ul className="alchemy-recipe-list">
                {recipes.slice(0, RECIPES_SHOWN).map((m) => {
                  const key = m.reagentIds.join('+')
                  const isCurrent = key === reagentIds.join('+')
                  return (
                    <li key={key} className={`alchemy-recipe ${isCurrent ? 'alchemy-recipe--current' : ''}`}>
                      <div className="alchemy-recipe__reagents">
                        {m.reagentIds.map((id) => (
                          <span key={id} className="alchemy-recipe__reagent">
                            <img src={reagentIconUrl(id)} alt="" />
                            {getReagent(id)?.name}
                          </span>
                        ))}
                      </div>
                      <div className="alchemy-recipe__effects">
                        {m.result.effects.map((re) => (
                          <img
                            key={re.effect.id}
                            src={effectIconUrl(re.effect.id)}
                            alt={re.effect.name}
                            title={re.effect.name}
                            className={`alchemy-recipe__eff alchemy-recipe__eff--${re.effect.kind} ${
                              targetSet.has(re.effect.id) ? 'alchemy-recipe__eff--target' : ''
                            }`}
                          />
                        ))}
                        {!m.clean && (
                          <span className="badge badge--warning">
                            +{mode === 'potion' ? ' negatives' : ' wasted positives'}
                          </span>
                        )}
                      </div>
                      <button className="refresh-button" onClick={() => useRecipe(m.reagentIds)}>
                        {isCurrent ? 'Loaded' : 'Use'}
                      </button>
                    </li>
                  )
                })}
                {recipes.length > RECIPES_SHOWN && (
                  <li className="muted alchemy-recipe__more">
                    +{recipes.length - RECIPES_SHOWN} more — add another effect to narrow it down.
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="board-section alchemy-builder">
        <div className="alchemy-mode-toggle" role="group" aria-label="Potion or poison">
          <button
            className={`alchemy-mode-btn ${mode === 'potion' ? 'alchemy-mode-btn--active' : ''}`}
            onClick={() => setMode('potion')}
          >
            Potion
          </button>
          <button
            className={`alchemy-mode-btn ${mode === 'poison' ? 'alchemy-mode-btn--active' : ''}`}
            onClick={() => setMode('poison')}
          >
            Poison
          </button>
        </div>

        <label className="alchemy-solvent-row">
          <span className="dropdown-label">Solvent</span>
          {solvent && <img className="alchemy-solvent-icon" src={solventIconUrl(solvent.id)} alt="" />}
          <select
            className="dropdown"
            value={solventId ?? ''}
            onChange={(e) => setState((s) => ({ ...s, solventId: e.target.value || null }))}
          >
            <option value="">Any / not chosen</option>
            {modeSolvents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.requirement}
              </option>
            ))}
          </select>
          {solvent && (
            <span className="muted">
              Requires <strong>{solvent.requirement}</strong>
            </span>
          )}
        </label>

        <div className="alchemy-slots">
          {slots.map((id, i) => {
            const reagent = id ? getReagent(id) : undefined
            return (
              <div key={i} className={`alchemy-slot ${reagent ? '' : 'alchemy-slot--empty'}`}>
                {reagent ? (
                  <>
                    <button
                      className="alchemy-slot__remove"
                      onClick={() => toggleReagent(reagent.id)}
                      aria-label={`Remove ${reagent.name}`}
                      title="Remove"
                    >
                      ×
                    </button>
                    <img className="alchemy-slot__icon" src={reagentIconUrl(reagent.id)} alt="" />
                    <span className="alchemy-slot__name">{reagent.name}</span>
                    <ul className="alchemy-slot__traits">
                      {reagent.traits.map((t) => {
                        const eff = getEffect(t)
                        if (!eff) return null
                        const matched = activeTraitIds.has(t)
                        return (
                          <li
                            key={t}
                            className={`alchemy-trait ${matched ? 'alchemy-trait--matched' : ''} alchemy-trait--${eff.kind}`}
                          >
                            <img src={effectIconUrl(t)} alt="" />
                            {eff.name}
                          </li>
                        )
                      })}
                    </ul>
                  </>
                ) : (
                  <span className="alchemy-slot__placeholder">Empty slot — add a reagent below</span>
                )}
              </div>
            )
          })}
        </div>

        {result.wastedReagentIds.length > 0 && (
          <p className="muted alchemy-warning">
            No shared trait:{' '}
            <strong>{result.wastedReagentIds.map((id) => getReagent(id)?.name).join(', ')}</strong> — currently adds
            nothing to the mix.
          </p>
        )}
      </section>

      <div className="alchemy-columns">
        <section className="board-section alchemy-picker">
          <div className="pledges-panel__title-row alchemy-picker__head">
            <h3 className="settings-section-title">Reagents</h3>
            <input
              className="dropdown alchemy-search"
              type="search"
              placeholder="Filter by name or effect…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {reagentIds.length > 0 && (
              <button className="refresh-button" onClick={clearReagents}>
                Clear
              </button>
            )}
          </div>

          <div className="alchemy-grid">
            {filteredReagents.map((r) => {
              const selected = reagentIds.includes(r.id)
              const full = reagentIds.length >= MAX_REAGENTS && !selected
              const suggested = searching && !selected && suggestedReagentIds.has(r.id)
              const faded = searching && !selected && !suggestedReagentIds.has(r.id)
              return (
                <button
                  key={r.id}
                  className={`alchemy-card ${selected ? 'alchemy-card--selected' : ''} ${
                    suggested ? 'alchemy-card--suggested' : ''
                  } ${faded ? 'alchemy-card--dimmed' : ''}`}
                  disabled={full}
                  title={
                    full
                      ? 'Remove a reagent first'
                      : r.traits.map((t) => getEffect(t)?.name).join(', ')
                  }
                  onClick={() => toggleReagent(r.id)}
                >
                  <img src={reagentIconUrl(r.id)} alt="" />
                  <span>{r.name}</span>
                </button>
              )
            })}
            {filteredReagents.length === 0 && <p className="muted">No reagent matches “{query}”.</p>}
          </div>
        </section>

        <section className="board-section alchemy-result">
          <div className="pledges-panel__title-row">
            <h3 className="settings-section-title">
              {mode === 'potion' ? 'Resulting Potion' : 'Resulting Poison'}
            </h3>
          </div>

          {reagentIds.length < 2 ? (
            <p className="muted">Add at least two reagents to see what you’ll make.</p>
          ) : result.effects.length === 0 ? (
            <p className="muted">
              These reagents share no traits — this combination produces nothing. Try reagents with overlapping
              effects.
            </p>
          ) : (
            <>
              <ul className="alchemy-effects">
                {result.effects.map(({ effect, sourceReagentIds }) => (
                  <li
                    key={effect.id}
                    className={`alchemy-effect alchemy-effect--${effect.kind} ${
                      counterproductive.has(effect.id) ? 'alchemy-effect--counter' : ''
                    }`}
                  >
                    <img className="alchemy-effect__icon" src={effectIconUrl(effect.id)} alt="" />
                    <div className="alchemy-effect__body">
                      <span className="alchemy-effect__name">
                        {effect.name}
                        {counterproductive.has(effect.id) && (
                          <span className="badge badge--warning alchemy-effect__flag">
                            {mode === 'potion' ? 'harms you' : 'helps target'}
                          </span>
                        )}
                      </span>
                      <span className="alchemy-effect__desc">{effect.description}</span>
                      <span className="alchemy-effect__from">
                        from {sourceReagentIds.map((id) => getReagent(id)?.name).join(' + ')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {result.counterproductiveEffectIds.length > 0 && (
                <p className="muted alchemy-warning">
                  {mode === 'potion'
                    ? 'This potion carries negative effects that will land on you. Swap a reagent to drop them, or take Snakeblood to shorten them.'
                    : 'This poison carries positive effects that will land on your target. Swap a reagent to drop them.'}
                </p>
              )}
            </>
          )}
        </section>
      </div>

      <section className="board-section">
        <div className="pledges-panel__title-row">
          <h3 className="settings-section-title">Effect reference</h3>
          <span className="muted">Click an effect to search for recipes that make it.</span>
        </div>
        <ul className="alchemy-reference">
          {ALCHEMY_EFFECTS.map((e) => {
            const on = targetSet.has(e.id)
            const disabled = !on && targetEffectIds.length >= MAX_TARGETS
            return (
              <li key={e.id}>
                <button
                  className={`alchemy-ref alchemy-ref--${e.kind} ${on ? 'alchemy-ref--on' : ''}`}
                  disabled={disabled}
                  onClick={() => toggleTarget(e.id)}
                >
                  <img src={effectIconUrl(e.id)} alt="" />
                  <div>
                    <span className="alchemy-ref__name">{e.name}</span>
                    <span className="alchemy-ref__desc">{e.description}</span>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export default AlchemyPage
