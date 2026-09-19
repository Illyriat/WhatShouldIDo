import { useEffect, useRef, useState } from 'react'
import { MUSIC_BOXES } from '@shared/musicBoxes'
import type { AccountSelection } from './useAccountSelection'

// Pre-account-scoping key: one shared checklist for everyone. Migrated into the first
// resolved scope the first time this loads under the new per-account/server scheme.
const LEGACY_STORAGE_KEY = 'musicbox-collection-v1'
const MIGRATED_MARKER = 'musicbox-collection-migrated-v1'

// Bucket used when no ESO account/server data is available (no USPF/SkillLines addon
// detected yet). It's still a real, stable scope - not a special case in storage.
const NO_ACCOUNT = '_no_account_'
const NO_SERVER = '_no_server_'

function scopeKeyFor(accountName: string | null, server: string | null): string {
  return `${LEGACY_STORAGE_KEY}::${accountName ?? NO_ACCOUNT}::${server ?? NO_SERVER}`
}

function validIds(ids: unknown): Set<string> {
  if (!Array.isArray(ids)) return new Set()
  const known = new Set(MUSIC_BOXES.map((b) => b.id))
  return new Set(ids.filter((id): id is string => typeof id === 'string' && known.has(id)))
}

// Reads the collection for one account/server scope, migrating the old flat (pre-scoping)
// key into whichever scope resolves first, exactly once.
function loadCollected(scopeKey: string): Set<string> {
  try {
    const raw = localStorage.getItem(scopeKey)
    if (raw) return validIds(JSON.parse(raw))

    if (!localStorage.getItem(MIGRATED_MARKER)) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
      localStorage.setItem(MIGRATED_MARKER, '1')
      if (legacy) {
        localStorage.setItem(scopeKey, legacy)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
        return validIds(JSON.parse(legacy))
      }
    }
    return new Set()
  } catch {
    return new Set()
  }
}

function persistCollected(scopeKey: string, collected: Set<string>): void {
  try {
    localStorage.setItem(scopeKey, JSON.stringify([...collected]))
  } catch {
    /* private mode / storage disabled - progress just won't persist */
  }
}

export interface MusicBoxCollection {
  // Accounts resolve asynchronously (read from SavedVariables on disk); false while that
  // one-time read is still in flight, so callers don't briefly render the no-account
  // bucket and swap it out from under the user a moment later.
  accountsReady: boolean
  hasAccounts: boolean
  collected: Set<string>
  toggle: (id: string) => void
}

export function useMusicBoxCollection(accountSelection: AccountSelection): MusicBoxCollection {
  const { state, selectedAccount, selectedServer } = accountSelection

  const accountsReady = state.status !== 'loading'
  const hasAccounts = state.status === 'ready' && state.accounts.length > 0
  const scopeKey = accountsReady ? scopeKeyFor(selectedAccount, selectedServer) : null

  const [collected, setCollected] = useState<Set<string>>(new Set())
  const scopeKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!scopeKey) return
    scopeKeyRef.current = scopeKey
    setCollected(loadCollected(scopeKey))
  }, [scopeKey])

  function toggle(id: string): void {
    setCollected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      // Written against the scope active at toggle time, not reactively off `collected` -
      // that would race a scope switch and write the old account's set into the new one.
      if (scopeKeyRef.current) persistCollected(scopeKeyRef.current, next)
      return next
    })
  }

  return { accountsReady, hasAccounts, collected, toggle }
}
