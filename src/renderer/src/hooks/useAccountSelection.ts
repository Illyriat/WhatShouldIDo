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
  // Re-reads SavedVariables from disk. ESO only writes them on logout / /reloadui,
  // so there's no live detection; call this after doing either in-game.
  refresh: () => void
  // Bumped by refresh(). Pages that fetch their own data should depend on this so
  // one refresh() re-fetches everything.
  refreshToken: number
}

/**
 * Shared account/server loading and selection. Always resolves to a specific account
 * and server once any accounts exist (there's no "All" option).
 *
 * Call once in App.tsx and pass the result down as a prop. Per-page instances would
 * each hold their own selection and reset on every navigation.
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
    // Only refreshToken re-runs this after mount. It doesn't reset `state` to
    // 'loading', so the previous data stays on screen until the new read resolves.
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
