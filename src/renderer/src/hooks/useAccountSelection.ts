import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Account } from '@shared/types'

type AccountsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; accounts: Account[] }

export interface AccountSelection {
  state: AccountsState
  selectedAccount: string | null
  setSelectedAccount: (accountName: string) => void
  selectedServer: string | null
  setSelectedServer: (server: string) => void
  availableServers: string[]
  selectedCharacters: Account['characters']
  /** re-reads SavedVariables from disk - ESO only writes them on logout/reload UI, so
   *  this app never auto-detects in-game changes; call this after doing so in-game. */
  refresh: () => void
  /** bumped by refresh() - pages with their own separate data fetches (e.g. HomePage's
   *  recommendations) should include this in their own effect's dependency array so a
   *  single refresh() call re-fetches everything together. */
  refreshToken: number
}

/**
 * Shared account/server loading + selection logic (no "All Accounts"/"All Servers"
 * option - always resolves to a specific, valid account+server once accounts.length > 0).
 * Call this ONCE in App.tsx and pass the result down to pages as a prop - calling it
 * per-page would give each page its own independent selection state, which resets
 * back to the default account/server every time the user switches pages.
 */
export function useAccountSelection(): AccountSelection {
  const [state, setState] = useState<AccountsState>({ status: 'loading' })
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    window.api
      .getAccounts()
      .then((accounts) => {
        if (!cancelled) setState({ status: 'ready', accounts })
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ status: 'error', message: err instanceof Error ? err.message : String(err) })
      })

    return () => {
      cancelled = true
    }
    // refreshToken is intentionally the only reason this re-runs after mount - bumping
    // it re-fetches without resetting `state` back to 'loading' first, so the page
    // keeps showing the previous data (no flash) until the fresh read resolves.
  }, [refreshToken])

  const refresh = useCallback(() => setRefreshToken((t) => t + 1), [])

  const availableAccounts = useMemo(() => {
    if (state.status !== 'ready') return []
    return state.accounts.map((a) => a.accountName).sort()
  }, [state])

  useEffect(() => {
    if (availableAccounts.length === 0) {
      setSelectedAccount(null)
      return
    }
    if (!selectedAccount || !availableAccounts.includes(selectedAccount)) {
      setSelectedAccount(availableAccounts[0])
    }
  }, [availableAccounts, selectedAccount])

  const availableServers = useMemo(() => {
    if (state.status !== 'ready' || !selectedAccount) return []
    const account = state.accounts.find((a) => a.accountName === selectedAccount)
    const servers = new Set<string>()
    for (const character of account?.characters ?? []) servers.add(character.server)
    return Array.from(servers).sort()
  }, [state, selectedAccount])

  useEffect(() => {
    if (availableServers.length === 0) {
      setSelectedServer(null)
      return
    }
    if (!selectedServer || !availableServers.includes(selectedServer)) {
      setSelectedServer(availableServers[0])
    }
  }, [availableServers, selectedServer])

  const selectedCharacters = useMemo(() => {
    if (state.status !== 'ready' || !selectedAccount) return []
    const account = state.accounts.find((a) => a.accountName === selectedAccount)
    return (account?.characters ?? []).filter((c) => !selectedServer || c.server === selectedServer)
  }, [state, selectedAccount, selectedServer])

  return {
    state,
    selectedAccount,
    setSelectedAccount,
    selectedServer,
    setSelectedServer,
    availableServers,
    selectedCharacters,
    refresh,
    refreshToken
  }
}
